import { create } from 'zustand'
import { alerts } from '../data/mock/alerts.mock'
import { hospitals } from '../data/mock/hospitals.mock'
import { incidents } from '../data/mock/incidents.mock'
import { recommendations } from '../data/mock/aiRecommendations.mock'
import { resources } from '../data/mock/resources.mock'
import { riskZones } from '../data/mock/riskZones.mock'
import type { AIRecommendation } from '../types/ai.types'
import type { SystemAlert } from '../types/alert.types'
import type { Hospital } from '../types/hospital.types'
import type { Incident } from '../types/incident.types'
import type { Resource } from '../types/resource.types'
import type { RiskZone } from '../types/riskZone.types'
import type { SystemStatus } from '../types/system.types'

interface CrisisState { incidents: Incident[]; resources: Resource[]; riskZones: RiskZone[]; hospitals: Hospital[]; alerts: SystemAlert[]; recommendations: AIRecommendation[]; system: SystemStatus; selectedIncidentId: string | null; setIncidents: (items: Incident[]) => void; upsertIncident: (item: Incident) => void; removeIncident: (id: string) => void; setResources: (items: Resource[]) => void; upsertResource: (item: Resource) => void; setRiskZones: (items: RiskZone[]) => void; addAlert: (item: SystemAlert) => void; acknowledgeAlert: (id: string) => void; setSystemStatus: (item: SystemStatus) => void; selectIncident: (id: string | null) => void }
const upsert = <T extends { id: string }>(items: T[], item: T) => items.some(({ id }) => id === item.id) ? items.map((entry) => entry.id === item.id ? item : entry) : [item, ...items]
export const useCrisisStore = create<CrisisState>((set) => ({
  incidents, resources, riskZones, hospitals, alerts, recommendations, selectedIncidentId: 'inc-001', system: { connectivity: 'online', lastSyncedAt: '2026-08-14T09:08:00+05:30', activeIncidentCount: 4, activeResourceCount: 5, pendingSyncActions: 0 },
  setIncidents: (incidents) => set({ incidents }), upsertIncident: (item) => set((state) => ({ incidents: upsert(state.incidents, item) })), removeIncident: (id) => set((state) => ({ incidents: state.incidents.filter((item) => item.id !== id) })), setResources: (resources) => set({ resources }), upsertResource: (item) => set((state) => ({ resources: upsert(state.resources, item) })), setRiskZones: (riskZones) => set({ riskZones }), addAlert: (item) => set((state) => ({ alerts: [item, ...state.alerts] })), acknowledgeAlert: (id) => set((state) => ({ alerts: state.alerts.map((alert) => alert.id === id ? { ...alert, acknowledged: true } : alert) })), setSystemStatus: (system) => set({ system }), selectIncident: (selectedIncidentId) => set({ selectedIncidentId })
}))
