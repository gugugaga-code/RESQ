import type { Hospital } from '../types/hospital.types'
import type { Incident } from '../types/incident.types'
import type { Resource } from '../types/resource.types'
import type { HospitalRecommendation, HospitalSuitability } from '../types/hospitalRouting.types'

const distanceKm = (incident: Incident, hospital: Hospital) => {
  const lat = (hospital.location.lat - incident.location.lat) * 111
  const lng = (hospital.location.lng - incident.location.lng) * 111 * Math.cos(incident.location.lat * Math.PI / 180)
  return Math.sqrt(lat * lat + lng * lng)
}
const traumaNeed = (incident: Incident) => incident.type === 'structural_collapse' || incident.type === 'accident' || incident.severity === 'critical' ? 1 : incident.severity === 'high' ? 2 : 3

export const isHospitalDestinationEligible = (hospital: Hospital): boolean => hospital.status === 'operational' && hospital.bedsAvailable > 0

export function rankHospitalsForIncident(incident: Incident, hospitals: Hospital[], resource?: Resource): HospitalRecommendation[] {
  const requiredTrauma = traumaNeed(incident)
  return hospitals.map((hospital) => {
    const distance = distanceKm(incident, hospital)
    const operational = hospital.status === 'operational'
    const hasCapacity = hospital.bedsAvailable > 0
    const traumaAppropriate = hospital.traumaLevel <= requiredTrauma
    const deployable = isHospitalDestinationEligible(hospital)
    const suitability: HospitalSuitability = !deployable ? 'unsuitable' : traumaAppropriate ? 'preferred' : 'limited'
    const reasons = [operational ? 'Operational hospital' : `Hospital status: ${hospital.status}`, `${hospital.bedsAvailable} beds currently available`, `Trauma level ${hospital.traumaLevel}`, `${distance.toFixed(1)} km from incident`]
    if (incident.type === 'medical') reasons.push('Medical incident destination considered')
    if (requiredTrauma < 3) reasons.push(traumaAppropriate ? 'Trauma capability matches incident severity' : 'Lower trauma capability than this incident suggests')
    if (resource?.type === 'ambulance') reasons.push('Compatible with ambulance destination planning')
    const score = (deployable ? 30 : -40) + (hasCapacity ? Math.min(25, hospital.bedsAvailable / 2) : -35) + (traumaAppropriate ? 25 : -15) + Math.max(0, 20 - distance * 2) + (hospital.status === 'strained' ? -10 : 0)
    return { hospital, score: Math.max(0, Math.min(100, Math.round(score))), distanceKm: Number(distance.toFixed(2)), suitability, deployable, reasons }
  }).sort((left, right) => right.score - left.score || left.distanceKm - right.distanceKm || left.hospital.name.localeCompare(right.hospital.name))
}
