import { useState } from 'react'
import { CitizenSosModal } from '../components/sos/CitizenSosModal'
import { BottomStrip } from '../components/layout/BottomStrip'
import { SidebarLeft } from '../components/layout/SidebarLeft'
import { SidebarRight } from '../components/layout/SidebarRight'
import { TopBar } from '../components/layout/TopBar'
import { CrisisMap } from '../components/map/CrisisMap'
import { emergencyLocations } from '../data/mock/locations.mock'
import { createCitizenIncident, incidentDisplayId } from '../services/incidentService'
import { useCrisisStore } from '../store/useCrisisStore'
import type { Incident } from '../types/incident.types'
import { AppProviders } from './providers'

export function App() { const [sosOpen, setSosOpen] = useState(false); const [toast, setToast] = useState<Incident | null>(null); const incidents = useCrisisStore((state) => state.incidents); const upsert = useCrisisStore((state) => state.upsertIncident); const addAlert = useCrisisStore((state) => state.addAlert); const select = useCrisisStore((state) => state.selectIncident); const notify = (incident: Incident) => { setToast(incident); window.setTimeout(() => setToast(null), 5000) }; const simulate = () => { const incident = createCitizenIncident({ type: 'structural_collapse', description: 'Partial building collapse reported. Several people may be trapped inside.', peopleAffected: 12, emergencyLocation: emergencyLocations[2], existingIds: incidents.map((item) => item.id), reportedBy: 'Demo simulation' }); upsert(incident); addAlert({ id: `alert-${incident.id}`, severity: incident.severity, message: `New citizen SOS received: ${incident.title}`, source: 'Demo simulation', createdAt: incident.reportedAt, acknowledged: false, relatedIncidentId: incident.id }); select(incident.id); notify(incident) }; return <AppProviders><main className="app-shell"><TopBar onSendSos={() => setSosOpen(true)} onSimulateSos={simulate} /><div className="command-grid"><SidebarLeft /><section className="map-panel"><CrisisMap /></section><SidebarRight /></div><BottomStrip />{sosOpen && <CitizenSosModal onClose={() => setSosOpen(false)} onSubmitted={notify} />}{toast && <div className="sos-toast" role="status"><strong>SOS received</strong><span>Incident: {incidentDisplayId(toast.id)}</span><span>Automated triage: {toast.severity} · {toast.triageConfidence}% confidence</span><small>The incident has been added to the command center.</small></div>}</main></AppProviders> }
