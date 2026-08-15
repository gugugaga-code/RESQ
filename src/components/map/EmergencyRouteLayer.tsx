import { Polyline } from 'react-leaflet'
import { useCrisisStore } from '../../store/useCrisisStore'

export function EmergencyRouteLayer() {
  const selectedIncidentId = useCrisisStore((state) => state.selectedIncidentId)
  const route = useCrisisStore((state) => {
    const activeRoutes = state.routes.filter((item) => item.incidentId === selectedIncidentId && item.status === 'active')
    const selectedResourceId = state.resources.find((resource) => resource.assignedIncidentId === selectedIncidentId && resource.status === 'dispatched')?.id
    return selectedResourceId ? activeRoutes.find((item) => item.resourceId === selectedResourceId) ?? activeRoutes[0] ?? null : activeRoutes[0] ?? null
  })

  if (!route) return null

  return <Polyline positions={route.path.map((point) => [point.lat, point.lng] as [number, number])} pathOptions={{ color: '#38bdf8', weight: 5, opacity: 0.9, dashArray: '10 7', lineCap: 'round', lineJoin: 'round' }} />
}
