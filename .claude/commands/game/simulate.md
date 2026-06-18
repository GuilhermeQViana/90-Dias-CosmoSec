---
description: Run an interactive Wizard of Oz gameplay simulation with ASCII wireframes
argument-hint:
allowed-tools: Read, Write, Glob, Grep, AskUserQuestion, Skill
---

## Summary

**Interactive gameplay simulation — prove the core loop works before building.** Part of the session lifecycle: start → brainstorm → **simulate** → build-plan.

**Arguments:** None (operates on the active session from `/game:start`)

**Output:** Simulation turn files, wireframe files, updated `decisions.log`, updated `state.yaml`.

**CRITICAL:** You are the game engine, not the game designer. Present moments, ask questions, record decisions. The user makes every creative choice.

---

## Process

### Step 1: Load Session State

Find the active session. This command is chained from `/game:brainstorm`, so an active session should exist.

```
Glob(pattern=".game-design/sessions.yaml")
```

**If `.game-design/sessions.yaml` does not exist:**

```
NO ACTIVE SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No game design sessions found. Start one first.

Run: /game:start
```

**Stop here.**

**If `.game-design/sessions.yaml` exists:**

```
Read(file_path=".game-design/sessions.yaml")
```

Select the most recently updated session. Load its state:

```
Read(file_path=".game-design/<slug>/state.yaml")
```

**If the session phase is not `simulate`:**

```
PHASE MISMATCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<title>" is in the <phase> phase, not simulate.

To continue this session: /game:<phase>
To start a new session: /game:start
```

**Stop here.**

**Load all simulation context in parallel:**

```
Read(file_path=".game-design/<slug>/concept.yaml")
Read(file_path=".game-design/<slug>/decisions.log")
```

```
Glob(pattern=".game-design/<slug>/simulation/game-state.yaml")
Glob(pattern=".game-design/<slug>/simulation/legend.yaml")
Glob(pattern=".game-design/<slug>/simulation/coverage.yaml")
Glob(pattern=".game-design/<slug>/simulation/turns/turn-*.md")
```

Load whichever files exist. Missing files are normal on first run.

**Load last 3 turns** (if any turn files exist):

Sort the turn files by name (they are numbered sequentially). Read the last 3:

```
Read(file_path=".game-design/<slug>/simulation/turns/turn-<N-2>.md")
Read(file_path=".game-design/<slug>/simulation/turns/turn-<N-1>.md")
Read(file_path=".game-design/<slug>/simulation/turns/turn-<N>.md")
```

This provides continuity context for the next turn.

**Load skill references:**

```
Read(file_path=".claude/skills/ascii-wireframing/SKILL.md")
Read(file_path=".claude/skills/simulation-guide/SKILL.md")
Read(file_path=".claude/skills/scenario-walkthrough/SKILL.md")
```

These provide facilitation stance, wireframe conventions, and beat structure.

### Step 2: Determine Simulation State

Check what exists to determine whether this is a fresh start or a continuation.

**If no turn files exist (first run):**

Initialize the simulation directory structure and display the opening:

```
SIMULATION START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session: <title>
Genre: <concept.genre> (<concept.subgenre>)
Core loop: <concept.core_loop>

Starting Wizard of Oz simulation. You are the game designer —
I'll simulate the game, you make every creative decision.

We'll walk through the 5-Beat Structure:
  1. First Contact — the player's first 10 seconds
  2. Learning the Verb — discovering the core mechanic
  3. Core Loop in Motion — full gameplay cycles
  4. Rising Stakes — challenge and failure
  5. Session End — the replay hook

Let's begin with First Contact.
```

Initialize simulation files:

```
Write(file_path=".game-design/<slug>/simulation/game-state.yaml", content=<initial state: turn 0, beat "first_contact", empty player/world/elements>)
Write(file_path=".game-design/<slug>/simulation/legend.yaml", content=<seed with genre-appropriate symbols from ascii-wireframing skill>)
```

```
Read(file_path=".claude/game-spice/templates/coverage.yaml")
Write(file_path=".game-design/<slug>/simulation/coverage.yaml", content=<coverage template>)
```

Keep the legend minimal — it grows organically during simulation. Seed from genre conventions (e.g., roguelike: `@ # .`, platformer: `@ = # ^ *`).

**If turn files exist (continuing):**

```
SIMULATION RESUME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session: <title>
Turn: <turn_count> completed
Beat: <current beat from game-state.yaml>
Coverage: <beats_covered>/<beats_total> beats

Last turn summary:
  Beat: <last turn's beat>
  Focus: <last turn's focus>
  Decisions: <count from last turn>

Continuing from where we left off.
```

Proceed to Step 3 with existing state.

### Step 3: Select Next Beat and Focus

Determine what to simulate next using coverage-driven pacing from the simulation-guide.

The `coverage` section in state.yaml tracks each beat's status: `uncovered`, `partial`, or `covered`.

**Beat selection rules:**

1. Find the first beat with status `uncovered` — start there
2. If all beats are at least `partial`, find the first `partial` beat — continue there
3. If all beats are `covered`, simulation is complete (go to Step 9)

**Beat-to-focus mapping:**

| Beat | Focus Area | Coverage Goal |
|---|---|---|
| `first_contact` | Player's first 10 seconds | First input and first visual are concrete |
| `learning_the_verb` | Core mechanic discovery | Player can discover the mechanic without text instructions |
| `core_loop_in_motion` | 2-3 full loop cycles | Each cycle feels distinct; reinvestment path is clear |
| `rising_stakes` | First failure and recovery | Player understands why they failed |
| `session_end` | Replay hook | There's a concrete reason to play again |

**Choose a specific focus within the beat** based on:
- What hasn't been explored yet in this beat
- What decisions from previous turns need follow-up
- What the concept.yaml implies needs defining

### Step 4: Generate Turn Content

Each turn follows the simulation-guide Turn Structure. Read the simulation-turn template:

```
Read(file_path=".claude/game-spice/templates/simulation-turn.md")
```

**4a: Generate the ASCII wireframe**

Based on the current beat, focus, and game state, create an ASCII wireframe showing what the player sees at this moment.

**Wireframe rules:**
- Use symbols from `legend.yaml` — propose new symbols when new game elements appear
- Include an inline legend so each wireframe is self-contained
- Follow sizing guidelines from ascii-wireframing skill (30-60 chars wide for screens)
- Match the genre conventions (top-down for RPG, side-view for platformers, etc.)
- Show the specific moment, not a generic screen

**When new game elements appear:**

If the turn introduces a game element not in `legend.yaml`, propose a new symbol:

```
New element: <element name>
Proposed symbol: <symbol> (because <reasoning>)
```

Include this in the questions (Step 5) so the user can accept or override.

**4b: Write the narrative**

Describe the current moment concretely:
- What the player just did (or: "this is the start of the session")
- What is on screen and why
- What the player can do next

Be specific. Describe actions and feedback, not feelings.

**4c: Formulate questions**

Ask 2-4 specific, concrete questions about how the game should behave in this moment. These drive design decisions.

**Good questions** — about undefined behavior:
- "The player just walked off the edge — do they fall, grab the ledge, or is there an invisible wall?"
- "The enemy is defeated — does it drop loot immediately, or does the player have to search the body?"

**Bad questions** — about preferences or feelings:
- "How do you want the game to feel?"
- "What's the mood of this area?"

**Question categories:**
- `mechanic` — how a game system works
- `feedback` — what the player sees/hears in response to an action
- `progression` — how the game state advances
- `scope` — whether something is in or out of the MLP
- `content` — specific game content (enemies, items, areas)

### Step 5: Present the Turn

Present the complete turn to the user using AskUserQuestion for their response:

```
## Turn <NNN> — <Beat Name>
**Focus:** <what this turn explores>

### What the Player Sees

<ASCII wireframe with inline legend>

### What Is Happening

<narrative description>

### Questions

1. <question>
2. <question>
3. <question> (if applicable)
```

```
AskUserQuestion(questions=[{
  question: "<Primary question from the turn — the most important design decision this moment surfaces>",
  header: "Turn <NNN>",
  options: [
    {label: "<option A>", description: "<concrete description of what happens>"},
    {label: "<option B>", description: "<concrete description of what happens>"},
    {label: "<option C>", description: "<concrete description of what happens>"}
  ],
  multiSelect: false
}])
```

**If there are additional questions**, present them as follow-up:

```
AskUserQuestion(questions=[{
  question: "<Next question>",
  header: "Detail",
  options: [
    {label: "<option A>", description: "<description>"},
    {label: "<option B>", description: "<description>"}
  ],
  multiSelect: false
}])
```

**Wait for each response before proceeding.** Do not advance the simulation without user input.

### Step 6: Record Response and Decisions

After the user responds to all questions for the turn:

**6a: Identify decisions**

Extract every design decision from the user's responses. Each decision gets:

| Field | Source |
|---|---|
| `id` | Sequential: `sim-NNN` (continues from last decision in decisions.log) |
| `date` | Today's date |
| `phase` | Current beat name (e.g., "Beat 1: First Contact") |
| `category` | `mechanic`, `feedback`, `progression`, `scope`, or `content` |
| `origin` | See provenance rules below |
| `decision` | What was decided |
| `rationale` | The user's reasoning, in their words |
| `alternatives` | Options that were presented but not chosen |

**6b: Apply decision provenance**

Tag every decision with its origin:

| Origin | When to Use | Example |
|---|---|---|
| `user` | The user explicitly stated the decision | User chose option A and added detail |
| `suggested` | You proposed options, user accepted one without elaboration | User picked an option with no modification |
| `inferred` | Extracted from user's response without explicit confirmation | User's description implied enemies don't respawn |

**6c: Rubber-stamp guard**

Count consecutive decisions with origin `suggested`. Track this as a running counter across turns.

**If 3 or more consecutive decisions are `suggested`:**

Pause the simulation and prompt the user to drive:

```
I've been filling in blanks — what do YOU think should happen here?

The last few decisions were all from options I suggested. I want to make sure
the game reflects YOUR vision, not my defaults.

What's the most important thing about this moment to you?
```

Reset the consecutive counter after the user provides a substantive response.

**6d: Resurface inferred decisions**

When a turn revisits a beat or area that contains decisions with origin `inferred`, surface them for confirmation before proceeding:

```
Last time we covered this area, I inferred these decisions:

- <decision> (from turn <N>)
- <decision> (from turn <N>)

Are these still what you want, or should we revisit any of them?
```

If the user confirms, change the origin to `user`. If they revise, record the revision as a new decision and mark the old one as superseded.

**6e: Append to decisions.log**

```
Read(file_path=".game-design/<slug>/decisions.log")
```

Append one row per decision in the format: `id|date|phase|category|origin|decision|rationale|alternatives`

```
Write(file_path=".game-design/<slug>/decisions.log", content=<updated log>)
```

### Step 7: Update State Files

After recording decisions, update all state files. Write using the template structures from `.claude/game-spice/templates/simulation-turn.md`.

**7a: Write turn file and wireframe**

```
Write(file_path=".game-design/<slug>/simulation/turns/turn-<NNN>.md", content=<populated turn template>)
Write(file_path=".game-design/<slug>/simulation/wireframes/wf-<NNN>-<description>.txt", content=<wireframe with legend>)
```

`<NNN>` is zero-padded to 3 digits. `<description>` is a short kebab-case label (e.g., `first-screen`, `combat-encounter`).

**7b: Update legend and game-state**

If new symbols were introduced, append to `legend.yaml`. Update `game-state.yaml`: increment turn, update beat, player state, world state, and elements.

**7c: Update coverage**

Read `coverage.yaml`. For each beat explored this turn:
- Add turn to the beat's `turns` list
- Recalculate confidence: `+0.2` per turn, `+0.1` per `user` decision, `+0.05` per `suggested`. Cap at `1.0`
- Derive status: `<0.3` = uncovered, `0.3–0.69` = partial, `≥0.7` = covered

Apply same logic to system coverage (base `+0.15` per turn, `+0.1` per decision).

**Transition criteria:** Minimum = all beats `≥0.3`. Recommended = all beats `≥0.7` and all systems `≥0.3`.

**7d: Update state.yaml**

Sync `progress.turn_count`, `progress.beats_covered`, `coverage.<beat>`, `decisions.*` counts, and `updated` date.

### Step 8: Multi-Turn Flow

After updating state, determine the next action.

**Check for diminishing returns:**

Signal diminishing returns if:
- The same beat has been simulated 3+ turns with no new decisions surfacing
- The user's responses are becoming repetitive ("same as before", "whatever works")
- The beat's coverage goals are already met

If diminishing returns detected:

```
We've covered this beat well — <count> turns, <decision count> decisions.
Ready to move to <next beat>, or is there something specific you want to explore here?
```

**Check for sufficient overall coverage:**

If all 5 beats are at `covered` status:

```
AskUserQuestion(questions=[{
  question: "All 5 beats are covered. The simulation has explored the full player experience arc. What would you like to do?",
  header: "Coverage",
  options: [
    {label: "End simulation", description: "Wrap up and generate simulation summary"},
    {label: "Revisit a beat", description: "Go back to explore something further"},
    {label: "Free-form explore", description: "Simulate a specific scenario not covered by the 5 beats"}
  ],
  multiSelect: false
}])
```

If "End simulation": proceed to Step 9.
If "Revisit a beat" or "Free-form explore": continue the turn loop with the user's chosen focus.

**Normal continuation:**

```
AskUserQuestion(questions=[{
  question: "Continue simulating? Next up: <next beat or focus area>.",
  header: "Continue",
  options: [
    {label: "Continue", description: "Proceed to <next focus>"},
    {label: "Explore something else", description: "Choose a different area to simulate"},
    {label: "End simulation", description: "Wrap up with current coverage"}
  ],
  multiSelect: false
}])
```

If "Continue": loop back to Step 3.
If "Explore something else": ask what they want to explore, then loop to Step 4 with that focus.
If "End simulation": proceed to Step 9.

### Step 9: Simulation Complete

When the user ends the simulation (either through full coverage or explicit request):

**9a: Generate simulation summary**

Count and summarize all decisions:

```
Read(file_path=".game-design/<slug>/decisions.log")
```

**9b: Update state for build-plan phase**

Update `state.yaml`: set `phase` to `build-plan`, `flags.plan_ready` to `true`, `updated` to today.
Update `sessions.yaml`: set matching entry's `phase` to `build-plan` and `updated` to today.

**9c: Present completion summary**

```
SIMULATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session: <title>
Turns: <turn_count>
Decisions: <total> logged (<user>/<suggested>/<inferred>)

Coverage:
  ✓ First Contact: covered
  ✓ Learning the Verb: covered
  ◐ Core Loop in Motion: partial    (or ✓ if covered)
  ○ Rising Stakes: uncovered        (or ✓/◐)
  ○ Session End: uncovered          (or ✓/◐)

Files written:
  .game-design/<slug>/simulation/turns/       (<count> turn files)
  .game-design/<slug>/simulation/wireframes/  (<count> wireframe files)
  .game-design/<slug>/simulation/game-state.yaml
  .game-design/<slug>/simulation/legend.yaml
  .game-design/<slug>/simulation/coverage.yaml
  .game-design/<slug>/decisions.log           (<total> entries)
  .game-design/<slug>/state.yaml              (updated)
  .game-design/sessions.yaml                  (updated)

Key decisions:
  <list 3-5 most significant decisions by impact>
```

```
AskUserQuestion(questions=[{
  question: "What would you like to do next?",
  header: "Next step",
  options: [
    {label: "Build plan", description: "Generate implementation plan from simulation (/game:build-plan)"},
    {label: "Review decisions", description: "Review the full decisions log before continuing"},
    {label: "More simulation", description: "Return to simulation to explore further"},
    {label: "Done for now", description: "Save progress and come back later"}
  ],
  multiSelect: false
}])
```

**If "Build plan":**
```
Skill(skill="game:build-plan")
```
**Stop here** — build-plan takes over.

**If "Review decisions":**
```
Read(file_path=".game-design/<slug>/decisions.log")
```
Display the decisions grouped by beat and wait for user to decide next step.

**If "More simulation":**
Revert the phase change in both state.yaml and sessions.yaml back to `simulate`, then loop back to Step 3.

**If "Done for now":**
```
Session saved. Resume any time with /game:start.
```
**Stop here.**

## Error Handling

**If concept.yaml is missing or incomplete:**

```
CONCEPT INCOMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<title>" is missing concept data needed for simulation.

Missing: <list missing required fields>

The brainstorm phase may not have completed fully.

Options:
  1. Return to brainstorm: /game:brainstorm
  2. Continue anyway (simulation will have less context)
```

**If state.yaml is corrupted:**

```
SESSION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<slug>" has a corrupted state file.
Missing fields: <list>

Options:
  1. Re-initialize: /game:start
  2. Continue anyway (may produce incomplete outputs)
```

**If decisions.log is missing:**

Recreate it with the header row and continue. Log a warning but don't block.

```
Write(file_path=".game-design/<slug>/decisions.log", content="id|date|phase|category|origin|decision|rationale|alternatives\n")
```

**If templates are missing:**

```
TEMPLATE ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing: .claude/game-spice/templates/simulation-turn.md
The game-spice plugin may not be fully installed.

Run: Check that the game-spice plugin is installed in your project.
```

## Example Usage

```
/game:simulate        # Continue simulation for the active session
```

This command is typically chained from `/game:brainstorm` and chains to `/game:build-plan` on completion.
