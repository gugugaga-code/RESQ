import type { PropsWithChildren } from 'react'
export function Badge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'info' | 'success' }>) { return <span className={`badge badge-${tone}`}>{children}</span> }
