import { useEffect, useState } from 'react'
import { Ambulance, Bot, Flame, HeartPulse, Shield, UsersRound } from 'lucide-react'
import { useCrisisStore } from '../../store/useCrisisStore'
import type { ResourceAllocationRecommendation } from '../../services/resourceAllocationService'
import type { HospitalRecommendation } from '../../types/hospitalRouting.types'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { SeverityTag } from '../ui/SeverityTag'
import { StatusDot } from '../ui/StatusDot'

const icons = { ambulance: Ambulance, fire_truck: Flame, police_unit: Shield, rescue_team: UsersRound, medical_team: HeartPulse, drone: Bot, shelter_unit: UsersRound }
const resourceTypeLabel = (type: string) => type.replace('_', ' ')

export function SidebarRight() {
  const [dispatchCandidate, setDispatchCandidate] = useState<ResourceAllocationRecommendation | null>(null)
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null)
  const [hospitalCandidate, setHospitalCandidate] = useState<HospitalRecommendation | null>(null)
  const resources = useCrisisStore((state) => state.resources)
  const recommendations = useCrisisStore((state) => state.recommendations)
  const hospitals = useCrisisStore((state) => state.hospitals)
  const incidents = useCrisisStore((state) => state.incidents)
  const selectedId = useCrisisStore((state) => state.selectedIncidentId)
  const allocationIncidentId = useCrisisStore((state) => state.allocationIncidentId)
  const allocationRecommendations = useCrisisStore((state) => state.allocationRecommendations)
  const routes = useCrisisStore((state) => state.routes)
  const hospitalRecommendations = useCrisisStore((state) => state.hospitalRecommendations)
  const hospitalIncidentId = useCrisisStore((state) => state.hospitalIncidentId)
  const destinations = useCrisisStore((state) => state.medicalDestinations)
  const connectivity = useCrisisStore((state) => state.system.connectivity)
  const calculateAllocation = useCrisisStore((state) => state.calculateAllocationForSelectedIncident)
  const calculateHospitals = useCrisisStore((state) => state.calculateHospitalRecommendationsForSelectedIncident)
  const confirmHospitalDestination = useCrisisStore((state) => state.confirmHospitalDestination)
  const dispatchResource = useCrisisStore((state) => state.dispatchResource)
  const selected = incidents.find((incident) => incident.id === selectedId)
  const allocationReady = selected?.id === allocationIncidentId
  const hasSuitableDeployment = allocationRecommendations.some((item) => item.recommended)
  const medicalResource = resources.find((resource) => resource.assignedIncidentId === selectedId && resource.status === 'dispatched' && (resource.type === 'ambulance' || resource.type === 'medical_team'))
  const dispatchedForSelectedIncident = resources.filter((resource) => resource.assignedIncidentId === selectedId && resource.status === 'dispatched')
  const selectedDispatchResourceId = dispatchedForSelectedIncident[0]?.id ?? null
  const responseRoute = selectedDispatchResourceId ? routes.find((route) => route.stage === 'incident' && route.incidentId === selectedId && route.resourceId === selectedDispatchResourceId) ?? routes.find((route) => route.stage === 'incident' && route.incidentId === selectedId) ?? null : routes.find((route) => route.stage === 'incident' && route.incidentId === selectedId) ?? null
  const routeResource = responseRoute ? resources.find((resource) => resource.id === responseRoute.resourceId) ?? null : null
  const destination = medicalResource ? destinations.find((item) => item.incidentId === selectedId && item.resourceId === medicalResource.id) ?? destinations.find((item) => item.incidentId === selectedId) ?? null : null
  const selectedHospitalResourceId = medicalResource?.id ?? null
  const hospitalRoute = selectedHospitalResourceId ? routes.find((route) => route.stage === 'hospital' && route.incidentId === selectedId && route.resourceId === selectedHospitalResourceId) ?? routes.find((route) => route.stage === 'hospital' && route.incidentId === selectedId) ?? null : routes.find((route) => route.stage === 'hospital' && route.incidentId === selectedId) ?? null

  useEffect(() => { if (selected && !allocationReady) calculateAllocation() }, [allocationReady, calculateAllocation, selected])
  useEffect(() => { if (selected && hospitalIncidentId !== selected.id) calculateHospitals() }, [calculateHospitals, hospitalIncidentId, selected])
  useEffect(() => { setDispatchCandidate(null); setDispatchNotice(null) }, [selectedId])

  const confirmDispatch = () => { if (!dispatchCandidate || !selected) return; const result = dispatchResource(dispatchCandidate.resource.id, selected.id); setDispatchCandidate(null); setDispatchNotice(result.success ? connectivity === 'online' ? `${dispatchCandidate.resource.callSign} dispatched. Calculating road route…` : `${dispatchCandidate.resource.callSign} dispatched locally. Synchronization pending.` : result.error) }
  const confirmDestination = () => { if (!hospitalCandidate || !medicalResource) return; const confirmed = confirmHospitalDestination(hospitalCandidate.hospital.id, medicalResource.id); if (confirmed) setHospitalCandidate(null) }

  return <aside className="sidebar right-sidebar">
    {selected ? <Card className="incident-detail-panel">
      <div className="panel-heading"><div><p>INCIDENT DETAILS</p><h2>Automated triage</h2></div><SeverityTag severity={selected.severity} /></div>
      <Divider />
      <strong className="detail-title">{selected.title}</strong>
      <div className="detail-grid"><div><span>Type</span><b>{resourceTypeLabel(selected.type)}</b></div><div><span>People affected</span><b>{selected.casualtiesEstimate}</b></div><div><span>Score</span><b>{selected.triageScore} / 100</b></div><div><span>Confidence</span><b>{selected.triageConfidence}%</b></div><div><span>Status</span><b>{selected.status}</b></div><div><span>Reported</span><b>{new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(selected.reportedAt))} IST</b></div></div>
      <p className="detail-description">{selected.description}</p>
      <div className="detail-location"><span>Location</span><b>{selected.location.lat.toFixed(4)}, {selected.location.lng.toFixed(4)}</b></div>
      <div className="triage-reasons"><span>Why this severity</span><ul>{selected.triageReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
      <div className="assigned-resources"><span>Assigned resources</span><b>{selected.assignedResourceIds.length ? resources.filter((resource) => selected.assignedResourceIds.includes(resource.id)).map((resource) => resource.callSign).join(', ') : 'None assigned'}</b></div>
      {responseRoute && routeResource && <section className="response-route"><span>RESPONSE ROUTE</span><strong>{routeResource.callSign} → {selected.title}</strong>{responseRoute.status === 'active' && <><div><b>DISTANCE</b><em>{(responseRoute.distanceMeters! / 1000).toFixed(1)} km</em></div><div><b>ETA</b><em>{Math.max(1, Math.ceil(responseRoute.durationSeconds! / 60))} min</em></div></>}<div><b>ROUTE</b><em>{responseRoute.status === 'planned' ? 'Calculating…' : responseRoute.status === 'pending' ? 'Pending connectivity' : responseRoute.status === 'blocked' ? 'Unavailable' : responseRoute.status}</em></div>{(responseRoute.status === 'blocked' || responseRoute.status === 'pending') && <small>{responseRoute.error ?? 'Unable to calculate route.'}</small>}</section>}
      {selected.type === 'medical' && <section className="hospital-destination"><span>HOSPITAL DESTINATION</span>{destination ? <><strong>DESTINATION CONFIRMED</strong><b>{hospitals.find((hospital) => hospital.id === destination.hospitalId)?.name}</b><small>Handoff: {destination.status.replace('_', ' ')}</small><small>Route: {hospitalRoute?.status === 'active' ? `${(hospitalRoute.distanceMeters! / 1000).toFixed(1)} km / ${Math.ceil(hospitalRoute.durationSeconds! / 60)} min` : hospitalRoute?.status === 'pending' ? 'Pending connectivity' : hospitalRoute?.status ?? 'Calculating…'}</small></> : <>{!medicalResource && <small>Dispatch an ambulance or medical team before confirming a destination.</small>}{hospitalRecommendations.map((item) => <article key={item.hospital.id}><div><strong>{item.hospital.name}</strong><em>#{hospitalRecommendations.indexOf(item) + 1} · Score {item.score}</em></div><small>{item.distanceKm.toFixed(1)} km · {item.hospital.bedsAvailable} beds · Trauma level {item.hospital.traumaLevel}</small><ul>{item.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul><button type="button" disabled={!medicalResource || !item.deployable} onClick={() => setHospitalCandidate(item)}>Select</button></article>)}</>}</section>}
      <Divider />
      <section className="allocation-panel" aria-label="Resource recommendations"><div className="panel-heading"><div><p>RESOURCE RECOMMENDATIONS</p><h2>Operator decision support</h2></div><span className="allocation-count">{allocationReady ? allocationRecommendations.length : '…'}</span></div>{dispatchNotice && <p className="dispatch-notice" role="status">{dispatchNotice}</p>}{!allocationReady ? <p className="allocation-empty">Calculating resource recommendations…</p> : <>{!hasSuitableDeployment && <p className="allocation-empty">No suitable deployable resources available</p>}<div className="allocation-list">{allocationRecommendations.map((item) => <article className={`allocation-row ${item.recommendationLevel}`} key={item.resource.id}><div className="allocation-rank">#{item.rank}</div><div className="allocation-main"><div className="allocation-name"><strong>{item.resource.callSign}</strong>{item.recommendationLevel === 'primary' && <span className="allocation-primary">Recommended</span>}{item.recommendationLevel === 'secondary' && <span className="allocation-secondary">Secondary</span>}</div><span>{resourceTypeLabel(item.resource.type)}</span><div className="allocation-metrics"><b>Score {item.score}</b><span>{item.distanceKm.toFixed(1)} km</span></div><ul>{item.reasons.slice(0, 4).map((reason) => <li key={reason}>{reason}</li>)}</ul></div><div className="allocation-status"><StatusDot tone={item.resource.status} /><span>{item.resource.status === 'offline' ? 'Offline' : item.deployable ? 'Available' : 'Not deployable'}</span>{item.deployable && <button type="button" className="dispatch-button" onClick={() => setDispatchCandidate(item)}>Dispatch</button>}</div></article>)}</div></>}</section>
    </Card> : <Card className="incident-detail-panel allocation-empty-state"><p>RESOURCE RECOMMENDATIONS</p><h2>Select an incident to view resource recommendations.</h2></Card>}
    <Card><div className="panel-heading"><div><p>FIELD OPS</p><h2>Emergency resources</h2></div><span className="count">{resources.length}</span></div><div className="resource-list">{resources.map((resource) => { const Icon = icons[resource.type]; const assignedIncident = incidents.find((incident) => incident.id === resource.assignedIncidentId); return <div className="resource-row" key={resource.id}><div className="resource-icon"><Icon size={16} /></div><div><strong>{resource.callSign}</strong><span>{resourceTypeLabel(resource.type)}</span>{assignedIncident && <small className="resource-assignment">Assigned to: {assignedIncident.title}</small>}</div><div className="resource-state"><StatusDot tone={resource.status} /><small>{resource.status === 'dispatched' ? `Dispatched · ${resource.etaMinutes ?? '—'} min` : resource.etaMinutes === null ? 'Standby' : `${resource.etaMinutes} min`}</small></div></div> })}</div></Card>
    <Card><div className="panel-heading"><div><p>DECISION SUPPORT</p><h2>AI recommendations</h2></div><Bot size={17} /></div><Divider /><div className="recommendation-list">{recommendations.map((item) => <article className="recommendation" key={item.id}><div><span className="priority">P{item.priority}</span><span className="confidence">{item.confidence}% confidence</span></div><strong>{item.summary}</strong><p>{item.reasoning}</p></article>)}</div></Card>
    <Card className="stats-card"><p>NETWORK CAPACITY</p><div className="stats"><div><strong>{hospitals.reduce((sum, hospital) => sum + hospital.bedsAvailable, 0)}</strong><span>beds available</span></div><div><strong>{hospitals.length}</strong><span>hospitals online</span></div></div></Card>
    {dispatchCandidate && selected && <div className="dispatch-backdrop" role="presentation"><section className="dispatch-dialog" role="dialog" aria-modal="true" aria-labelledby="dispatch-title"><p>CONFIRM DISPATCH</p><h2 id="dispatch-title">{dispatchCandidate.resource.callSign}</h2><span>{resourceTypeLabel(dispatchCandidate.resource.type)}</span><dl><div><dt>Incident</dt><dd>{selected.title}</dd></div><div><dt>Estimated ETA</dt><dd>{Math.max(2, Math.ceil(dispatchCandidate.distanceKm * 3 + 2))} min (mock)</dd></div></dl><p>This will assign the resource to the selected incident.</p><div><button type="button" className="sos-cancel" onClick={() => setDispatchCandidate(null)}>Cancel</button><button type="button" className="dispatch-confirm" onClick={confirmDispatch}>Confirm dispatch</button></div></section></div>}
    {hospitalCandidate && medicalResource && <div className="dispatch-backdrop" role="presentation"><section className="dispatch-dialog" role="dialog" aria-modal="true" aria-labelledby="destination-title"><p>CONFIRM DESTINATION</p><h2 id="destination-title">{hospitalCandidate.hospital.name}</h2><dl><div><dt>Available beds</dt><dd>{hospitalCandidate.hospital.bedsAvailable}</dd></div><div><dt>Trauma level</dt><dd>{hospitalCandidate.hospital.traumaLevel}</dd></div><div><dt>Resource</dt><dd>{medicalResource.callSign}</dd></div></dl><p>This establishes a planned destination; it does not perform a patient handoff.</p><div><button type="button" className="sos-cancel" onClick={() => setHospitalCandidate(null)}>Cancel</button><button type="button" className="dispatch-confirm" onClick={confirmDestination}>Confirm destination</button></div></section></div>}
  </aside>
}
