---
name: playtesting
description: Playtesting methodology and iteration planning for games. Use when planning playtests, defining test criteria, setting up feedback loops, deciding when to pivot or persevere, or structuring build-test-learn cycles. Covers observation techniques, minimum viable playtests, iteration cadence, pivot decisions.
---

# Playtesting & Iteration

Test early, test often. No design decision survives first contact with a playtester.

## Quick Reference

### Playtest Type Selection

| Type | Tester | What It Validates | When to Use |
|---|---|---|---|
| **Self-test** | You | Basic functionality, obvious breaks | Every build |
| **Friend test** | Someone who knows you | Core loop fun, clarity of mechanics | After tracer bullet works |
| **Stranger test** | Someone with no context | Onboarding, first impression, intuitiveness | After friend test passes |
| **Group test** | 3-5 strangers simultaneously | Consistency, edge cases, varied play styles | Before calling MLP "done" |

**Rule:** Self-testing finds bugs. Friend-testing finds confusion. Stranger-testing finds the truth.

### The 3-Question Framework

After every playtest, evaluate these three questions:

| Question | If No → | Fix Category |
|----------|---------|-------------|
| **Did they understand?** | Onboarding problem | Clarity: UI, feedback, tutorial `(see design-frameworks → Game Feel, Juice & Onboarding)` |
| **Did they want to keep going?** | Core loop problem | Fun: mechanics, pacing, reward `(see design-frameworks → Core Loop Design)` |
| **Did they want to come back?** | Retention problem | Hook: progression, curiosity, mastery |

**Priority order:** Understanding → Engagement → Retention. Don't fix retention if players aren't engaged. Don't fix engagement if players are confused.

### Playtest Planning Checklist

- [ ] Name 3 specific people who will test
- [ ] Date for first playtest scheduled
- [ ] One specific question this playtest answers (e.g., "Is the jump mechanic intuitive?")
- [ ] Observation method chosen (watch silently, record screen, take notes)
- [ ] Pivot criteria defined ("If X happens, we change Y")

## Minimum Viable Playtest (MVPt)

The smallest build that can answer "is this fun?"

**Requirements:** Core loop completes one full cycle (action → reward → reinvestment), player can fail and try again, programmer art is fine, no menus/saves/settings needed, runs 5+ minutes without crashing.

**Timeline test:** If you can't produce an MVPt within one week, your scope is too large.

## Observation vs Asking

**What players DO is more reliable than what they SAY.**

| Observe | Don't Ask |
|---------|-----------|
| Where they get stuck | "Was it confusing?" |
| What they skip or ignore | "Did you notice the tutorial?" |
| When they lean forward | "Was it fun?" |
| When they check their phone | "Were you bored?" |
| What they try that isn't possible | "What features do you want?" |

**After the playtest, ask open-ended questions:** "What were you trying to do when [observed moment]?", "Walk me through what you were thinking during [section]", "What would you do next if you kept playing?"

**Never ask:** "Was it fun?" "Did you like it?" — these produce polite lies.

## Iteration Cadence

Build → Test → Learn cycle: Build (1-3 days) → Test (1 session) → Learn (same day) → repeat.

**Cadence targets:** MLP phase: test every 3-5 days. Fun polish: test after every significant change. Content: test each batch before making more.

**Red flags:** >2 weeks since last playtest (too rare). Testing every day (not enough change). Only testing when "ready" (it's never ready).

## Pivot vs Persevere

| Signal | Action |
|--------|--------|
| Core mechanic not fun after 3+ tests | **Pivot** — change the core mechanic |
| Fun in short bursts, boring over time | **Iterate** — add variation, adjust pacing |
| Fun when explained, confusing without help | **Iterate** — improve onboarding |
| Tester engaged but frustrated by specific part | **Iterate** — adjust that area |

**When in doubt:** More testing, not more building. One playtest costs an hour; one feature costs a week.

## Session Structure

**RITE Method** (Rapid Iterative Testing and Evaluation): Fix problems immediately after each participant, verify with the next. 3-4 iteration + 6 verification participants = robust usability.

**Four phases:** Briefing (2-5 min, explain what you're testing, not how to play) → Play session (15-60 min, observe silently) → Debrief (10-15 min, questionnaire first, then open-ended follow-up) → Post-session (15-30 min, team reviews top 3 issues).

**Sample sizes:** Usability: 5 minimum (finds ~80% of major issues). Core loop validation: 5-10. Counting rule: 3/5 testers hit same issue → pattern worth fixing.

**FFWWDD Framework:** Six open-ended debrief questions — Frustrating, Favorite, Wanted, Wand, Doing, Describe. `(see plan-audit/questionnaires.md for full question list and analysis tips)`

## See Also

- **scoping** — Post-MLP iteration phases `(see scoping → Post-MLP Iteration Phases)`
- **antipatterns** — Design in Isolation is the #1 anti-pattern playtesting prevents `(see antipatterns)`
- **design-frameworks** — Onboarding patterns for fixing "didn't understand" results `(see design-frameworks → Game Feel, Juice & Onboarding)`
- **economy-design** — What to playtest for economy balance `(see economy-design)`
- **scenario-walkthrough** — Walkthrough as a testable artifact to compare against real play `(see scenario-walkthrough → The 5-Beat Structure)`
- **difficulty-design** — Testing for difficulty fairness, developer blind spot `(see difficulty-design)`
- **content-planning** — Content batching and playtest cadence `(see content-planning)`
- **plan-audit** — Playtest readiness audit and questionnaire frameworks `(see plan-audit)`
- **architecture-audit** — Code architecture audit for technical playtest blockers `(see architecture-audit)`
