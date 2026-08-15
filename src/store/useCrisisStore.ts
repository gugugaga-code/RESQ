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
import { majorFloodScenario, pauseSimulationTimer, startSimulationTimer } from '../services/simulationEngine'
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
import type { SimulationStatus } from '../services/simulationEngine'

interface CrisisState {
  incidents: Incident[]; resources: Resource[]; riskZones: RiskZone[]; hospitals: Hospital[]; alerts: SystemAlert[]; recommendations: AIRecommendation[]
  allocationRecommendations: ResourceAllocationRecommendation[]; allocationIncidentId: string | null; routes: EmergencyRoute[]; system: SystemStatus; selectedIncidentId: string | null
  simulationStatus: SimulationStatus; simulationStep: number; simulationEvent: string | null
  setIncidents: (items: Incident[]) => void; upsertIncident: (item: Incident) => void; removeIncident: (id: string) => void; setResources: (items: Resource[]) => void; upsertResource: (item: Resource) => void
  setRiskZones: (items: RiskZone[]) => void; addAlert: (item: SystemAlert) => void; acknowledgeAlert: (id: string) => void; setSystemStatus: (item: SystemStatus) => void; selectIncident: (id: string | null) => void
  calculateAllocationForSelectedIncident: () => void; dispatchResource: (resourceId: string, incidentId: string) => DispatchResult; fetchRouteForDispatch: (resourceId: string, incidentId: string) => Promise<void>; upsertRoute: (route: EmergencyRoute) => void; removeRoute: (id: string) => void
  startSimulation: () => void; pauseSimulation: () => void; resetSimulation: () => void; advanceSimulation: () => void
}

const upsert = <T extends { id: string }>(items: T[], item: T) => items.some(({ id }) => id === item.id) ? items.map((entry) => entry.id === item.id ? item : entry) : [item, ...items]
const cloneInitial = <T,>(value: T): T => structuredClone(value)
const initialSelectedIncidentId = 'inc-001'

export const useCrisisStore = create<CrisisState>((set, get) => ({
  incidents, resources, riskZones, hospitals, alerts, recommendations, allocationRecommendations: [], allocationIncidentId: null, routes: [], selectedIncidentId: 'inc-001', simulationStatus: 'idle', simulationStep: 0, simulationEvent: null,
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
  startSimulation: () => { const state = get(); if (state.simulationStatus === 'completed') get().resetSimulation(); set({ simulationStatus: 'running', simulationEvent: state.simulationStep ? state.simulationEvent : majorFloodScenario[0].message, selectedIncidentId: 'inc-001' }); get().calculateAllocationForSelectedIncident(); startSimulationTimer(get().advanceSimulation) },
  pauseSimulation: () => { pauseSimulationTimer(); set({ simulationStatus: 'paused' }) },
  resetSimulation: () => { pauseSimulationTimer(); const restoredIncidents = cloneInitial(incidents); const restoredResources = cloneInitial(resources); set({ incidents: restoredIncidents, resources: restoredResources, riskZones: cloneInitial(riskZones), hospitals: cloneInitial(hospitals), alerts: cloneInitial(alerts), recommendations: cloneInitial(recommendations), routes: [], selectedIncidentId: initialSelectedIncidentId, allocationIncidentId: initialSelectedIncidentId, allocationRecommendations: rankResourcesForIncident(restoredIncidents.find((item) => item.id === initialSelectedIncidentId)!, restoredResources), simulationStatus: 'idle', simulationStep: 0, simulationEvent: null }) },
  advanceSimulation: () => { const state = get(); if (state.simulationStatus !== 'running') return; const event = majorFloodScenario[state.simulationStep]; const flood = state.incidents.find((item) => item.id === 'inc-001'); if (!event || !flood) return; if (event.requiresOperator && !flood.assignedResourceIds.some((id) => state.resources.find((resource) => resource.id === id)?.status === 'dispatched')) { pauseSimulationTimer(); set({ simulationStatus: 'paused', simulationEvent: event.message }); return } const nextStep = state.simulationStep + 1; const route = state.routes.find((item) => item.destinationId === flood.id && item.status === 'active'); if (event.step === 3 && route?.path.length) set({ resources: state.resources.map((resource) => resource.id === route.resourceId ? { ...resource, location: route.path[Math.min(route.path.length - 1, Math.ceil(route.path.length * .6))], etaMinutes: Math.max(1, Math.ceil((route.durationSeconds ?? 60) / 120)) } : resource) }); if (event.step === 4) set({ riskZones: state.riskZones.map((zone) => zone.id === 'zone-1' ? { ...zone, confidence: 96, reason: 'Floodwater expansion detected during live simulation.' } : zone), alerts: [{ id: 'sim-flood-risk', severity: 'high', message: event.message, source: 'Live crisis simulation', createdAt: new Date().toISOString(), acknowledged: false, relatedIncidentId: flood.id }, ...state.alerts] }); if (event.step === 5) { pauseSimulationTimer(); set({ simulationStatus: 'completed', simulationStep: nextStep, simulationEvent: event.message, incidents: state.incidents.map((item) => item.id === flood.id ? { ...item, status: 'contained' } : item), resources: state.resources.map((resource) => resource.assignedIncidentId === flood.id ? { ...resource, status: 'available', assignedIncidentId: null, etaMinutes: null } : resource) }); return } set({ simulationStep: nextStep, simulationEvent: event.message }) },
}))
