# RESQ — Project Context

## 1. PROJECT OVERVIEW

RESQ is a crisis-response command center MVP being built for a hackathon.

The goal is to provide a centralized interface for managing emergencies, incidents, resources, hospitals, alerts, and automated decision support.

Current focus:
- Crisis response
- Citizen SOS
- Automated incident triage
- Resource allocation
- Map-based incident visualization
- Emergency response coordination

This is currently a frontend-focused MVP using mock/local data.

---

# 2. DEVELOPMENT ENVIRONMENT

Project location:

E:\STAMPERS\RESQ

Repository:

https://github.com/gugugaga-code/RESQ

Main branch:

main

Technology:
- React
- TypeScript
- Vite
- Zustand
- Leaflet
- Tailwind/CSS
- Frontend-only mock data currently

No backend has been implemented yet.

Do not add dependencies unless explicitly requested.

---

# 3. IMPORTANT DEVELOPMENT RULE

Before making changes:

1. Inspect the existing architecture.
2. Reuse existing types/services/store patterns.
3. Make the smallest reasonable change.
4. Do not rewrite working systems unnecessarily.
5. Do not create duplicate types.
6. Do not add dependencies without approval.
7. Do not modify unrelated files.
8. Keep business logic separate from UI.
9. Keep automated decisions explainable.
10. Do not hardcode results for individual test cases.

When implementing a feature, prefer:

UI
↓
Service
↓
Store
↓
Types / Mock Data

rather than putting business logic directly inside React components.

---

# 4. CURRENT ARCHITECTURE

src/
├── app/
├── components/
│   ├── layout/
│   ├── map/
│   ├── sos/
│   ├── status/
│   └── ui/
├── config/
├── data/
│   └── mock/
├── services/
├── store/
├── styles/
└── types/

---

# 5. CORE TYPES

## Incident

Incident contains:

- id
- type
- severity
- status
- title
- description
- location
- reportedAt
- updatedAt
- reportedBy
- affectedRadiusMeters
- casualtiesEstimate
- assignedResourceIds
- triageScore
- triageConfidence
- triageReasons

Incident types:

- fire
- flood
- earthquake
- medical
- structural_collapse
- hazmat
- accident
- other

Incident severity:

- critical
- high
- medium
- low

Incident status:

- active
- contained
- resolved
- monitoring

---

# 6. RESOURCE SYSTEM

Resource types:

- ambulance
- fire_truck
- police_unit
- rescue_team
- medical_team
- drone
- shelter_unit

Resource statuses:

- available
- dispatched
- busy
- offline

Resource contains:

- id
- type
- callSign
- status
- location
- capacity
- assignedIncidentId
- etaMinutes
- lastUpdated

Current mock resources include:

- RESCUE-12
- FIRE-07
- EYE-03
- MED-22
- TRIAGE-5
- POLICE-31
- FIRE-11
- MED-18
- RESCUE-21

---

# 7. CURRENT RESOURCE MOCK STATE

Current mock data contains 9 resources. It is intentionally mixed so the recommendation workflow can be demonstrated while retaining a believable emergency-response state.

RESCUE-12
- rescue_team
- busy
- assigned to inc-001
- capacity 12

FIRE-07
- fire_truck
- dispatched
- assigned to inc-002
- capacity 6

EYE-03
- drone
- busy
- assigned to inc-002
- capacity 0

MED-22
- ambulance
- dispatched
- assigned to inc-001
- capacity 4

TRIAGE-5
- medical_team
- busy
- assigned to inc-003
- capacity 8

POLICE-31
- police_unit
- available
- unassigned
- capacity 4

FIRE-11
- fire_truck
- available reserve
- unassigned
- capacity 6

MED-18
- ambulance
- available reserve
- unassigned
- capacity 4

RESCUE-21
- rescue_team
- available reserve
- unassigned
- capacity 10

Some resources remain busy or dispatched, while the available reserve resources allow suitable deployable recommendations for fire, medical, structural-collapse, and accident incidents.

---

# 8. HOSPITAL SYSTEM

Hospital data contains:

- location
- total beds
- available beds
- trauma level
- operational status

Current mock data contains three Bengaluru hospitals.

Hospital information may later be used for:
- destination selection
- patient routing
- hospital capacity decisions
- emergency resource allocation

---

# 9. MAP

The application uses Leaflet.

The map currently displays:
- incidents
- resources
- hospitals
- risk zones
- the selected incident's active emergency response route

Incident selection is synchronized with the application state.

---

# 10. STATE MANAGEMENT

Zustand is used through:

src/store/useCrisisStore.ts

The store currently manages:

- incidents
- resources
- riskZones
- hospitals
- alerts
- recommendations
- allocationRecommendations
- allocationIncidentId
- routes
- system status
- selectedIncidentId
- simulationStatus, simulationStep, simulationEvent

Important actions include:

- setIncidents
- upsertIncident
- removeIncident
- setResources
- upsertResource
- setRiskZones
- addAlert
- acknowledgeAlert
- setSystemStatus
- selectIncident
- calculateAllocationForSelectedIncident
- dispatchResource
- upsertRoute
- removeRoute
- startSimulation, pauseSimulation, resetSimulation, advanceSimulation

---

# 11. CITIZEN SOS

Citizen SOS has been implemented.

SOS flow:

Citizen
↓
SOS Modal
↓
incidentService
↓
triageService
↓
Zustand
↓
incident queue
↓
map
↓
alerts
↓
incident details

Both:
- Send SOS
- Simulate SOS

use the same incident creation pipeline.

---

# 12. AUTOMATED TRIAGE

Severity should NOT be manually selected by the citizen.

The system determines severity automatically.

Triage uses:
- incident type
- affected people
- description signals
- severity indicators

The result contains:
- severity
- score
- confidence
- reasons

The triage result is stored on the Incident.

The system must remain explainable.

Example reasons:
- large number of affected people
- catastrophic incident signal
- trapped residents
- unconscious patient
- major accident
- structural collapse

Do not hardcode severity based on a test case.

---

# 13. TRIAGE PRINCIPLES

Current intended behavior:

Low:
minor incidents with low impact

Medium:
contained/moderate incidents

High:
serious incidents requiring significant response

Critical:
catastrophic incidents, mass casualty situations, structural collapse, major widespread fires, etc.

Examples previously tested:

Minor accident + 1 affected:
Low

Major accident + multiple injured:
High

Major accident + plane crash + 120 affected:
Critical

Small contained fire:
Medium

Large spreading fire + trapped residents:
Critical

Unconscious medical emergency:
High

Structural collapse:
Critical

---

# 14. RESOURCE ALLOCATION AND DISPATCH — PHASE 4 COMPLETED

Phase 4 is complete. Current Phase 4 architecture:

Goal:

Incident
↓
Automated triage
↓
Resource allocation
↓
Ranked recommendations
↓
Human confirmation
↓
Dispatch
↓
Resource assignment
↓
Mock ETA
↓
Updated UI/map state

IMPORTANT:

Resource allocation must NOT automatically dispatch resources; dispatch requires explicit human confirmation.

The system should recommend resources to the human operator.

---

# 15. RESOURCE ALLOCATION ENGINE AND DISPATCH

`src/services/resourceAllocationService.ts` is a pure deterministic ranking service. It accepts incident and resource inputs, calculates suitability, geographic distance, availability, capacity, incident severity, and existing-assignment factors, and returns explainable ranked recommendations. It does not mutate Zustand, incidents, resources, UI, or dispatch state.

`src/services/dispatchService.ts` handles dispatch validation and deterministic mock ETA calculation. Zustand stores allocation recommendations and applies successful dispatch state changes.

Resources become `dispatched` only after explicit human confirmation. After successful dispatch, the resource receives `assignedIncidentId` and the incident receives the resource ID in `assignedResourceIds`.

ETA is a deterministic mock estimate based on geographic distance. It is not traffic-aware and is not road-network routing. State is currently in-memory and resets on page reload.

---

# 16. RESOURCE SUITABILITY

Preferred mappings:

fire:
- fire_truck
- rescue_team
- drone

medical:
- ambulance
- medical_team

structural_collapse:
- rescue_team
- ambulance
- drone

hazmat:
- fire_truck
- medical_team
- rescue_team

accident:
- ambulance
- police_unit
- rescue_team

flood:
- rescue_team
- ambulance
- drone

earthquake:
- rescue_team
- medical_team
- ambulance
- drone

other:
- broad suitability

Suitability should be one of the strongest allocation factors.

---

# 17. RESOURCE AVAILABILITY

Available:
- deployable

Busy:
- not immediately deployable

Dispatched:
- not immediately deployable

Offline:
- never deployable

Already assigned resources should receive a significant penalty.

Do not recommend stealing an active resource from another incident merely because it is nearby.

---

# 18. ALLOCATION SCORING PRINCIPLES

The score should approximately be 0–100.

Factors:

1. suitability
2. availability
3. geographic distance
4. capacity
5. incident severity
6. existing assignment
7. offline status

Scoring must be:
- deterministic
- transparent
- explainable
- easy to tune

No machine learning.
No randomness.

---

# 19. PHASE 5 — EMERGENCY ROUTE VISUALIZATION
Goal: after a resource is dispatched, visualize an emergency response route between the resource and incident on the Leaflet map.

Existing route type: `src/types/route.types.ts`

`EmergencyRoute` contains:
- id
- resourceId
- destinationId
- path
- distanceMeters
- durationSeconds
- status

Statuses:
- planned
- active
- completed
- blocked

Phase 5 is complete.

`src/services/routeService.ts` is a pure deterministic service that generates active `EmergencyRoute` objects from a dispatched resource location and incident location. Each route starts at the resource, ends at the incident, and includes two deterministic intermediate points for a visually useful non-looping mock route geometry.

Zustand stores active routes in `routes`. On successful human-confirmed dispatch, the store validates the dispatch, updates resource and incident assignment state, generates the route, and stores it. Failed dispatches do not generate routes.

`src/components/map/EmergencyRouteLayer.tsx` renders the currently selected incident's active route as a Leaflet polyline. `SidebarRight.tsx` displays a compact response-route card with the dispatched resource, incident, mock ETA, and active route status.

The route geometry, distance, and ETA are deterministic mock values based on geographic coordinates. They are not traffic-aware, not road-network routing, not live GPS, and use no external APIs. Route and dispatch state remain in memory and reset on reload.

---

# 20. UI PRINCIPLES

Current UI is an MVP and may still look somewhat "vibe coded."

Eventually improve:
- visual hierarchy
- spacing
- typography
- consistency
- professional emergency-command-center aesthetic
- information density
- accessibility

BUT:

Do not redesign the entire UI while implementing backend/business logic.

Functionality first.
Visual polish later.

---

# 21. TESTING PRINCIPLES

After meaningful code changes:

Run:

npm.cmd run build

Do not introduce unnecessary testing infrastructure.

When testing automated decisions, test representative scenarios rather than hardcoding specific expected outputs into the implementation.

Browser testing is useful when available.

---

# 22. GIT WORKFLOW

Repository:

https://github.com/gugugaga-code/RESQ

Main branch:

main

Before committing:
- verify changes
- build
- review git diff

Use descriptive commits.

Example:

git add .
git commit -m "Implement resource allocation engine"
git push

Do not commit secrets or tokens.

---

# 23. AI CODING WORKFLOW

Multiple AI tools may be used.

Preferred workflow:

1. Main planning/context is maintained in CONTEXT.md.
2. Give AI tools focused tasks.
3. Avoid asking an AI to rewrite the whole project.
4. Inspect before modifying unfamiliar areas.
5. Make one architectural change at a time.
6. Build after meaningful changes.
7. Update CONTEXT.md after completed phases.

When starting a new AI conversation:
- provide CONTEXT.md
- explain the current phase
- give the exact task
- specify files that may be modified
- specify files that must not be modified

---

# 24. CURRENT PROJECT STATUS

- Phase 1 — Command Center MVP: COMPLETED
- Phase 2 — Incident/map/state functionality: COMPLETED
- Phase 3 — Citizen SOS + automated triage: COMPLETED
- Phase 4A — Resource Allocation Engine: COMPLETED
- Phase 4B — Allocation integrated with Zustand: COMPLETED
- Phase 4C — Resource Recommendations UI: COMPLETED
- Phase 4D — Realistic deployable mock resource state: COMPLETED
- Phase 4E — Human-confirmed Resource Dispatch: COMPLETED
- Phase 5 — Emergency Route Visualization: COMPLETED

Next: future route lifecycle simulation or real routing only if explicitly requested.

---

# 25. IMPORTANT PRODUCT PRINCIPLE

RESQ is an emergency decision-support system.

The system should:

AUTOMATE:
- triage
- scoring
- ranking
- calculations
- alerts
- recommendations

The human operator should retain control over:
- dispatch
- assignment
- overriding recommendations
- final operational decisions

Do not build the system as an autonomous emergency dispatcher.

---

# 26. CHANGE LOG

## Phase 1
Initial command-center MVP.

## Phase 2
Incident/map/state functionality.

## Phase 3
Citizen SOS + automated triage.

## Phase 4
Resource allocation and human-confirmed dispatch — COMPLETED.

- Added `src/services/resourceAllocationService.ts` for deterministic, explainable ranking.
- Added allocation recommendation state and selected-incident calculation in Zustand.
- Added resource recommendations UI in the right sidebar.
- Expanded mock resources to 9 intentionally mixed busy/dispatched/available units.
- Added `src/services/dispatchService.ts` for dispatch validation and mock ETA calculation.
- Added confirmed-dispatch state synchronization for resources and incidents.
- Build result: `npm.cmd run build` completed successfully.

## Phase 5
Emergency Route Visualization — COMPLETED.

- Added `src/services/routeService.ts`.
- Added `routes`, `upsertRoute`, and `removeRoute` to `src/store/useCrisisStore.ts`.
- Successful human-confirmed dispatch now creates and stores one active deterministic route.
- Added `src/components/map/EmergencyRouteLayer.tsx` and mounted it in `CrisisMap.tsx`.
- Added compact active-route status to `SidebarRight.tsx`.
- Updated `src/styles/theme.css` for the route status card.
- Build result: `npm.cmd run build` completed successfully.
- Manual validation: fire and medical routes rendered after dispatch, route visibility followed incident selection, an incident without a route showed none, refresh reset mock route state, and no browser console errors were found.
- Limitations: mock geographic geometry only; no road routing, traffic data, external APIs, live GPS, or route completion simulation.

## Phase 6
Live Crisis Simulation — IMPLEMENTED; validation in progress.

- Added `src/services/simulationEngine.ts` with the deterministic Major Flood Response event sequence and a single controlled timer.
- Zustand owns simulation status, step, event message, and start/pause/reset/advance actions.
- The scenario selects the flood incident, pauses for explicit operator dispatch, then uses an active OSRM route to advance a resource location and lower its ETA.
- It adds a flood-risk alert/update and ends by containing the incident and releasing assigned resources.
- The simulation control is in `src/components/layout/BottomStrip.tsx`.
- Build result: `npm.cmd run build` completed successfully.
- Reset now deep-clones the canonical mock incidents, resources, risk zones, hospitals, alerts, and recommendations; clears routes; restores the original selected incident; and regenerates allocation recommendations from restored data.
- Known limitations: state remains in memory and routing depends on public OSRM/network availability.

## Phase 7
Offline / Low-Connectivity Resilience — COMPLETED.

- Added deterministic local-first connectivity state using the existing Zustand `system` state: `online`, `degraded`, and `offline`, plus an explicit `syncing` status.
- Added `src/types/offline.types.ts` and `src/services/offlineQueueService.ts` for typed, FIFO, de-duplicated local synchronization actions. The Zustand store owns the queue and keeps `pendingSyncActions` accurate for the UI.
- Added `src/services/syncService.ts` for clearly labeled simulated local synchronization. When connectivity returns online, pending actions are acknowledged in FIFO order and the stored last-sync timestamp is updated. No backend or external sync service is used.
- Citizen SOS continues to create and select incidents immediately. In degraded or offline modes, the SOS action is retained locally for simulated synchronization and the intake form makes that status clear.
- Human-confirmed dispatch remains mandatory. Degraded/offline confirmations update incident and resource state locally and queue the dispatch synchronization action; no dispatch is automated.
- OSRM requests are never made in offline mode. The route is marked pending with an explicit connectivity message and is retried when online connectivity returns. In degraded mode, OSRM is attempted and failures remain pending for a later retry.
- Added compact connectivity controls in `BottomStrip` for online, degraded, and offline demos, plus connectivity/sync display and `Pending sync: N` status.
- Files changed: `src/store/useCrisisStore.ts`, `src/types/system.types.ts`, `src/types/route.types.ts`, `src/types/offline.types.ts`, `src/services/offlineQueueService.ts`, `src/services/syncService.ts`, `src/services/routeService.ts`, `src/app/App.tsx`, `src/components/status/ConnectivityIndicator.tsx`, `src/components/status/SystemStatusBar.tsx`, `src/components/layout/BottomStrip.tsx`, `src/components/layout/SidebarRight.tsx`, `src/components/sos/CitizenSosModal.tsx`, and `src/styles/theme.css`.
- Build result: `npm.cmd run build` completed successfully.
- Known limitations: all local state and queued actions are in memory and reset on page reload; synchronization is an intentionally simulated local acknowledgement; OSRM and map tiles still depend on external network availability when online/degraded.
- Next: persist local state only if explicitly requested, or add a backend synchronization contract in a future phase.

---

# 27. AI HANDOFF RULE

At the end of each significant task, update this file with:

- what was completed
- files changed
- architecture changes
- build result and tests performed
- current known limitations
- next recommended step

After every completed phase, CONTEXT.md must record the build result, files changed, known limitations, and next phase.

Do not delete previous context unless it is genuinely obsolete.

This file is the persistent memory of the RESQ project.
