---
name: antipatterns
description: Common game planning mistakes and how to avoid them. Use when reviewing game plans, checking for scope creep in game projects, evaluating game feature lists, or auditing game design decisions. Covers scope creep, feature bloat, design traps, over-scoping, kitchen sink design.
---

# Game Planning Anti-Patterns

Common mistakes in game planning and how to avoid them.

## Quick Reference

### Top 10 Anti-Patterns

| # | Anti-Pattern | Symptom | Better Approach |
|---|---|---|---|
| 1 | Everything Sounds Fun | Feature list grows every session | 3-feature MLP rule, parking lot for ideas |
| 2 | Feature Creep | "Small" additions that compound | Each addition goes through cutting heuristics |
| 3 | Scope Creep | Requirements shift mid-build | Freeze scope after planning, track changes explicitly |
| 4 | Premature Content | Building levels before fun is proven | Prove core loop with 1 level, then expand |
| 5 | Design in Isolation | Mechanics designed without playtesting | Paper prototype → digital prototype → playtest loop |
| 6 | Juice Addiction | Polish before fun | Remove all juice — is it still fun? |
| 7 | Kitchen Sink Design | Game tries to do everything | Pick 1-2 target aesthetics, cut the rest |
| 8 | Core Loop Neglect | Building features around a weak loop | If core loop isn't fun in 5 min, fix it first |
| 9 | Second System Effect | Overdesigning based on past project | Scope to current project's needs, not past regrets |
| 10 | GDD Tome | 50+ page design document | Living doc, max 5 pages for MLP scope |

## Decision Tables

### Should I Add This Feature?

Answer each question. If you get any "No" answers, strongly consider cutting.

| Question | Yes | No |
|----------|-----|-----|
| Does it directly serve the core loop? | Keep evaluating | Cut |
| Can the MLP be fun without it? | Defer to post-MLP | Keep evaluating |
| Can it be built in <1 day? | Keep evaluating | Cut from MLP |
| Have playtesters asked for it? | Keep evaluating | Cut |
| Does it require a new system? | Cut from MLP | Keep evaluating |
| Are you adding it because competitors have it? | Cut | Keep evaluating |

**If you reach the bottom with all "Keep evaluating":** The feature is a strong candidate. Add it to MLP only if you're under the 3-feature limit.

### Is My Plan Over-Scoped?

| Signal | Score |
|--------|-------|
| More than 3 features beyond core loop | +2 |
| Any feature described as "simple" without a prototype | +1 |
| Plan mentions more than 2 enemy/item/level types | +1 |
| Multiplayer is included (and isn't the core loop) | +3 |
| Plan requires procedural generation | +2 |
| Total estimated dev time > 4 weeks for solo dev | +2 |
| Plan includes a progression system AND content | +1 |
| Design document is more than 3 pages | +1 |
| You can't describe the game in one sentence | +2 |

| Total Score | Assessment |
|-------------|-----------|
| 0-2 | Scope looks reasonable |
| 3-5 | Over-scoped — cut 30% |
| 6-8 | Significantly over-scoped — cut 50% |
| 9+ | Start over with just the core loop |

## Checklists

### Pre-Planning Review

Run this BEFORE starting detailed planning:

- [ ] Core loop can be stated in one sentence
- [ ] Target aesthetic(s) identified (max 2)
- [ ] Genre precedents researched (what works, what doesn't)
- [ ] Platform constraints known
- [ ] Solo/team capacity honestly assessed
- [ ] Previous project lessons documented (but not over-applied)

### Post-Planning Audit

Run this AFTER planning is complete:

- [ ] MLP has ≤3 features beyond core loop
- [ ] No feature requires "a new system" to support it
- [ ] No premature content (max 1 level, 1-2 enemy types in MLP)
- [ ] 30% rule applied to timeline
- [ ] Every feature passes "Should I Add This Feature?" table
- [ ] Over-scope score is ≤2
- [ ] Plan fits in ≤3 pages
- [ ] First playable build target defined (tracer bullet)
- [ ] Playtest plan exists (who, when, what to test)
- [ ] Parking lot created for deferred ideas

## Deep Dives

- `(see antipatterns/catalog.md for full anti-pattern descriptions: scope, design, and timing anti-patterns with fixes and tests)`

## See Also

- **scoping** — MLP process, tracer bullets, and cutting heuristics referenced throughout `(see scoping → MLP Scoping Process)`
- **design-frameworks** — Frameworks for making better design decisions (MDA, SDT, flow) `(see design-frameworks → MDA Framework)`
- **economy-design** — Economy anti-patterns and balance planning `(see economy-design)`
- **playtesting** — The antidote to Design in Isolation `(see playtesting)`
- **scenario-walkthrough** — Bridge between paper design and building `(see scenario-walkthrough → The 5-Beat Structure)`
- **difficulty-design** — Difficulty-specific anti-patterns (fake difficulty, number inflation, developer blind spot) `(see difficulty-design)`
- **content-planning** — Content-specific anti-patterns (filler, content treadmill, premature production) `(see content-planning)`
- **mechanics-palette** — Focused mechanic selection to avoid Kitchen Sink Design `(see mechanics-palette)`
- **plan-audit** — Comprehensive plan auditing beyond antipattern detection `(see plan-audit)`
