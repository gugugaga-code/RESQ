export type Connectivity = 'online' | 'degraded' | 'offline'
export interface SystemStatus { connectivity: Connectivity; lastSyncedAt: string; activeIncidentCount: number; activeResourceCount: number; pendingSyncActions: number }
