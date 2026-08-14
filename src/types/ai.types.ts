export interface AIRecommendation { id: string; relatedIncidentId: string; summary: string; reasoning: string; confidence: number; suggestedActions: string[]; priority: number; createdAt: string }
