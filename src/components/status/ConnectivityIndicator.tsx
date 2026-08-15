import { Wifi, WifiOff } from 'lucide-react'
import { useCrisisStore } from '../../store/useCrisisStore'
import { StatusDot } from '../ui/StatusDot'
export function ConnectivityIndicator() { const system = useCrisisStore((state) => state.system); const label = system.syncStatus === 'syncing' ? 'syncing' : system.connectivity; const tone = system.connectivity === 'online' ? 'online' : system.connectivity === 'degraded' ? 'busy' : 'offline'; return <div className="connectivity"><StatusDot tone={tone} />{system.connectivity === 'offline' ? <WifiOff size={14} /> : <Wifi size={14} />}<span>{label}</span></div> }
