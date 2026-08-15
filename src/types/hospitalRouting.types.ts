import type { Hospital } from './hospital.types'

export type HospitalSuitability = 'preferred' | 'appropriate' | 'limited' | 'unsuitable'
export type MedicalHandoffStatus = 'none' | 'destination_selected' | 'en_route' | 'arrived' | 'handed_off'

export interface HospitalRecommendation {
  hospital: Hospital
  score: number
  distanceKm: number
  suitability: HospitalSuitability
  deployable: boolean
  reasons: string[]
}

export interface MedicalDestination {
  id: string
  incidentId: string
  resourceId: string
  hospitalId: string
  status: MedicalHandoffStatus
  confirmedAt: string
}
