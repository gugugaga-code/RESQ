import { Command, Layers3, SlidersHorizontal } from 'lucide-react'
import { SystemStatusBar } from '../status/SystemStatusBar'
import { useCrisisStore } from '../../store/useCrisisStore'
import { simulationScenarios } from '../../services/simulationEngine'

export function BottomStrip() {
  const status = useCrisisStore((state) => state.simulationStatus)
  const step = useCrisisStore((state) => state.simulationStep)
  const event = useCrisisStore((state) => state.simulationEvent)
  const system = useCrisisStore((state) => state.system)
  const selectedScenario = useCrisisStore((state) => state.simulationScenario)
  const start = useCrisisStore((state) => state.startSimulation)
  const pause = useCrisisStore((state) => state.pauseSimulation)
  const reset = useCrisisStore((state) => state.resetSimulation)
  const advance = useCrisisStore((state) => state.advanceSimulation)
  const setScenario = useCrisisStore((state) => state.setSimulationScenario)
  const online = useCrisisStore((state) => state.simulateOnline)
  const degraded = useCrisisStore((state) => state.simulateDegraded)
  const offline = useCrisisStore((state) => state.simulateOffline)
  const scenarioEntries = Object.values(simulationScenarios)
  const stepLimit = simulationScenarios[selectedScenario].events.length

  return <footer className="bottom-strip"><SystemStatusBar /><div className="simulation-control"><strong>SIMULATION</strong><div className="scenario-selector">{scenarioEntries.map((scenario) => <button type="button" className={`scenario-button ${selectedScenario === scenario.id ? 'active' : ''}`} key={scenario.id} onClick={() => setScenario(scenario.id)}>{scenario.label}</button>)}</div><span>{status} · {step}/{stepLimit}</span><small>{event ?? 'Scenario ready'}</small><button type="button" onClick={() => start(selectedScenario)}>{status === 'running' ? 'RUNNING' : 'START'}</button><button type="button" onClick={pause}>PAUSE</button><button type="button" onClick={advance}>ADVANCE</button><button type="button" onClick={reset}>RESET</button></div><div className="connectivity-control"><strong>{system.syncStatus === 'syncing' ? 'SYNCING' : system.connectivity.toUpperCase()}</strong><span>Pending sync: {system.pendingSyncActions}</span><button type="button" onClick={online}>ONLINE</button><button type="button" onClick={degraded}>DEGRADED</button><button type="button" onClick={offline}>OFFLINE</button></div><div className="control-placeholder"><button type="button" className="placeholder-control" disabled aria-disabled="true"><Layers3 size={14} /> Layers</button><button type="button" className="placeholder-control" disabled aria-disabled="true"><SlidersHorizontal size={14} /> Filters</button><button type="button" className="placeholder-control" disabled aria-disabled="true"><Command size={14} /> Command palette</button></div></footer> }
