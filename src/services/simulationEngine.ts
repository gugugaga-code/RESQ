export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed'
export interface SimulationEvent { step: number; message: string; requiresOperator?: boolean }
export const majorFloodScenario: SimulationEvent[] = [
  { step: 1, message: 'Major Flood Response started: Koramangala water levels are rising.' },
  { step: 2, message: 'High-priority flood alert issued. Operator action required.', requiresOperator: true },
  { step: 3, message: 'Resource response is progressing along the active route.' },
  { step: 4, message: 'Secondary flood-basin risk alert issued.' },
  { step: 5, message: 'Flood response contained; returning assigned unit to available.' },
]
let timer: ReturnType<typeof setInterval> | null = null
export const startSimulationTimer = (advance: () => void) => { if (!timer) timer = setInterval(advance, 5000) }
export const pauseSimulationTimer = () => { if (timer) clearInterval(timer); timer = null }
