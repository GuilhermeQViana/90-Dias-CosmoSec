<!-- Technical Specification Template
     Populated by /game:build-plan from simulation session data.
     Lives at: .game-design/<slug>/output/tech-spec.md -->

# <Title> — Technical Specification

## Architecture Overview

### Engine / Framework

<!-- Recommended engine or framework with rationale.
     Consider: scope target, team size, platform, genre conventions.
     Source: concept.yaml → scope.engine, simulation decisions -->

Engine: <!-- e.g. Godot 4, Unity, Bevy, Pygame, custom -->
Rationale: <!-- why this engine fits the project -->

### Module Decomposition

<!-- High-level module breakdown of the game architecture.
     Each module: name, responsibility, key interfaces.
     Source: GDD mechanics, implementation patterns -->

```
┌─────────────────────────────────────────────┐
│  Game                                       │
├──────────┬──────────┬──────────┬────────────┤
│  Core    │  Systems │  Content │  UI        │
│          │          │          │            │
│ - Loop   │ - <sys>  │ - <res>  │ - HUD      │
│ - State  │ - <sys>  │ - <res>  │ - Menus    │
│ - Input  │ - <sys>  │ - <res>  │ - Screens  │
└──────────┴──────────┴──────────┴────────────┘
```

| Module | Responsibility | Key Interfaces |
|--------|---------------|----------------|
| Core | Game loop, state machine, input mapping | <!-- e.g. update(delta), transition(state) --> |
| <!-- module --> | <!-- responsibility --> | <!-- interfaces --> |

## Implementation Phases

<!-- Follows tracer bullet → core loop → content → polish progression.
     Each phase has a clear goal, deliverables, and exit criteria.
     Source: scoping MLP phases, GDD mechanics and content requirements -->

### Phase 0: Tracer Bullet

<!-- First end-to-end vertical slice through all 5 layers.
     Goal: prove the architecture works for one action.
     Source: scoping → Tracer Bullet Methodology -->

**Goal:** <!-- one sentence describing the tracer bullet -->

**5-Layer Slice:**

| Layer | Implementation |
|-------|---------------|
| Input | <!-- what the player does --> |
| Core Mechanic | <!-- what the game does in response --> |
| Game State | <!-- what changes --> |
| Feedback | <!-- what the player sees/hears --> |
| Consequence | <!-- what's different going forward --> |

**Exit criteria:**
- [ ] <!-- observable outcome that proves the slice works -->

### Phase 1: Core Loop (MLP)

<!-- Complete core loop + up to 3 supporting features.
     Goal: validate fun.
     Source: GDD → Core Mechanics + Supporting Mechanics -->

**Goal:** <!-- playable core loop that answers "is it fun?" -->

**Features:**

| # | Feature | Slices | Exit Criteria |
|---|---------|--------|---------------|
| 1 | <!-- core mechanic --> | <!-- slice descriptions --> | <!-- when it's done --> |
| 2 | <!-- supporting mechanic 1 --> | <!-- slice descriptions --> | <!-- when it's done --> |
| 3 | <!-- supporting mechanic 2 --> | <!-- slice descriptions --> | <!-- when it's done --> |
| 4 | <!-- supporting mechanic 3 --> | <!-- slice descriptions --> | <!-- when it's done --> |

**Exit criteria:**
- [ ] Core loop is playable end-to-end
- [ ] Playtest confirms "I want to keep playing"
- [ ] <!-- game-specific criterion -->

### Phase 2: Content Alpha

<!-- Add variety: enemies, levels, items.
     Goal: 15-30 minute play session.
     Source: GDD → Content Requirements L2 -->

**Goal:** <!-- enough content for a meaningful play session -->

**Content targets:**

| Content Type | Count | Priority |
|-------------|-------|----------|
| <!-- type --> | <!-- count --> | Must / Should / Could |

**Exit criteria:**
- [ ] <!-- session length target -->
- [ ] <!-- variety target -->

### Phase 3: Systems & Polish

<!-- Progression, meta-game, saves, UI polish.
     Goal: players want to return.
     Source: GDD → Economy & Progression, deferred mechanics -->

**Goal:** <!-- complete game experience with retention -->

**Systems:**

| System | Description | Priority |
|--------|-------------|----------|
| <!-- system --> | <!-- what it does --> | Must / Should / Could |

**Exit criteria:**
- [ ] Save/load works
- [ ] <!-- progression criterion -->
- [ ] <!-- polish criterion -->

## Per-Phase Task Breakdown

<!-- Detailed tasks for each phase. Each task is a vertical slice
     (player-facing outcome) not a horizontal system.
     Tasks should follow the verb test: "Player [verb]s..."
     Source: phase definitions above, GDD mechanics -->

### Phase 0 Tasks

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| 0.1 | <!-- task description --> | <!-- time --> | — |
| 0.2 | <!-- task description --> | <!-- time --> | 0.1 |

### Phase 1 Tasks

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| 1.1 | <!-- task description --> | <!-- time --> | Phase 0 |
| 1.2 | <!-- task description --> | <!-- time --> | 1.1 |

### Phase 2 Tasks

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| 2.1 | <!-- task description --> | <!-- time --> | Phase 1 |

### Phase 3 Tasks

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| 3.1 | <!-- task description --> | <!-- time --> | Phase 2 |

## Technical Decisions

<!-- Key technical choices with rationale and alternatives considered.
     Source: simulation decisions (technical category), engine constraints -->

### Rendering

<!-- Rendering approach: 2D/3D, sprite-based, tile-based, etc.
     Source: concept.yaml, simulation wireframes -->

Approach: <!-- e.g. 2D sprite-based, 3D low-poly, tile-based -->
Rationale: <!-- why this fits -->

### State Management

<!-- Game state architecture: FSM, hierarchical FSM, ECS, etc.
     Source: implementation → State Management -->

Pattern: <!-- e.g. Enum + switch FSM -->
Rationale: <!-- why this fits the game's state complexity -->

### Input

<!-- Input handling approach.
     Source: implementation → Input Handling, GDD → Input Mapping -->

Pattern: <!-- e.g. Action mapping layer -->
Supported inputs: <!-- keyboard, gamepad, touch -->

### Audio

<!-- Audio approach: SFX system, music, dynamic audio.
     Source: simulation decisions on feedback -->

Approach: <!-- e.g. Event-driven SFX + looping music tracks -->

### Save / Load

<!-- Persistence strategy: what's saved, format, when.
     Source: simulation decisions on progression -->

Strategy: <!-- e.g. JSON state file, auto-save on room transition -->
Saved data: <!-- what persists between sessions -->

## Risk Register

<!-- Technical and design risks with mitigation plans.
     Source: brainstorm.md → Open Questions, simulation gaps, scope analysis -->

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | <!-- risk description --> | Low/Med/High | Low/Med/High | <!-- mitigation plan --> |
| 2 | <!-- risk description --> | Low/Med/High | Low/Med/High | <!-- mitigation plan --> |
