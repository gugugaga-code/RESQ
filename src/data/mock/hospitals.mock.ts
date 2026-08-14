import type { Hospital } from '../../types/hospital.types'
export const hospitals: Hospital[] = [
  { id: 'hospital-1', name: 'St. Martha’s Hospital', location: { lat: 12.9662, lng: 77.5972 }, bedCapacity: 500, bedsAvailable: 47, traumaLevel: 1, status: 'operational' },
  { id: 'hospital-2', name: 'Manipal Hospital, HAL Road', location: { lat: 12.9592, lng: 77.6495 }, bedCapacity: 650, bedsAvailable: 22, traumaLevel: 1, status: 'strained' },
  { id: 'hospital-3', name: 'Bowring Hospital', location: { lat: 12.9833, lng: 77.6015 }, bedCapacity: 350, bedsAvailable: 61, traumaLevel: 2, status: 'operational' }
]
