import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useCrisisStore } from '../../store/useCrisisStore'
const icon = divIcon({ className: 'resq-marker-wrap', html: '<span class="resq-marker hospital-marker">✚</span>', iconSize: [28, 28], iconAnchor: [14, 14] })
export function HospitalMarkers() { const hospitals = useCrisisStore((state) => state.hospitals); return <>{hospitals.map((hospital) => <Marker key={hospital.id} position={[hospital.location.lat, hospital.location.lng]} icon={icon}><Popup className="resq-popup"><div className="popup-content"><span className="popup-kicker hospital-kicker">Hospital</span><h3>{hospital.name}</h3><dl><div><dt>Trauma level</dt><dd>Level {hospital.traumaLevel}</dd></div><div><dt>Beds</dt><dd>{hospital.bedsAvailable} / {hospital.bedCapacity} available</dd></div><div><dt>Status</dt><dd>{hospital.status}</dd></div></dl></div></Popup></Marker>)}</> }
