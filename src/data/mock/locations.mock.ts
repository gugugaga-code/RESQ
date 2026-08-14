import type { GeoPoint } from '../../types/incident.types'
export interface EmergencyLocation { id: string; label: string; location: GeoPoint }
export const emergencyLocations: EmergencyLocation[] = [
  { id: 'koramangala', label: 'Koramangala', location: { lat: 12.9352, lng: 77.6245 } },
  { id: 'indiranagar', label: 'Indiranagar', location: { lat: 12.9784, lng: 77.6408 } },
  { id: 'shivajinagar', label: 'Shivajinagar', location: { lat: 12.9868, lng: 77.6072 } },
  { id: 'whitefield', label: 'Whitefield', location: { lat: 12.9698, lng: 77.7499 } },
  { id: 'electronic-city', label: 'Electronic City', location: { lat: 12.8456, lng: 77.6603 } },
  { id: 'outer-ring-road', label: 'Outer Ring Road', location: { lat: 12.9264, lng: 77.6762 } },
]
