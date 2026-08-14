import type { GeoPoint } from './incident.types'
export type RouteStatus = 'planned' | 'active' | 'completed' | 'blocked'
export interface EmergencyRoute { id: string; resourceId: string; destinationId: string; path: GeoPoint[]; distanceMeters: number; durationSeconds: number; status: RouteStatus }
