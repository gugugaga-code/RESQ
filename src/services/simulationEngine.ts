export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed'
export type SimulationScenario = 'flood' | 'medical' | 'fire'
export interface SimulationEvent { step: number; message: string; requiresOperator?: boolean }
export interface SimulationScenarioConfig { id: SimulationScenario; label: string; incidentId: string; description: string; events: SimulationEvent[] }

export const majorFloodScenario: SimulationEvent[] = [
  { step: 1, message: 'Major Flood Response started: Koramangala water levels are rising.' },
  { step: 2, message: 'High-priority flood alert issued. Operator action required.', requiresOperator: true },
  { step: 3, message: 'Resource response is progressing along the active route.' },
  { step: 4, message: 'Secondary flood-basin risk alert issued.' },
  { step: 5, message: 'Flood response contained; returning assigned unit to available.' },
]

export const majorMedicalScenario: SimulationEvent[] = [
  { step: 1, message: 'Multi-casualty medical triage is active near Cubbon Park.' },
  { step: 2, message: 'Ambulance and triage units are en route to the incident site.', requiresOperator: true },
  { step: 3, message: 'On-scene triage is complete; treatment coordination is underway.' },
  { step: 4, message: 'Hospital handoff is being prepared for the highest-priority cases.' },
  { step: 5, message: 'Medical response stabilized and resources are clearing back to standby.' },
]

export const majorFireScenario: SimulationEvent[] = [
  { step: 1, message: 'Commercial fire alert is active in Indiranagar.' },
  { step: 2, message: 'Fire crews and drone aerial support are mobilized.', requiresOperator: true },
  { step: 3, message: 'Fire suppression is active on the upper floors.' },
  { step: 4, message: 'Ventilation and smoke-watch teams are stabilizing the site.' },
  { step: 5, message: 'Fire containment complete; crews are resetting to available status.' },
]

export const simulationScenarios: Record<SimulationScenario, SimulationScenarioConfig> = {
  flood: { id: 'flood', label: 'Flood', incidentId: 'inc-001', description: 'Urban flood response with route and basin risk monitoring.', events: majorFloodScenario },
  medical: { id: 'medical', label: 'Medical', incidentId: 'inc-003', description: 'Multi-casualty triage and hospital transfer workflow.', events: majorMedicalScenario },
  fire: { id: 'fire', label: 'Fire', incidentId: 'inc-002', description: 'Fire suppression and airflow management scenario.', events: majorFireScenario },
}

export const defaultSimulationScenario: SimulationScenario = 'flood'

let timer: ReturnType<typeof setInterval> | null = null
export const startSimulationTimer = (advance: () => void) => { if (!timer) timer = setInterval(advance, 5000) }
export const pauseSimulationTimer = () => { if (timer) clearInterval(timer); timer = null }
