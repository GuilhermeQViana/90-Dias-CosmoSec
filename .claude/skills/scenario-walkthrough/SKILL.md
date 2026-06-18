---
name: scenario-walkthrough
description: MLP scenario walkthrough and player experience narration. Use when visualizing the player experience before building, writing gameplay storyboards, narrating a play session, mapping player inputs to feedback, or validating that a plan feels concrete and playable. Covers 5-beat walkthrough, input/feedback mapping, experience narration.
---

# MLP Scenario Walkthrough

Narrate the player's experience before writing code. If you can't describe it, you can't build it.

## Quick Reference

### What Is a Scenario Walkthrough?

A moment-by-moment narration of a complete play session through your MLP. Not a feature list — a story of what the player sees, does, and feels from launch to session end.

**Write one when:** Core loop + 3 features are defined, BEFORE implementation begins `(see scoping → The 3-Feature Rule)`.

### The 5-Beat Structure

| Beat | Question It Answers | Duration |
|---|---|---|
| **1. First Contact** | What does the player see on launch? | First 10 seconds |
| **2. Learning the Verb** | How do they discover the core mechanic? | First 1-2 minutes |
| **3. Core Loop in Motion** | What does a full loop cycle feel like? | 2-3 cycles |
| **4. Rising Stakes** | How does challenge emerge? | First failure |
| **5. Session End** | Why would they play again? | Last moment |

### Input & Feedback Mapping

For each key moment, fill in this template:

| Player Intent | Input | Visual Feedback | Audio Feedback | State Change |
|---|---|---|---|---|
| *"I want to jump"* | *Space bar* | *Character rises, squash & stretch* | *Whoosh sound* | *Position changes, airborne state* |
| *"I want to attack"* | *Click* | *Sword swing animation, hit flash* | *Slash + impact sound* | *Enemy HP decreases* |

**Rule:** If you can't fill in all 5 columns for a core action, the design isn't concrete enough to build.

### MLP Scenario Checklist

- [ ] First 30 seconds described — what does the player see and do first?
- [ ] First failure described — how does the player lose/fail and what happens?
- [ ] Complete core loop cycle narrated — action → reward → reinvestment
- [ ] Every input method used in MLP is mentioned at least once
- [ ] A reason to replay or continue is present at session end
- [ ] No beat says "the player has fun" — describe what they DO, not how they feel

## Deep Dives

- `(see scenario-walkthrough/template.md for all 5 beat walkthroughs, Visual Snapshot Prompts, Walkthrough Anti-Patterns)`

## See Also

- **design-frameworks** — Onboarding (Beat 2), core loop design (Beat 3), game feel (feedback mapping) `(see design-frameworks → Core Loop Design)`
- **scoping** — Tracer bullet as the technical equivalent of a walkthrough `(see scoping)`
- **playtesting** — Use the walkthrough as a testable artifact `(see playtesting → The 3-Question Framework)`
- **antipatterns** — Design in Isolation and GDD Tome — walkthroughs help avoid both `(see antipatterns)`
- **economy-design** — Narrate economy decisions within the walkthrough `(see economy-design)`
- **difficulty-design** — Flow and difficulty for Beat 4 (Rising Stakes) `(see difficulty-design → Flow State & Difficulty)`
- **content-planning** — Narrate content pacing and level progression before building `(see content-planning)`
