import type { EmergencyLocation } from '../data/mock/locations.mock'
import { triageIncident } from './triageService'
import type { Incident, IncidentType } from '../types/incident.types'
export interface CreateIncidentInput { type: IncidentType; description: string; peopleAffected: number; emergencyLocation: EmergencyLocation; existingIds: string[]; reportedBy?: string }
const typeLabels: Record<IncidentType, string> = { medical: 'Medical emergency', fire: 'Fire emergency', flood: 'Flood emergency', accident: 'Road accident', structural_collapse: 'Structural collapse', earthquake: 'Earthquake incident', hazmat: 'Hazmat incident', other: 'Emergency report' }
const radiusBySeverity = { critical: 700, high: 450, medium: 250, low: 120 }
const nextId = (ids: string[]) => { const max = ids.reduce((current, id) => Math.max(current, Number(id.replace(/\D/g, '')) || 0), 0); return `inc-${String(max + 1).padStart(3, '0')}` }
export const incidentDisplayId = (id: string) => id.replace('inc-', 'INC-').toUpperCase()
export function createCitizenIncident(input: CreateIncidentInput): Incident { const now = new Date().toISOString(); const triage = triageIncident(input); return { id: nextId(input.existingIds), type: input.type, severity: triage.severity, status: 'active', title: `${typeLabels[input.type]} — ${input.emergencyLocation.label}`, description: input.description.trim() || 'Citizen emergency report received.', location: input.emergencyLocation.location, reportedAt: now, updatedAt: now, reportedBy: input.reportedBy ?? 'Citizen SOS', affectedRadiusMeters: radiusBySeverity[triage.severity], casualtiesEstimate: input.peopleAffected, assignedResourceIds: [], triageScore: triage.score, triageConfidence: triage.confidence, triageReasons: triage.reasons } }
