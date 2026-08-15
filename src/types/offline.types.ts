export type OfflineActionType = 'incident_created' | 'resource_dispatched'
export type OfflineActionStatus = 'pending' | 'synchronized'

export interface OfflineAction {
  id: string
  type: OfflineActionType
  createdAt: string
  payload: Record<string, string>
  status: OfflineActionStatus
}
