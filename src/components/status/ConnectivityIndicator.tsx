import { Wifi } from 'lucide-react'
import { useCrisisStore } from '../../store/useCrisisStore'
import { StatusDot } from '../ui/StatusDot'
export function ConnectivityIndicator() { const connectivity = useCrisisStore((state) => state.system.connectivity); return <div className="connectivity"><StatusDot tone={connectivity === 'online' ? 'online' : 'offline'} /><Wifi size={14} /><span>{connectivity}</span></div> }
