import { Clock3, Play, ShieldAlert, Siren } from 'lucide-react'
import { ConnectivityIndicator } from '../status/ConnectivityIndicator'
import { Badge } from '../ui/Badge'
interface TopBarProps { onSendSos: () => void; onSimulateSos: () => void }
export function TopBar({ onSendSos, onSimulateSos }: TopBarProps) { return <header className="topbar"><div className="brand"><div className="brand-mark"><ShieldAlert size={20} /></div><div><strong>RESQ</strong><span>Autonomous Crisis Response</span></div></div><div className="topbar-meta"><button type="button" className="simulation-button" onClick={onSimulateSos}><Play size={12} /> Simulate SOS</button><button type="button" className="sos-trigger" onClick={onSendSos}><Siren size={14} /> Send SOS</button><Badge tone="info">BENGALURU COMMAND</Badge><ConnectivityIndicator /><span className="clock"><Clock3 size={14} /> 09:08 IST</span></div></header> }
