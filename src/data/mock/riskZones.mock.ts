import type { RiskZone } from '../../types/riskZone.types'
export const riskZones: RiskZone[] = [
  { id: 'zone-1', label: 'Koramangala flood basin', riskLevel: 'severe', polygon: [{ lat: 12.93, lng: 77.615 }, { lat: 12.94, lng: 77.615 }, { lat: 12.94, lng: 77.63 }], reason: 'Rapid water-level rise from intense rainfall.', confidence: 91, generatedAt: '2026-08-14T09:00:00+05:30', expiresAt: '2026-08-14T12:00:00+05:30' },
  { id: 'zone-2', label: 'Indiranagar commercial district', riskLevel: 'high', polygon: [{ lat: 12.974, lng: 77.635 }, { lat: 12.984, lng: 77.635 }, { lat: 12.984, lng: 77.646 }], reason: 'Smoke plume and emergency vehicle access.', confidence: 86, generatedAt: '2026-08-14T09:00:00+05:30', expiresAt: '2026-08-14T11:00:00+05:30' },
  { id: 'zone-3', label: 'Shivajinagar perimeter', riskLevel: 'moderate', polygon: [{ lat: 12.982, lng: 77.602 }, { lat: 12.99, lng: 77.602 }, { lat: 12.99, lng: 77.612 }], reason: 'Structural assessment in progress.', confidence: 79, generatedAt: '2026-08-14T08:40:00+05:30', expiresAt: '2026-08-14T10:30:00+05:30' }
]
