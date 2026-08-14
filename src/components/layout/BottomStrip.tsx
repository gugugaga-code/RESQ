import { Command, Layers3, SlidersHorizontal } from 'lucide-react'
import { SystemStatusBar } from '../status/SystemStatusBar'
export function BottomStrip() { return <footer className="bottom-strip"><SystemStatusBar /><div className="control-placeholder"><span><Layers3 size={14} /> Layers</span><span><SlidersHorizontal size={14} /> Filters</span><span><Command size={14} /> Command palette</span></div></footer> }
