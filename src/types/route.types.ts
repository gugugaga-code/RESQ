import type { GeoPoint } from './incident.types'
export type RouteStatus = 'planned' | 'active' | 'completed' | 'blocked'
export interface EmergencyRoute { id: string; resourceId: string; destinationId: string; path: GeoPoint[]; distanceMeters: number | null; durationSeconds: number | null; status: RouteStatus; error?: string }
