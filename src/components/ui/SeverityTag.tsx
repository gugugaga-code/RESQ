import type { IncidentSeverity } from '../../types/incident.types'
export function SeverityTag({ severity }: { severity: IncidentSeverity }) { return <span className={`severity severity-${severity}`}>{severity}</span> }
