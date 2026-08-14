import type { GeoPoint } from './incident.types'
export type RiskLevel = 'severe' | 'high' | 'moderate' | 'low'
export interface RiskZone { id: string; label: string; riskLevel: RiskLevel; polygon: GeoPoint[]; reason: string; confidence: number; generatedAt: string; expiresAt: string }
