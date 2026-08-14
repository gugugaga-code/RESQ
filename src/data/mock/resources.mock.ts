import type { Resource } from '../../types/resource.types'
export const resources: Resource[] = [
  { id: 'res-001', type: 'rescue_team', callSign: 'RESCUE-12', status: 'busy', location: { lat: 12.932, lng: 77.62 }, capacity: 12, assignedIncidentId: 'inc-001', etaMinutes: 4, lastUpdated: '2026-08-14T09:07:00+05:30' },
  { id: 'res-002', type: 'fire_truck', callSign: 'FIRE-07', status: 'dispatched', location: { lat: 12.972, lng: 77.631 }, capacity: 6, assignedIncidentId: 'inc-002', etaMinutes: 5, lastUpdated: '2026-08-14T09:06:00+05:30' },
  { id: 'res-003', type: 'drone', callSign: 'EYE-03', status: 'busy', location: { lat: 12.979, lng: 77.642 }, capacity: 0, assignedIncidentId: 'inc-002', etaMinutes: 0, lastUpdated: '2026-08-14T09:08:00+05:30' },
  { id: 'res-004', type: 'ambulance', callSign: 'MED-22', status: 'dispatched', location: { lat: 12.93, lng: 77.615 }, capacity: 4, assignedIncidentId: 'inc-001', etaMinutes: 7, lastUpdated: '2026-08-14T09:07:00+05:30' },
  { id: 'res-005', type: 'medical_team', callSign: 'TRIAGE-5', status: 'busy', location: { lat: 12.973, lng: 77.59 }, capacity: 8, assignedIncidentId: 'inc-003', etaMinutes: 3, lastUpdated: '2026-08-14T09:07:00+05:30' },
  { id: 'res-006', type: 'police_unit', callSign: 'POLICE-31', status: 'available', location: { lat: 12.989, lng: 77.604 }, capacity: 4, assignedIncidentId: null, etaMinutes: null, lastUpdated: '2026-08-14T09:05:00+05:30' }
]
