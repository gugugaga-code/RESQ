import { create } from 'zustand'
import { alerts } from '../data/mock/alerts.mock'
import { hospitals } from '../data/mock/hospitals.mock'
import { incidents } from '../data/mock/incidents.mock'
import { recommendations } from '../data/mock/aiRecommendations.mock'
import { resources } from '../data/mock/resources.mock'
import { riskZones } from '../data/mock/riskZones.mock'
import { validateDispatch } from '../services/dispatchService'
import { rankResourcesForIncident } from '../services/resourceAllocationService'
import { createPlannedRoute, fetchEmergencyRoute } from '../services/routeService'
import type { AIRecommendation } from '../types/ai.types'
import type { SystemAlert } from '../types/alert.types'
import type { Hospital } from '../types/hospital.types'
import type { Incident } from '../types/incident.types'
import type { Resource } from '../types/resource.types'
import type { EmergencyRoute } from '../types/route.types'
import type { RiskZone } from '../types/riskZone.types'
import type { SystemStatus } from '../types/system.types'
import type { DispatchResult } from '../services/dispatchService'
import type { ResourceAllocationRecommendation } from '../services/resourceAllocationService'

interface CrisisState {
  incidents: Incident[]; resources: Resource[]; riskZones: RiskZone[]; hospitals: Hospital[]; alerts: SystemAlert[]; recommendations: AIRecommendation[]
  allocationRecommendations: ResourceAllocationRecommendation[]; allocationIncidentId: string | null; routes: EmergencyRoute[]; system: SystemStatus; selectedIncidentId: string | null
  setIncidents: (items: Incident[]) => void; upsertIncident: (item: Incident) => void; removeIncident: (id: string) => void; setResources: (items: Resource[]) => void; upsertResource: (item: Resource) => void
  setRiskZones: (items: RiskZone[]) => void; addAlert: (item: SystemAlert) => void; acknowledgeAlert: (id: string) => void; setSystemStatus: (item: SystemStatus) => void; selectIncident: (id: string | null) => void
  calculateAllocationForSelectedIncident: () => void; dispatchResource: (resourceId: string, incidentId: string) => DispatchResult; fetchRouteForDispatch: (resourceId: string, incidentId: string) => Promise<void>; upsertRoute: (route: EmergencyRoute) => void; removeRoute: (id: string) => void
}

const upsert = <T extends { id: string }>(items: T[], item: T) => items.some(({ id }) => id === item.id) ? items.map((entry) => entry.id === item.id ? item : entry) : [item, ...items]

export const useCrisisStore = create<CrisisState>((set, get) => ({
  incidents, resources, riskZones, hospitals, alerts, recommendations, allocationRecommendations: [], allocationIncidentId: null, routes: [], selectedIncidentId: 'inc-001',
  system: { connectivity: 'online', lastSyncedAt: '2026-08-14T09:08:00+05:30', activeIncidentCount: 4, activeResourceCount: 5, pendingSyncActions: 0 },
  setIncidents: (incidents) => set({ incidents }), upsertIncident: (item) => set((state) => ({ incidents: upsert(state.incidents, item) })), removeIncident: (id) => set((state) => ({ incidents: state.incidents.filter((item) => item.id !== id) })),
  setResources: (resources) => set({ resources }), upsertResource: (item) => set((state) => ({ resources: upsert(state.resources, item) })), setRiskZones: (riskZones) => set({ riskZones }), addAlert: (item) => set((state) => ({ alerts: [item, ...state.alerts] })),
  acknowledgeAlert: (id) => set((state) => ({ alerts: state.alerts.map((alert) => alert.id === id ? { ...alert, acknowledged: true } : alert) })), setSystemStatus: (system) => set({ system }),
  selectIncident: (selectedIncidentId) => { set({ selectedIncidentId }); get().calculateAllocationForSelectedIncident() },
  calculateAllocationForSelectedIncident: () => { const state = get(); const incident = state.incidents.find((item) => item.id === state.selectedIncidentId); set({ allocationIncidentId: incident?.id ?? null, allocationRecommendations: incident ? rankResourcesForIncident(incident, state.resources) : [] }) },
  upsertRoute: (route) => set((state) => ({ routes: upsert(state.routes, route) })), removeRoute: (id) => set((state) => ({ routes: state.routes.filter((route) => route.id !== id) })),
  dispatchResource: (resourceId, incidentId) => {
    const state = get(); const resource = state.resources.find((item) => item.id === resourceId); const incident = state.incidents.find((item) => item.id === incidentId)
    const distanceKm = state.allocationIncidentId === incidentId ? state.allocationRecommendations.find((item) => item.resource.id === resourceId)?.distanceKm : undefined
    const result = validateDispatch(resource, incident, distanceKm)
    if (!result.success || !resource || !incident) return result
    const now = new Date().toISOString()
    set({
      resources: state.resources.map((item) => item.id === resourceId ? { ...item, status: 'dispatched', assignedIncidentId: incidentId, etaMinutes: result.etaMinutes, lastUpdated: now } : item),
      incidents: state.incidents.map((item) => item.id === incidentId ? { ...item, assignedResourceIds: item.assignedResourceIds.includes(resourceId) ? item.assignedResourceIds : [...item.assignedResourceIds, resourceId], updatedAt: now } : item),
    })
    get().calculateAllocationForSelectedIncident()
    void get().fetchRouteForDispatch(resource.id, incident.id)
    return result
  },
  fetchRouteForDispatch: async (resourceId, incidentId) => {
    const state = get(); const routeId = `route-${resourceId}-${incidentId}`
    const existingRoute = state.routes.find((route) => route.id === routeId)
    if (existingRoute?.status === 'active' || existingRoute?.status === 'planned') return
    const resource = state.resources.find((item) => item.id === resourceId); const incident = state.incidents.find((item) => item.id === incidentId)
    if (!resource || !incident || resource.status !== 'dispatched' || resource.assignedIncidentId !== incident.id) return
    set((current) => ({ routes: upsert(current.routes, createPlannedRoute(resource.id, incident.id)) }))
    try {
      const route = await fetchEmergencyRoute(resource.id, resource.location, incident.id, incident.location)
      set((current) => ({ routes: upsert(current.routes, route), resources: current.resources.map((item) => item.id === resource.id ? { ...item, etaMinutes: Math.max(1, Math.ceil(route.durationSeconds! / 60)) } : item) }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to calculate route.'
      set((current) => ({ routes: upsert(current.routes, { ...createPlannedRoute(resource.id, incident.id), status: 'blocked', error: message }) }))
    }
  },
}))
