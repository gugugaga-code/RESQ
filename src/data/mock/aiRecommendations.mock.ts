import type { AIRecommendation } from '../../types/ai.types'
export const recommendations: AIRecommendation[] = [
  { id: 'ai-1', relatedIncidentId: 'inc-001', summary: 'Pre-position a shelter unit south of the flood zone.', reasoning: 'Rainfall rate and affected radius indicate a likely evacuation need within 45 minutes.', confidence: 89, suggestedActions: ['Stage SHELTER-2 at Madiwala', 'Close underpass approaches'], priority: 1, createdAt: '2026-08-14T09:07:00+05:30' },
  { id: 'ai-2', relatedIncidentId: 'inc-002', summary: 'Establish an alternate approach for FIRE-07.', reasoning: 'Traffic congestion on 100 Feet Road may affect suppression response time.', confidence: 84, suggestedActions: ['Route via CMH Road', 'Request traffic clearance'], priority: 2, createdAt: '2026-08-14T09:05:00+05:30' },
  { id: 'ai-3', relatedIncidentId: 'inc-003', summary: 'Distribute patients across two trauma centers.', reasoning: 'Current availability supports faster triage than a single-destination transfer.', confidence: 76, suggestedActions: ['Notify St. Martha’s', 'Hold Manipal for priority cases'], priority: 3, createdAt: '2026-08-14T09:04:00+05:30' }
]
