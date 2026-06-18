---
description: Generate a design brief (or full GDD + tech spec) from simulation data
argument-hint: [--full]
allowed-tools: Read, Write, Glob, Grep, AskUserQuestion, Skill
---

## Summary

**Output generation — transform simulation data into actionable design documents.** Part of the session lifecycle: start → brainstorm → simulate → **build-plan**.

**Arguments:** `$ARGUMENTS` (optional)
- Default: generate a concise **design brief** (~80 lines) — core loop, MLP features, key decisions, technical constraints, first vertical slice
- `--full`: generate the complete **GDD + tech spec** (monolithic documents with full detail)

**Output:** `design-brief.md` (default) or `gdd.md` + `tech-spec.md` (with `--full`) in `.game-design/<slug>/output/`, updated `state.yaml`.

**CRITICAL:** Populate documents from session data only. Flag gaps with placeholders rather than inventing content the simulation did not explore.

---

## Process

### Step 1: Validate Session Readiness

Find the active session and confirm it's in the right phase.

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

**If the session phase is not `build-plan`:**

```
PHASE MISMATCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<title>" is in the <phase> phase, not build-plan.

To continue this session: /game:<phase>
To start a new session: /game:start
```

**Stop here.**

**Check coverage meets minimum criteria:**

```
Read(file_path=".game-design/<slug>/simulation/coverage.yaml")
```

Check the `transition.minimum` criteria: all beats must have confidence at or above `transition.minimum.beats_threshold` (default `0.3`, i.e. at least `partial`).

**If minimum coverage is NOT met:**

Identify which beats are below threshold and warn the user:

```
COVERAGE WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<title>" has insufficient simulation coverage.

Beats below minimum:
  ○ <beat name>: uncovered (confidence <value>)
  ○ <beat name>: uncovered (confidence <value>)

The generated plan will have gaps in these areas. Sections based on
uncovered beats will contain placeholders instead of design decisions.
```

```
AskUserQuestion(questions=[{
  question: "Continue generating the plan with gaps, or return to simulation?",
  header: "Coverage",
  options: [
    {label: "Continue anyway", description: "Generate plan with placeholders for uncovered areas"},
    {label: "Return to simulation", description: "Go back and cover more beats first (/game:simulate)"}
  ],
  multiSelect: false
}])
```

**If "Return to simulation":**

Revert the phase in both files:

```
Read(file_path=".game-design/<slug>/state.yaml")
```

Update `phase` to `simulate` and `updated` to today's date. Write back:

```
Write(file_path=".game-design/<slug>/state.yaml", content=<updated state>)
```

```
Read(file_path=".game-design/sessions.yaml")
```

Update the matching entry's `phase` to `simulate` and `updated` to today's date. Write back:

```
Write(file_path=".game-design/sessions.yaml", content=<updated index>)
```

Then chain to simulate:

```
Skill(skill="game:simulate")
```

**Stop here** — simulate takes over.

**If "Continue anyway":** Proceed to Step 2.

**If minimum coverage IS met:** Proceed to Step 2 silently.

### Step 2: Load All Session Data

Load all session data in parallel:

```
Read(file_path=".game-design/<slug>/concept.yaml")
Read(file_path=".game-design/<slug>/decisions.log")
Read(file_path=".game-design/<slug>/brainstorm.md")
Read(file_path=".game-design/<slug>/simulation/coverage.yaml")
Read(file_path=".game-design/<slug>/simulation/legend.yaml")
Read(file_path=".game-design/<slug>/simulation/game-state.yaml")
```

```
Glob(pattern=".game-design/<slug>/simulation/turns/turn-*.md")
Glob(pattern=".game-design/<slug>/simulation/wireframes/wf-*.txt")
```

For each file returned by the Glob calls above, read it:

```
Read(file_path=<each turn file path>)
Read(file_path=<each wireframe file path>)
```

Load the templates:

```
Read(file_path=".claude/game-spice/templates/gdd.md")
Read(file_path=".claude/game-spice/templates/tech-spec.md")
```

Load skill references for enrichment:

```
Read(file_path=".claude/skills/scoping/SKILL.md")
Read(file_path=".claude/skills/plan-audit/SKILL.md")
```

Display loading status:

```
BUILD PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session: <title>
Genre: <concept.genre> (<concept.subgenre>)
Core loop: <concept.core_loop>

Data loaded:
  Turns: <count>
  Wireframes: <count>
  Decisions: <count> (<user>/<suggested>/<inferred>)
  Coverage: <beats_covered>/<beats_total> beats covered

Generating plan...
```

**If `$ARGUMENTS` does NOT contain `--full`:** Skip to Step 3B (Design Brief).

**If `$ARGUMENTS` contains `--full`:** Continue to Step 3 (Full GDD).

### Step 3: Generate GDD (--full only)

Populate the GDD template (`.claude/game-spice/templates/gdd.md`) using session data. Each GDD section maps to specific session artifacts:

| GDD Section | Primary Source |
|-------------|---------------|
| Design Pillars | `concept.yaml` aesthetics + `decisions.log` recurring themes |
| Success Criteria | Core loop validation + simulation decisions on "done" |
| Game Overview | `concept.yaml` (pitch, platform, core_loop) |
| Mechanics | `decisions.log` mechanic category + `concept.yaml` mechanics |
| Game World | Simulation turns + wireframes |
| UI/UX | Wireframe files + `legend.yaml` + input decisions |
| Economy & Progression | Only if simulation decisions touch these topics; omit otherwise |
| Content Requirements | Coverage data + content-planning production ratios |
| Appendix | Decision log summary, coverage report, wireframe index |

For Mechanics: list core mechanics (essential to loop), up to 3 MLP amplifiers `(see scoping → The 3-Feature Rule)`, and deferred mechanics with reasons.

### Step 4: Assumptions to Validate

Scan `decisions.log` for all decisions with origin `suggested` or `inferred`. Collect them into a dedicated GDD section.

Insert this section after the main content sections and before the Appendix:

```markdown
## Assumptions to Validate

<!-- Decisions made by the AI (suggested or inferred) during brainstorm and simulation.
     These should be validated during playtesting — the designer did not explicitly confirm them. -->

**<count> assumptions flagged** (<suggested_count> suggested, <inferred_count> inferred)

### High Priority (Mechanic Assumptions)

<!-- Assumptions about how game systems work — incorrect assumptions here break gameplay -->

| ID | Decision | Origin | Source Turn |
|----|----------|--------|-------------|
| <id> | <decision> | <origin> | Turn <NNN> |

### Medium Priority (Feedback & Progression)

<!-- Assumptions about what the player sees/feels — wrong assumptions hurt experience -->

| ID | Decision | Origin | Source Turn |
|----|----------|--------|-------------|
| <id> | <decision> | <origin> | Turn <NNN> |

### Low Priority (Content & Scope)

<!-- Assumptions about content details — easy to change later -->

| ID | Decision | Origin | Source Turn |
|----|----------|--------|-------------|
| <id> | <decision> | <origin> | Turn <NNN> |
```

**Priority mapping:**
- High: decisions with category `mechanic`
- Medium: decisions with category `feedback` or `progression`
- Low: decisions with category `content` or `scope`

**Source Turn attribution:** For simulation-phase decisions (id format `sim-NNN`), cross-reference with turn files to find which turn recorded the decision. For brainstorm-phase decisions (numeric id), show "Brainstorm" in the Source Turn column instead of a turn number.

If a priority level has zero assumptions, omit that subsection.

### Step 3B: Generate Design Brief (default)

```
Read(file_path=".claude/game-spice/templates/design-brief.md")
```

Populate the design brief template using session data. The brief is concise (~80 lines) and focuses on what's needed to start building:

- **Core Loop**: one-sentence format from concept.yaml
- **MLP Features**: 3 max, each with one-line description and why it amplifies the loop
- **Key Decisions**: 5-10 most impactful decisions (mechanic > feedback > progression > content)
- **Technical Constraints**: engine, platform, input, team size
- **First Vertical Slice**: the tracer bullet — first thing to build
- **Assumptions to Validate**: high-priority AI-proposed decisions only
- **Deferred**: ideas parked for post-MLP with reasons

```
Write(file_path=".game-design/<slug>/output/design-brief.md", content=<populated brief>)
```

Skip to Step 6 (Quality Review).

### Step 5: Generate Tech Spec (--full only)

Populate the tech spec template (`.claude/game-spice/templates/tech-spec.md`) using GDD output and simulation data:

| Tech Spec Section | Source |
|-------------------|--------|
| Architecture Overview | `concept.yaml` engine + module decomposition from GDD mechanics |
| Implementation Phases | Tracer bullet → Core Loop (MLP) → Content Alpha → Systems & Polish `(see scoping → Post-MLP Iteration Phases)` |
| Per-Phase Tasks | Vertical slices (player-facing outcomes), not horizontal systems. Each task: "Player [verb]s..." |
| Technical Decisions | Simulation decisions + engine constraints (rendering, state management, input, audio, saves) |
| Risk Register | Brainstorm open questions + coverage gaps + Assumptions to Validate |

### Step 6: Quality Review

Run the plan-audit checks against the generated documents `(see plan-audit → Game Plan Completeness Scorecard)`:

1. **Plan Completeness Scorecard** (10 checks, target ≥7/10)
2. **Core Loop Validation Tests** (Sentence, Verb Chain, Reinvestment, 30-Second)
3. **GDD Actionability Test** (7 checks scored 1-5, target ≥28/35)

**Interpretation:**
- Completeness ≥7 AND Actionability ≥28 = READY TO BUILD
- Completeness ≥7 AND Actionability 20-27 = MINOR GAPS (note as advisory)
- Completeness <7 OR Actionability <20 = NEEDS WORK (note specific gaps)

Present results with ✓/✗ per check and overall assessment.

### Step 7: Write Outputs

**Default mode:** Brief was already written in Step 3B.

**--full mode:** Write the generated documents:

```
Write(file_path=".game-design/<slug>/output/gdd.md", content=<populated GDD>)
Write(file_path=".game-design/<slug>/output/tech-spec.md", content=<populated tech spec>)
```

### Step 8: Update State

Update `state.yaml` to mark the session as complete:

```
Read(file_path=".game-design/<slug>/state.yaml")
```

Update:
- `phase`: `complete`
- `updated`: today's date
- `flags.plan_ready`: `true`

```
Write(file_path=".game-design/<slug>/state.yaml", content=<updated state>)
```

Update the sessions index:

```
Read(file_path=".game-design/sessions.yaml")
```

Update the matching entry:
- `phase`: `complete`
- `updated`: today's date

```
Write(file_path=".game-design/sessions.yaml", content=<updated index>)
```

### Step 9: Present Summary

Present the build plan completion summary:

```
BUILD PLAN COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session: <title>
Phase: complete ✓

Files written:
  .game-design/<slug>/output/<design-brief.md or gdd.md + tech-spec.md>
  .game-design/<slug>/state.yaml (updated)
  .game-design/sessions.yaml (updated)

Quality Review:
  Plan Completeness: <score>/10
  Core Loop Validation: <pass/fail>/4
  GDD Actionability: <score>/35
  Overall: <READY TO BUILD / MINOR GAPS / NEEDS WORK>

Assumptions to validate: <count>
  <mechanic_count> mechanic (high priority)
  <feedback_count> feedback/progression (medium priority)
  <content_count> content/scope (low priority)
```

```
AskUserQuestion(questions=[{
  question: "What would you like to do next?",
  header: "Next step",
  options: [
    {label: "Review output", description: "Read through the generated design document(s)"},
    {label: "Review assumptions", description: "Look at the assumptions that need playtesting"},
    {label: "Done", description: "Session complete — start building!"}
  ],
  multiSelect: false
}])
```

**If "Review output":** Read and display the generated document(s). For default mode, show the design brief. For `--full`, show GDD then tech spec. Re-present the menu.

**If "Review assumptions":** Display assumptions from the output. Re-present the menu.

**If "Done":**
```
Session complete. Your design documents are in .game-design/<slug>/output/
Start building with the tracer bullet!
```

**Stop here.**

## Error Handling

**If concept.yaml is missing or incomplete:**

```
CONCEPT INCOMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<title>" is missing concept data needed for plan generation.

Missing: <list missing required fields>

The brainstorm phase may not have completed fully.

Options:
  1. Return to brainstorm: /game:brainstorm
  2. Continue anyway (plan will have gaps)
```

**If decisions.log is missing or empty (header only):**

```
NO DECISIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<title>" has no design decisions recorded.

The simulation phase may not have completed or no decisions were logged.

Options:
  1. Return to simulation: /game:simulate
  2. Continue anyway (plan will be mostly placeholders)
```

**If templates are missing:**

```
TEMPLATE ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing: .claude/game-spice/templates/gdd.md or .claude/game-spice/templates/tech-spec.md
The game-spice plugin may not be fully installed.

Run: Check that the game-spice plugin is installed in your project.
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

## Example Usage

```
/game:build-plan          # Generate concise design brief (default)
/game:build-plan --full   # Generate full GDD + tech spec
```

This command is typically chained from `/game:simulate` and produces the final outputs of the game design workflow.
