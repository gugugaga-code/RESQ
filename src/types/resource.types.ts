import type { GeoPoint } from './incident.types'
export type ResourceType = 'ambulance' | 'fire_truck' | 'police_unit' | 'rescue_team' | 'medical_team' | 'drone' | 'shelter_unit'
export type ResourceStatus = 'available' | 'dispatched' | 'busy' | 'offline'
export interface Resource { id: string; type: ResourceType; callSign: string; status: ResourceStatus; location: GeoPoint; capacity: number; assignedIncidentId: string | null; etaMinutes: number | null; lastUpdated: string }
