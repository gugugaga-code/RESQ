export function StatusDot({ tone }: { tone: 'online' | 'available' | 'dispatched' | 'busy' | 'offline' }) { return <span className={`status-dot ${tone}`} aria-label={tone} /> }
