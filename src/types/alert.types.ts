import type { IncidentSeverity } from './incident.types'
export interface SystemAlert { id: string; severity: IncidentSeverity; message: string; source: string; createdAt: string; acknowledged: boolean; relatedIncidentId: string | null }
