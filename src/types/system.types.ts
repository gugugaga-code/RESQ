export type Connectivity = 'online' | 'degraded' | 'offline'
export type SyncStatus = 'idle' | 'syncing'
export interface SystemStatus { connectivity: Connectivity; syncStatus: SyncStatus; lastSyncedAt: string; activeIncidentCount: number; activeResourceCount: number; pendingSyncActions: number }
