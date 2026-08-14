import type { GeoPoint } from './incident.types'
export type HospitalStatus = 'operational' | 'strained' | 'diverting'
export interface Hospital { id: string; name: string; location: GeoPoint; bedCapacity: number; bedsAvailable: number; traumaLevel: 1 | 2 | 3; status: HospitalStatus }
