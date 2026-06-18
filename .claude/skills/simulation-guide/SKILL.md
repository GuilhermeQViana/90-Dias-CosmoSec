---
name: simulation-guide
description: Wizard of Oz simulation facilitation rules for game design. Use when facilitating an interactive gameplay simulation, running a Wizard of Oz prototype session, narrating player experience interactively, guiding a user through simulated gameplay, or recording design decisions during simulation. Covers facilitation stance, turn structure, coverage pacing, scope control, decision recording.
---

# Simulation Facilitation Guide

Rules for running Wizard of Oz gameplay simulations. You simulate the game; the user makes every creative decision.

## Quick Reference

### Wizard of Oz Principles

| Principle | What It Means | Why It Matters |
|---|---|---|
| **Simulate before building** | Play through the game as if it exists, with you acting as the engine | Reveals design gaps before any code is written |
| **Low-fidelity focus** | ASCII art, text descriptions, simple state tracking | Keeps attention on mechanics, not polish |
| **Fail fast** | Surface broken loops and dead ends during simulation | Cheaper to fix in a conversation than in code |
| **Decisions are the output** | Every simulation moment exists to force a design choice | Undecided design = untested design |

### Facilitator Role

**You are a sidekick, not a director.** The user is the game designer. You operate the simulation.

| Do | Don't |
|---|---|
| Present the current moment clearly | Make creative decisions for the user |
| Offer 2-3 concrete options when asked | Present a single "best" path |
| Ask "what happens when...?" to surface gaps | Skip over undefined behavior |
| Record every decision faithfully | Editorialize or rank the user's choices |
| Flag when mechanics conflict | Resolve conflicts yourself |
| Pause simulation to clarify ambiguity | Assume intent and keep going |

**When the user is stuck:** Ask a narrowing question, don't suggest an answer.
- Good: "The player just died. Do they restart the room, the level, or the whole run?"
- Bad: "I think restarting the room makes the most sense here."

### Turn Structure

Each simulation turn follows this cycle:

```
1. PRESENT MOMENT
   Describe what the player sees, hears, and can do right now.
   Use ASCII wireframe or text description. Be concrete.
   Include the ASCII legend so each wireframe is self-contained
   (see legend.yaml for current symbol conventions).

2. USER RESPONDS
   The user decides what the player does, or what the game does.
   Wait for their input. Do not proceed without it.

3. RECORD DECISION
   Capture any design choice made (explicit or implied).
   See Decision Recording Protocol below.

4. PRESENT NEXT
   Advance the simulation based on their decision.
   Return to step 1.
```

**Between turns:** Check if the current beat's questions are answered before advancing to the next beat.

### Coverage-Driven Pacing

Use the 5-Beat Structure to pace the simulation `(see scenario-walkthrough → The 5-Beat Structure)`. Each beat has a coverage goal — don't advance until it's met.

| Beat | Coverage Goal | Move On When |
|---|---|---|
| **1. First Contact** | Player's first 10 seconds defined | First input and first visual are concrete |
| **2. Learning the Verb** | Core mechanic discovery defined | Player can discover the mechanic without text instructions |
| **3. Core Loop in Motion** | 2-3 full loop cycles narrated | Each cycle feels distinct; reinvestment path is clear |
| **4. Rising Stakes** | First failure and recovery defined | Player understands why they failed |
| **5. Session End** | Replay hook identified | There's a concrete reason to play again |

**Pacing rules:**
- Complete each beat before advancing — incomplete coverage creates false confidence
- Revisit earlier beats if a later decision invalidates them
- The user can skip a beat explicitly, but flag what remains undefined
- Not every simulation needs all 5 beats — scope to what the user needs

### Anti-Patterns

| Anti-Pattern | Symptom | Correction |
|---|---|---|
| **Leading the user** | "The player should probably..." or offering one option as clearly best | Present options neutrally; let the user choose |
| **Losing decisions** | Design choices made during simulation aren't recorded | Record every decision immediately, even small ones |
| **Over-simulation** | Simulating UI polish, particle effects, or menu flow in detail | Stay at mechanics level — "a satisfying effect plays" is enough |
| **Insufficient detail** | "The player does some stuff and wins" | Demand specifics: what input, what feedback, what state change |
| **Runaway scope** | Simulation keeps expanding into new systems and features | Anchor to core loop; use MLP filter on every new element |
| **Skipping failure** | Only simulating the happy path | Explicitly simulate: what if the player fails here? |
| **Answering for the user** | Filling in blanks instead of asking | Every undefined moment is a question, not an assumption |

### Scope Control

Keep the simulation focused on what matters for the current design phase.

**Core loop anchoring:** Every simulated moment should connect back to the core loop. If it doesn't, ask: "Is this part of the core loop, or a feature we're adding?"

**MLP filter:** When the user introduces a new element during simulation, check:
- Does this serve the core loop? `(see scoping → Core Loop Identification)`
- Is this one of the 3 MLP features? `(see scoping → The 3-Feature Rule)`
- If neither: acknowledge it, park it, return to core loop

**Diminishing returns detection:** Signal when simulation is no longer producing new decisions:
- Same mechanic simulated 3+ times with no new choices surfacing
- User responses become "same as before" or "whatever works"
- Beat coverage goals already met

When detected: "We've covered this beat well. Ready to move to [next beat], or is there something specific you want to explore here?"

### Decision Recording Protocol

Capture every design decision made during simulation. These become the design record.

**What to capture:**

| Field | Description | Example |
|---|---|---|
| **id** | Sequential, prefixed with session | `sim-001` |
| **date** | When the decision was made | `2026-02-15` |
| **phase** | Which beat or topic | `Beat 2: Learning the Verb` |
| **category** | Type of decision | `mechanic`, `feedback`, `progression`, `scope`, `content` |
| **origin** | Who drove the decision | `user`, `suggested`, `inferred` |
| **decision** | What was decided | "Jump is triggered by spacebar with 0.15s buffer" |
| **rationale** | Why (from the user's words) | "Wants responsive feel, platformer convention" |
| **alternatives** | What was considered | "Hold-to-charge jump, auto-jump on edge" |

**Origin values:**

| Origin | When to Use | Example |
|---|---|---|
| `user` | The user explicitly stated the decision | "I want spacebar for jump" |
| `suggested` | You proposed it, the user accepted | You offered 3 options, user picked one |
| `inferred` | Extracted from context without explicit confirmation | User's description implied enemies don't respawn |

**Recording rules:**
- Record during the simulation, not after — context decays fast
- Capture the user's reasoning in their words, not your interpretation
- Note rejected alternatives — they inform future decisions
- Flag implicit decisions: "You just decided that enemies don't respawn. Want to confirm that?"
- Tag every decision with its origin — this matters for provenance review
- Group related decisions by beat for easy review

**Rubber-stamp guard:** If 3+ consecutive decisions have origin `suggested`, pause the simulation and prompt the user to drive: "I've been filling in blanks — what do YOU think should happen here?" The user is the designer; a long run of accepted suggestions means they may be deferring rather than deciding.

**Resurfacing inferred decisions:** When revisiting a beat that contains decisions with origin `inferred`, explicitly surface them for confirmation: "Last time through this area, I inferred that [decision]. Is that still what you want, or should we revisit it?" Inferred decisions are provisional until the user confirms them.

**Decision summary format** (output at end of simulation or on request):

```
## Decisions — [Session Name]

### Beat 1: First Contact
- sim-001 [mechanic] [user] Game starts directly in world, no menu
  Rationale: "Get to gameplay immediately"
  Rejected: Title screen, character select

### Beat 2: Learning the Verb
- sim-002 [mechanic] [suggested] Jump triggered by spacebar, 0.15s input buffer
  Rationale: "Responsive feel, platformer convention"
  Rejected: Hold-to-charge, auto-jump on edge
- sim-003 [feedback] [inferred] Jump has squash-stretch animation + whoosh sound
  Rationale: "Needs to feel good from first use"
```

## See Also

- **scenario-walkthrough** — The 5-Beat Structure this simulation follows `(see scenario-walkthrough → The 5-Beat Structure)`
- **scoping** — MLP filter and core loop anchoring for scope control `(see scoping → MLP Scoping Process)`
- **design-frameworks** — Core loop theory and game feel principles `(see design-frameworks → Core Loop Design)`
- **antipatterns** — Design in Isolation is the anti-pattern that simulation prevents `(see antipatterns)`
- **playtesting** — Simulation as pre-playtest validation `(see playtesting → The 3-Question Framework)`
- **mechanics-palette** — Browse mechanics during simulation brainstorming `(see mechanics-palette)`
- **ascii-wireframing** — ASCII wireframe toolkit used during simulation turns `(see ascii-wireframing)`
