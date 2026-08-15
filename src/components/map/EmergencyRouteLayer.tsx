import { Polyline } from 'react-leaflet'
import { useCrisisStore } from '../../store/useCrisisStore'

export function EmergencyRouteLayer() {
  const selectedIncidentId = useCrisisStore((state) => state.selectedIncidentId)
  const route = useCrisisStore((state) => state.routes.find((item) => item.destinationId === selectedIncidentId && item.status === 'active'))

  if (!route) return null

  return <Polyline positions={route.path.map((point) => [point.lat, point.lng] as [number, number])} pathOptions={{ color: '#38bdf8', weight: 5, opacity: 0.9, dashArray: '10 7', lineCap: 'round', lineJoin: 'round' }} />
}
