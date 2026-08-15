import { env } from '../config/env'
import type { GeoPoint } from '../types/incident.types'
import type { EmergencyRoute } from '../types/route.types'

interface OsrmRouteResponse { code?: string; routes?: Array<{ distance?: number; duration?: number; geometry?: { type?: string; coordinates?: unknown } }> }

const routeId = (resourceId: string, destinationId: string) => `route-${resourceId}-${destinationId}`

const buildRouteRequestUrl = (resourceLocation: GeoPoint, destinationLocation: GeoPoint): string => {
  const coordinates = `${resourceLocation.lng},${resourceLocation.lat};${destinationLocation.lng},${destinationLocation.lat}`
  return `${env.routing.osrmBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
}

export const createPlannedRoute = (resourceId: string, destinationId: string): EmergencyRoute => ({ id: routeId(resourceId, destinationId), resourceId, destinationId, path: [], distanceMeters: null, durationSeconds: null, status: 'planned' })
export const createPendingRoute = (resourceId: string, destinationId: string, error: string): EmergencyRoute => ({ id: routeId(resourceId, destinationId), resourceId, destinationId, path: [], distanceMeters: null, durationSeconds: null, status: 'pending', error })

export async function fetchEmergencyRoute(resourceId: string, resourceLocation: GeoPoint, destinationId: string, destinationLocation: GeoPoint): Promise<EmergencyRoute> {
  const requestUrl = buildRouteRequestUrl(resourceLocation, destinationLocation)

  let response: Response
  try {
    response = await fetch(requestUrl)
  } catch {
    throw new Error('Route service is currently unavailable. Please retry when connectivity is restored.')
  }

  if (!response.ok) throw new Error('Route service is unavailable.')

  let data: OsrmRouteResponse
  try {
    data = await response.json() as OsrmRouteResponse
  } catch {
    throw new Error('Unable to read the route response.')
  }

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
