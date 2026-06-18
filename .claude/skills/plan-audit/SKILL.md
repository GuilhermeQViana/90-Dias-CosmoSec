---
name: plan-audit
description: Game-specific plan quality auditing. Use when auditing game project plans, checking game plan completeness, evaluating game MLP scope, reviewing GDD quality, assessing economy design, difficulty curves, playtest readiness, or running plan-audit on a game project. Covers core loop validation, scope complexity scoring, design document quality, economy red flags, difficulty assessment.
---

# Game Plan Audit

Audit game plans for completeness, scope realism, and design quality. Catches game-specific gaps that generic plan audits miss.

## Quick Reference

### Game Plan Completeness Scorecard

| # | Check | Severity | Cross-Reference |
|---|-------|----------|-----------------|
| 1 | Core loop defined in one sentence | Critical | `(see scoping → Core Loop Identification)` |
| 2 | Target aesthetics identified (1-2 from MDA) | Critical | `(see design-frameworks → MDA Framework)` |
| 3 | MLP has ≤3 features beyond core loop | Warning | `(see scoping → The 3-Feature Rule)` |
| 4 | Tracer bullet defined | Warning | `(see scoping)` |
| 5 | Economy complexity decided | Warning | `(see economy-design)` |
| 6 | Difficulty approach selected | Info | `(see difficulty-design → Difficulty Curve Patterns)` |
| 7 | Scenario walkthrough written | Info | `(see scenario-walkthrough → The 5-Beat Structure)` |
| 8 | Playtest plan exists (who, when, what) | Warning | `(see playtesting → Playtest Planning Checklist)` |
| 9 | Over-scope score ≤2 | Warning | `(see antipatterns → Is My Plan Over-Scoped?)` |
| 10 | Content scope estimated with production ratios | Info | `(see content-planning)` |

**Scoring:** 10/10 = ready to build. 7-9 = minor gaps, address before starting. 4-6 = return to scoping. <4 = needs fundamental design work.

### Core Loop Validation Tests

Four tests every core loop must pass:

| Test | Method | Pass Criteria |
|------|--------|---------------|
| **Sentence Test** | Describe in one sentence: "Player [verbs] to [goal], earning [reward] that enables [reinvestment]" | Active verbs, clear goal, explicit reinvestment |
| **Verb Chain Test** | List the verbs in sequence | 2-5 verbs that feed into each other. >5 = too complex. <2 = not a loop |
| **Reinvestment Test** | Output of one cycle meaningfully changes the next | Strong: Diablo (Kill→Loot→Equip→Kill stronger). Weak: Flappy Bird (score up, nothing changes) |
| **30-Second Test** | Time one micro-loop cycle | Under 60 seconds. If 5+ minutes, loop is too slow for rapid iteration |

**Core Loop Red Flags:**

| Red Flag | Symptom |
|----------|---------|
| No Reinvestment | Cycle output doesn't change next cycle |
| External Motivation Only | Story/obligation drives play, not mechanics |
| Complexity Explosion | 6+ verbs in the loop |
| Hidden Loop | Actual fun ≠ stated loop (players enjoy the metagame, not what you designed) |
| No Failure State | Can't lose or make bad decisions |
| Mandatory Grinding | Progression requires repetition without meaningful choice |

## GDD Quality Audit

### Design Document Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **The Novel** | 100+ pages of prose | Max 5 pages for MLP. Decision tables, not paragraphs |
| **The Wishlist** | Describes v5.0, no MLP definition | Define MLP first, park the rest |
| **The Fog** | Adjectives without verbs ("engaging combat") | Every feature needs concrete player verbs |
| **The Fossil** | Written once, never updated | Living doc, date-stamp sections |
| **The Silo** | Only designers can read it | Cross-discipline sections with implementation notes |
| **The Clone** | "Like X but..." without understanding WHY X works | Identify specific mechanics/dynamics, not the brand |

### Actionability Test

Score each item 1-5. Total ≥28 = actionable. 20-27 = needs work. <20 = rewrite.

| # | Test | What to Check |
|---|------|---------------|
| 1 | **Verb Test** | Does every feature description contain player verbs? |
| 2 | **Prototype Test** | Could you build a prototype from this description alone? |
| 3 | **Decision Test** | Does it contain clear decisions (not "we'll figure it out later")? |
| 4 | **Feedback Test** | Are player feedback loops described (action → response)? |
| 5 | **Scope Test** | Is there a clear MLP boundary? |
| 6 | **Cut Test** | Are deferred ideas explicitly listed? |
| 7 | **Pillar Test** | Would the design pillars cause you to reject some plausible features? |

## Decision Table: Is This Plan Ready to Build?

| # | Question | If No → |
|---|----------|---------|
| 1 | Can you state the core loop in one sentence? | **STOP** — Define the core loop first |
| 2 | Does the core loop pass the Reinvestment Test? | **STOP** — Loop isn't a loop, it's linear |
| 3 | Is scope complexity score ≤15 for solo dev? | **STOP** — Cut scope until feasible |
| 4 | Does the GDD pass the Actionability Test (≥20)? | **STOP** — Rewrite vague sections |
| 5 | Is a playtest planned within the first 2 weeks? | **STOP** — Schedule a test before building |

All five "Yes" → **READY TO BUILD.** Start with the tracer bullet.

## Checklists

### Plan Audit Checklist

- [ ] Completeness Scorecard ≥7/10
- [ ] Core loop passes all 4 validation tests
- [ ] No core loop red flags present
- [ ] GDD has none of the 6 anti-patterns
- [ ] Actionability Test score ≥20
- [ ] Scope Complexity score appropriate for team size
- [ ] No genre-specific scope traps triggered
- [ ] Economy design has sources, sinks, and player decisions (if applicable)
- [ ] Difficulty approach matches target audience
- [ ] Playtest plan is concrete (who, when, what)
- [ ] Data collection strategy exists

## What to Measure (Data Collection Checklist)

Start at Tier 0 (observation + notes). Only add instrumentation when you need answers observation can't provide.

| Category | Key Metrics |
|----------|-------------|
| **Session** | Duration, frequency, sessions-to-churn |
| **Progression** | Completion rate per section, drop-off points |
| **Difficulty** | Death/failure locations, retry counts per section |
| **Economy** | Earning rate, spending patterns, stockpiling behavior |
| **Feature usage** | Discovery rate, usage frequency, adoption timing |

**Analytics tiers:** Tier 0 = manual observation (free, immediate). Tier 1 = local CSV logging (free, 1-2 hours setup). Tier 2 = free SDK (GameAnalytics, Unity Analytics). Tier 3 = custom backend (rarely needed for indie games).

**Evidence chain:** Observation → Diagnosis → Hypothesis → Design Change → Verification. Without this chain, you're guessing.

## Deep Dives

- `(see plan-audit/detailed-audits.md for MLP Scope Audit, Economy/Balance Audit, Difficulty Curve Assessment, Playtest Readiness Audit, Data Strategy Audit)`
- `(see plan-audit/questionnaires.md for validated playtest frameworks and templates)`

## See Also

- **scoping** — MLP process and cutting heuristics that this audit validates `(see scoping → MLP Scoping Process)`
- **antipatterns** — Anti-pattern detection complements this comprehensive audit `(see antipatterns)`
- **design-frameworks** — MDA framework for aesthetic validation `(see design-frameworks → MDA Framework)`
- **economy-design** — Detailed economy design guidance `(see economy-design)`
- **difficulty-design** — Difficulty curves and accessibility `(see difficulty-design)`
- **playtesting** — Playtest methodology and iteration `(see playtesting → Playtest Planning Checklist)`
- **architecture-audit** — Code architecture audit (companion to plan audit) `(see architecture-audit)`
