export interface GeoPoint { lat: number; lng: number }
export type IncidentType = 'fire' | 'flood' | 'earthquake' | 'medical' | 'structural_collapse' | 'hazmat' | 'accident' | 'other'
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'active' | 'contained' | 'resolved' | 'monitoring'
export interface Incident { id: string; type: IncidentType; severity: IncidentSeverity; status: IncidentStatus; title: string; description: string; location: GeoPoint; reportedAt: string; updatedAt: string; reportedBy: string; affectedRadiusMeters: number; casualtiesEstimate: number; assignedResourceIds: string[]; triageScore: number; triageConfidence: number; triageReasons: string[] }
