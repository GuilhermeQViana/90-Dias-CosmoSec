---
name: content-planning
description: Level design and content scope planning. Use when planning level design, content production scope, pacing, procedural generation decisions, environment design, tutorial levels, world structure, or estimating content costs. Covers world structure, content-to-mechanic planning, pacing, procedural vs handcrafted, content reuse, content sequencing.
---

# Content & Level Planning

Plan content scope before building. Content is the most expensive part of most games — every hour of content costs many hours to produce.

## Quick Reference

### World Structure Decision

| Structure | Player Freedom | Scope Cost | Best For |
|---|---|---|---|
| **Linear** | Low — one path forward | Low | Platformer, puzzle, narrative |
| **Hub-and-spoke** | Medium — choose order within hub | Medium | Zelda-style, RPG, Metroidvania-lite |
| **Open world** | High — go anywhere | Very High | Sandbox, exploration, RPG |
| **Metroidvania** | Medium — gated by abilities | High | Exploration, ability-based progression |
| **Procedural** | Variable | High (to do well) | Roguelike, survival, infinite runners |

**Decision rule:** Choose the lowest-freedom structure that serves your core loop. More freedom = more content to fill the space = more scope.

### Content Scope Estimation

| Content Type | Rough Production Ratio | Notes |
|---|---|---|
| Handcrafted level | 10-40 hours per 5 min of play | Includes design, art, testing, iteration |
| Enemy type | 2-5 days each | Design, art, animation, AI, balance |
| Boss encounter | 1-3 weeks each | High-impact but expensive |
| Cutscene/dialogue | 2-8 hours per minute | Writing, implementation, testing |
| Procedural system | Weeks-months upfront | Amortizes over infinite content |

**Key principle:** Content production does not scale linearly. Level 1 takes 2 days. Level 20 takes 2 days. But you need 20x the motivation to build level 20 as level 1. Plan for production fatigue.

### Content Architecture Principle

> Poor tooling makes equivalent content cost 10x more. Invest in content tools proportionally to how much content you'll build — but not before you know WHAT you're building.

## Deep Dives

- `(see content-planning/pacing.md for Content-to-Mechanic Planning, Kishōtenketsu (Nintendo Pacing), Beat-Based Pacing, Environment-as-Teacher)`
- `(see content-planning/production.md for Procedural vs Handcrafted, Content Reuse Strategies, Content Anti-Patterns, Content Sequencing)`

## See Also

- **scoping** — Feature cutting applies to content decisions `(see scoping → MLP Scoping Process)`
- **difficulty-design** — Difficulty pacing through content, boss design as content milestones `(see difficulty-design)`
- **scenario-walkthrough** — Narrate content before building it `(see scenario-walkthrough → The 5-Beat Structure)`
- **economy-design** — Content as economy scope `(see economy-design)`
- **antipatterns** — Premature Content anti-pattern `(see antipatterns)`
- **design-frameworks** — Onboarding patterns for tutorial level design `(see design-frameworks → Game Feel, Juice & Onboarding)`
- **playtesting** — Content batching should match playtest cadence `(see playtesting)`
