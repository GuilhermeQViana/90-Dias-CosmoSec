# Detailed Audits

## MLP Scope Audit

### Scope Complexity Scoring Matrix

| Factor | 1 (Low) | 2 (Medium) | 3 (High) |
|--------|---------|------------|----------|
| System count | ≤3 systems | 4-6 | 7+ |
| Content volume | 1 level, 2-3 enemies | 3-5 levels, 5-10 enemies | 10+ levels |
| Multiplayer | None | Local co-op | Online |
| Procgen | None | Simple (rooms) | Complex (terrain, narrative) |
| Narrative | Minimal/emergent | Linear story | Branching |
| Platforms | 1 platform | 2 | 3+ |
| Art style | Programmer art / pixel | Stylized | Realistic |
| Audio | Minimal SFX | Music + SFX | Voice acting |
| Save complexity | None/auto | Manual saves | Cloud + cross-platform |
| AI opponents | None / scripted | Basic FSM | Planning / learning |

**Score 10-15:** Solo-dev feasible. **16-22:** Small team. **23-30:** Reconsider scope.

### Genre-Specific Scope Traps

| Genre | Common Trap | Why It Kills Scope |
|-------|-------------|-------------------|
| **RPG** | Branching dialogue, open worlds, item combinatorics | Content grows exponentially with choices |
| **Roguelike** | "One more system" syndrome, procgen complexity | Each system multiplies interaction surface |
| **Platformer** | Level count ambition ("just 50 more levels") | Each level needs design, testing, polish |
| **Strategy** | AI opponents, complex UI | AI is its own project; UI is 50% of work |
| **Narrative** | Voice acting, branching consequences | Every branch doubles content cost |

## Economy/Balance Design Audit

Using Daniel Cook's Value Chains methodology. Every resource must have:

| Element | Question |
|---------|----------|
| **Source** | Where does the resource come from? |
| **Sink** | Where does it leave the system? |
| **Flow Rate** | How fast does it accumulate? |
| **Lifetime** | How long does a unit last before being spent? |
| **Player Decision** | What choice does the player make with it? |
| **Interconnection** | How does it connect to other resources? |

**10 Economy Red Flags:**

1. **No Sinks** — Resources accumulate forever, economy inflates
2. **Infinite Accumulation** — No cap or diminishing returns
3. **Dead-End Resources** — Resource has nowhere useful to go
4. **Obvious Spending** — No real decision, one clearly best option
5. **Unconnected Systems** — Resources exist in isolation
6. **Unchecked Positive Feedback** — Rich get richer with no catch-up
7. **Currency Without Choice** — Only one thing to buy
8. **Single Optimal Path** — Spreadsheet-solvable economy
9. **Invisible Economy** — Player can't see resource flows
10. **Complexity Mismatch** — Economy sophistication doesn't match genre (platformer with stock market)

## Difficulty Curve Assessment

### Curve Shapes

| Shape | Description | Best For |
|-------|-------------|----------|
| **Staircase** (recommended) | Alternating challenge and rest | Most games — allows mastery consolidation |
| **Ramp** | Linear increase | Short experiences, arcade |
| **Wave** | Oscillating intensity | Story-driven, pacing-focused |
| **Cliff** (antipattern) | Sudden unwarned spike | Never — causes ragequits |
| **Plateau** (antipattern) | Stops escalating | Never — causes boredom |

### Difficulty Antipatterns

| Antipattern | Description |
|-------------|-------------|
| **Fake Difficulty** | Challenge from bad controls/camera, not game design |
| **Number Inflation** | Enemies just get more HP, no new behaviors |
| **Cliff Difficulty** | Sudden spike with no warning or ramp |
| **Gotcha Difficulty** | Must die to learn (trial-and-error as core design) |
| **Grind Gates** | Progress blocked by repetition, not skill |

### Skill Floor/Ceiling Matrix

| | Low Ceiling | High Ceiling |
|---|---|---|
| **Low Floor** | Casual (mobile puzzle) | Accessible depth (Smash Bros) |
| **High Floor** | Frustrating (avoid) | Hardcore niche (fighting games) |

Match your audience: broad appeal needs low floor. Depth needs high ceiling. Both = best.

## Playtest Readiness Audit

Before building, verify the plan includes:

- [ ] Testers named (3+ specific people)
- [ ] First playtest date scheduled
- [ ] Test questions defined (what this playtest answers)
- [ ] Observation method chosen (watch, record, notes)
- [ ] Pivot criteria defined ("If X happens, we change Y")
- [ ] Questionnaire selected for structured feedback

`(see plan-audit/questionnaires.md for validated frameworks and templates)`

## Data Strategy Audit

Before building, verify the plan accounts for:

- [ ] Telemetry events defined (what to measure)
- [ ] Collection method chosen (manual, CSV, SDK)
- [ ] Analysis approach planned (qualitative, quantitative, or both)
- [ ] Before/after measurement defined for changes

`(see plan-audit → What to Measure)`
