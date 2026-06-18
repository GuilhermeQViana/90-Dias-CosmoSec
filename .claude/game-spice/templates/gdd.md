<!-- Game Design Document Template
     Populated by /game:build-plan from simulation session data.
     Lives at: .game-design/<slug>/output/gdd.md -->

# <Title> — Game Design Document

## Design Pillars

<!-- 2-4 design pillars derived from brainstorm aesthetics and simulation decisions.
     Each pillar is a principle that guides all design decisions.
     Format: bold name + one-sentence description of what it means in practice.
     Source: brainstorm.md → Aesthetics + MDA mapping, decisions.log -->

- **<Pillar>** — <!-- what this means for design decisions -->

## Success Criteria

<!-- Measurable criteria for when the game achieves its goals.
     Tied to the MLP validation question: "Is it fun?"
     Include both feel-based and observable criteria.
     Source: brainstorm.md → Core Loop validation, simulation decisions -->

- [ ] <!-- criterion -->

## Game Overview

### Concept

<!-- 2-3 sentence description of the game.
     Source: brainstorm.md → Elevator Pitch -->

### Audience

<!-- Target player profile: who is this for?
     Source: brainstorm.md → Scope, simulation decisions -->

### Platform

<!-- Platform, input method, and any technical constraints.
     Source: concept.yaml → platform, input_method -->

Platform: <!-- e.g. PC, mobile, web -->
Input: <!-- e.g. keyboard+mouse, touch, gamepad -->

### Core Loop

<!-- One-sentence core loop using the validation format:
     "The player [VERB]s [OBJECT] to [REWARD], which lets them [REINVEST]."
     Source: concept.yaml → core_loop, brainstorm.md → Core Loop -->

## Mechanics

### Core Mechanics

<!-- Mechanics essential to the core loop. The game doesn't work without these.
     Each mechanic: name, description, and reference to simulation turns that explored it.
     Source: concept.yaml → mechanics, simulation turns -->

| Mechanic | Description | Explored in |
|----------|-------------|-------------|
| <!-- name --> | <!-- description --> | Turn <!-- NNN --> |

### Supporting Mechanics (MLP)

<!-- Up to 3 amplifier features beyond the core loop (per 3-Feature Rule).
     These make the core loop more fun but aren't the loop itself.
     Source: simulation decisions, brainstorm.md → Key Mechanics -->

| Mechanic | Impact Level | Description | Explored in |
|----------|-------------|-------------|-------------|
| <!-- name --> | Amplifier | <!-- description --> | Turn <!-- NNN --> |

### Deferred Mechanics

<!-- Mechanics identified during brainstorm/simulation but deferred beyond MLP.
     Include the reason for deferral.
     Source: brainstorm.md → Open Questions, simulation decisions with "deferred" tag -->

| Mechanic | Category | Reason Deferred |
|----------|----------|-----------------|
| <!-- name --> | Enhancer/Content/Cosmetic | <!-- why it's not in MLP --> |

## Game World

### Setting

<!-- World description, narrative context, and tone.
     Source: simulation turns, brainstorm.md → Design Notes -->

### Areas / Environments

<!-- Distinct areas or environments the player will encounter.
     Include world structure type (linear, hub-and-spoke, procedural, etc.).
     Source: simulation wireframes and turns -->

World structure: <!-- linear | hub-and-spoke | open world | metroidvania | procedural -->

| Area | Description | Introduced at |
|------|-------------|---------------|
| <!-- name --> | <!-- description --> | <!-- beat or turn --> |

### Visual Style

<!-- Art direction, color palette, visual references.
     Source: simulation wireframes, brainstorm aesthetics -->

## UI/UX

### HUD Layout

<!-- Primary gameplay HUD. Include ASCII wireframe.
     Source: simulation wireframes (wf-NNN files) -->

```
<wireframe>

Legend: <symbol> <meaning>
```

### Screen Flow

<!-- Diagram of screen-to-screen navigation.
     Source: simulation turns covering different screens/states -->

```
<screen flow diagram>
```

### Input Mapping

<!-- Player actions mapped to inputs.
     Source: simulation decisions on input, concept.yaml → input_method -->

| Action | Keyboard | Gamepad | Touch |
|--------|----------|---------|-------|
| <!-- action --> | <!-- key --> | <!-- button --> | <!-- gesture --> |

### Additional Wireframes

<!-- All other wireframes from simulation, organized by screen/state.
     Source: .game-design/<slug>/simulation/wireframes/ -->

#### <Screen/State Name>

```
<wireframe>

Legend: <symbol> <meaning>
```

## Economy & Progression

<!-- Include this section if the game has resource systems or progression.
     Omit entirely if not applicable (e.g. pure action games with no progression).
     Source: simulation decisions on economy, economy-design guidance -->

### Resources

| Resource | Source (Earn) | Sink (Spend) | Player Decision |
|----------|---------------|--------------|-----------------|
| <!-- name --> | <!-- how earned --> | <!-- how spent --> | <!-- what choice it creates --> |

### Progression

<!-- How the player advances: unlocks, power growth, new content access.
     Source: simulation decisions on progression -->

## Content Requirements

<!-- Content needed at each quality level.
     L0 = tracer bullet (prove architecture), L1 = MLP (prove fun),
     L2 = content alpha (prove variety), L3 = full release.
     Source: simulation coverage, content-planning production ratios -->

| Content Type | L0 (Tracer) | L1 (MLP) | L2 (Alpha) | L3 (Release) |
|-------------|-------------|----------|------------|--------------|
| <!-- e.g. Levels --> | <!-- count --> | <!-- count --> | <!-- count --> | <!-- count --> |
| <!-- e.g. Enemy types --> | <!-- count --> | <!-- count --> | <!-- count --> | <!-- count --> |
| <!-- e.g. Items --> | <!-- count --> | <!-- count --> | <!-- count --> | <!-- count --> |

## Assumptions to Validate

<!-- Decisions made by the AI (suggested or inferred) during brainstorm and simulation.
     These should be validated during playtesting — the designer did not explicitly confirm them.
     Populated by /game:build-plan Step 4 from decisions.log.
     Omit empty priority subsections. -->

**<!-- count --> assumptions flagged** (<!-- suggested_count --> suggested, <!-- inferred_count --> inferred)

### High Priority (Mechanic Assumptions)

<!-- Assumptions about how game systems work — incorrect assumptions here break gameplay -->

| ID | Decision | Origin | Source Turn |
|----|----------|--------|-------------|
| <!-- id --> | <!-- decision --> | <!-- origin --> | <!-- Turn NNN or Brainstorm --> |

### Medium Priority (Feedback & Progression)

<!-- Assumptions about what the player sees/feels — wrong assumptions hurt experience -->

| ID | Decision | Origin | Source Turn |
|----|----------|--------|-------------|
| <!-- id --> | <!-- decision --> | <!-- origin --> | <!-- Turn NNN or Brainstorm --> |

### Low Priority (Content & Scope)

<!-- Assumptions about content details — easy to change later -->

| ID | Decision | Origin | Source Turn |
|----|----------|--------|-------------|
| <!-- id --> | <!-- decision --> | <!-- origin --> | <!-- Turn NNN or Brainstorm --> |

## Appendix

### Decision Log Summary

<!-- Summary of decisions made during brainstorm and simulation.
     Group by category. Include origin (user/suggested/inferred).
     Full log lives in decisions.log.
     Source: .game-design/<slug>/decisions.log -->

**Total decisions:** <!-- count --> (<!-- user --> user / <!-- suggested --> suggested / <!-- inferred --> inferred)

| ID | Category | Decision | Origin |
|----|----------|----------|--------|
| <!-- sim-NNN --> | <!-- category --> | <!-- decision --> | <!-- user/suggested/inferred --> |

### Coverage Report

<!-- Summary of simulation coverage at time of plan generation.
     Source: .game-design/<slug>/simulation/coverage.yaml -->

**Beats:**

| Beat | Status | Confidence | Turns |
|------|--------|------------|-------|
| First Contact | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Learning the Verb | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Core Loop in Motion | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Rising Stakes | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Session End | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |

**Systems:**

| System | Status | Confidence | Turns |
|--------|--------|------------|-------|
| UI Layout | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Input Mapping | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Feedback Loops | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Difficulty | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |
| Economy | <!-- status --> | <!-- 0.0-1.0 --> | <!-- turn list --> |

### Wireframe Index

<!-- All wireframes collected from simulation, with references.
     Source: .game-design/<slug>/simulation/wireframes/ -->

| Wireframe | Turn | Description | File |
|-----------|------|-------------|------|
| <!-- wf-NNN-name --> | <!-- turn --> | <!-- what it shows --> | <!-- filename --> |
