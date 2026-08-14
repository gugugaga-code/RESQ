import type { SystemAlert } from '../../types/alert.types'
export const alerts: SystemAlert[] = [
  { id: 'alert-1', severity: 'critical', message: 'Water level at Koramangala underpass is rising rapidly.', source: 'Flood sensor network', createdAt: '2026-08-14T09:06:00+05:30', acknowledged: false, relatedIncidentId: 'inc-001' },
  { id: 'alert-2', severity: 'high', message: 'Traffic congestion may delay FIRE-07 by 3 minutes.', source: 'Traffic control', createdAt: '2026-08-14T09:03:00+05:30', acknowledged: false, relatedIncidentId: 'inc-002' },
  { id: 'alert-3', severity: 'high', message: 'Manipal Hospital has limited trauma bed availability.', source: 'Hospital network', createdAt: '2026-08-14T09:01:00+05:30', acknowledged: false, relatedIncidentId: 'inc-003' },
  { id: 'alert-4', severity: 'medium', message: 'Additional rain cell forecast over southeast Bengaluru.', source: 'IMD weather feed', createdAt: '2026-08-14T08:54:00+05:30', acknowledged: true, relatedIncidentId: null },
  { id: 'alert-5', severity: 'medium', message: 'Structural engineer requested at Shivajinagar perimeter.', source: 'Field command', createdAt: '2026-08-14T08:50:00+05:30', acknowledged: false, relatedIncidentId: 'inc-004' }
]
