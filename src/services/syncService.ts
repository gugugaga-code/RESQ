import { pendingOfflineActions } from './offlineQueueService'
import type { OfflineAction } from '../types/offline.types'

/** Simulates a successful local handoff; no server or external synchronization is involved. */
export async function synchronizeLocalActions(actions: OfflineAction[], onSynchronized: (action: OfflineAction) => void) {
  for (const action of pendingOfflineActions(actions)) {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 250))
    onSynchronized(action)
  }
}
