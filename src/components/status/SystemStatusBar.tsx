import { Radio, Server, Users } from 'lucide-react'
import { useCrisisStore } from '../../store/useCrisisStore'
export function SystemStatusBar() { const system = useCrisisStore((state) => state.system); return <div className="system-status"><span><Radio size={14} /> {system.activeIncidentCount} active incidents</span><span><Users size={14} /> {system.activeResourceCount} units engaged</span><span><Server size={14} /> Synced 09:08 IST</span></div> }
