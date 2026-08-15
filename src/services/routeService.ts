import type { GeoPoint } from '../types/incident.types'
import type { EmergencyRoute } from '../types/route.types'

interface OsrmRouteResponse { code?: string; routes?: Array<{ distance?: number; duration?: number; geometry?: { type?: string; coordinates?: unknown } }> }

const routeId = (resourceId: string, destinationId: string) => `route-${resourceId}-${destinationId}`

export const createPlannedRoute = (resourceId: string, destinationId: string): EmergencyRoute => ({ id: routeId(resourceId, destinationId), resourceId, destinationId, path: [], distanceMeters: null, durationSeconds: null, status: 'planned' })

export async function fetchEmergencyRoute(resourceId: string, resourceLocation: GeoPoint, destinationId: string, destinationLocation: GeoPoint): Promise<EmergencyRoute> {
  const coordinates = `${resourceLocation.lng},${resourceLocation.lat};${destinationLocation.lng},${destinationLocation.lat}`
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`)
  if (!response.ok) throw new Error('Route service is unavailable.')

  const data = await response.json() as OsrmRouteResponse
  const route = data.routes?.[0]
  const coordinatesList = route?.geometry?.type === 'LineString' && Array.isArray(route.geometry.coordinates) ? route.geometry.coordinates : undefined
  if (data.code !== 'Ok' || !route || !coordinatesList || typeof route.distance !== 'number' || typeof route.duration !== 'number') throw new Error('Unable to calculate a road route.')

  const path = coordinatesList.map((coordinate) => {
    if (!Array.isArray(coordinate) || typeof coordinate[0] !== 'number' || typeof coordinate[1] !== 'number') throw new Error('Route geometry is invalid.')
    return { lng: coordinate[0], lat: coordinate[1] }
  })
  if (path.length < 2) throw new Error('Route geometry is unavailable.')

  return { id: routeId(resourceId, destinationId), resourceId, destinationId, path, distanceMeters: Math.round(route.distance), durationSeconds: Math.round(route.duration), status: 'active' }
}
