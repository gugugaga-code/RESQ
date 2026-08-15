import type { OfflineAction, OfflineActionType } from '../types/offline.types'

export interface QueueActionInput {
  type: OfflineActionType
  payload: Record<string, string>
}

const actionKey = (action: Pick<OfflineAction, 'type' | 'payload'>) => `${action.type}:${Object.entries(action.payload).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}=${value}`).join('&')}`

export const createOfflineAction = ({ type, payload }: QueueActionInput): OfflineAction => ({
  id: `sync-${type}-${Object.values(payload).join('-')}`,
  type,
  payload,
  createdAt: new Date().toISOString(),
  status: 'pending',
})

export const enqueueOfflineAction = (queue: OfflineAction[], input: QueueActionInput) => {
  const action = createOfflineAction(input)
  return queue.some((item) => actionKey(item) === actionKey(action) && item.status === 'pending') ? queue : [...queue, action]
}

export const pendingOfflineActions = (queue: OfflineAction[]) => queue.filter((action) => action.status === 'pending')
export const pendingOfflineActionCount = (queue: OfflineAction[]) => pendingOfflineActions(queue).length
export const acknowledgeOfflineAction = (queue: OfflineAction[], id: string) => queue.filter((action) => action.id !== id)
export const clearOfflineActions = () => [] as OfflineAction[]
