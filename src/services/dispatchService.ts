import type { Incident } from '../types/incident.types'
import type { Resource } from '../types/resource.types'

export type DispatchResult = { success: true; etaMinutes: number } | { success: false; error: string }

export function estimateMockEtaMinutes(distanceKm: number): number { return Math.max(2, Math.ceil(distanceKm * 3 + 2)) }

export function validateDispatch(resource: Resource | undefined, incident: Incident | undefined, distanceKm: number | undefined): DispatchResult {
  if (!incident) return { success: false, error: 'Incident is no longer available.' }
  if (!resource) return { success: false, error: 'Resource is no longer available.' }
  if (resource.status === 'offline') return { success: false, error: 'Offline resources cannot be dispatched.' }
  if (resource.status !== 'available') return { success: false, error: `Resource is currently ${resource.status}.` }
  if (resource.assignedIncidentId !== null) return { success: false, error: 'Resource is already assigned to another incident.' }
  if (distanceKm === undefined) return { success: false, error: 'Resource recommendation is unavailable for this incident.' }
  return { success: true, etaMinutes: estimateMockEtaMinutes(distanceKm) }
}
