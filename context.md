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

---

# 7. CURRENT RESOURCE MOCK STATE

Current mock data:

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
- system status
- selectedIncidentId

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

# 14. RESOURCE ALLOCATION — CURRENT PHASE

Phase 4 is currently being implemented.

Goal:

Selected Incident
↓
Resource Allocation Engine
↓
Evaluate resources
↓
Rank resources
↓
Explain recommendations
↓
Display recommendations
↓
Human operator chooses
↓
Dispatch

IMPORTANT:

Resource allocation must NOT automatically dispatch resources.

The system should recommend resources to the human operator.

---

# 15. RESOURCE ALLOCATION ENGINE

The planned service:

src/services/resourceAllocationService.ts

It should be a pure deterministic service.

It should:
- accept Incident + Resource[]
- calculate suitability
- calculate geographic distance
- consider availability
- consider capacity
- consider incident severity
- consider existing assignments
- produce explainable scores

It must NOT:
- modify Zustand
- modify incidents
- modify resources
- dispatch anything
- modify UI
- call APIs

Distance should initially use Haversine/geographic distance.

This is NOT road distance.

Do not claim it represents actual traffic travel time.

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

# 19. ROUTING

Existing type:

EmergencyRoute

It contains:
- resource ID
- destination ID
- coordinate path
- distance
- duration
- status

Statuses:
- planned
- active
- completed
- blocked

There is currently no route service.

Routing should be implemented later.

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

Completed:

- Base crisis command center UI
- Incident queue
- Crisis map
- Incident markers
- Resource markers
- Hospital markers
- Risk zones
- Alerts
- Zustand state
- Citizen SOS
- Simulated SOS
- Automatic incident triage
- Explainable triage reasons
- Incident details
- Git repository setup

Current:

PHASE 4 — Resource Allocation

Next:

1. Build resourceAllocationService
2. Validate ranking logic
3. Connect allocation engine to Zustand
4. Display recommendations in UI
5. Add human dispatch action
6. Add resource assignment synchronization
7. Begin route optimization

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
Resource allocation — IN PROGRESS.

---

# 27. AI HANDOFF RULE

At the end of each significant task, update this file with:

- what was completed
- files changed
- architecture changes
- tests performed
- current known issues
- next recommended step

Do not delete previous context unless it is genuinely obsolete.

This file is the persistent memory of the RESQ project.