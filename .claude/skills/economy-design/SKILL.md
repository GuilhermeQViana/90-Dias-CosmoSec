---
name: economy-design
description: Game economy and resource balance planning. Use when designing resource systems, currencies, loot tables, progression curves, reward structures, or planning how players earn and spend in a game. Covers taps and sinks, economy flow mapping, reward planning, balance frameworks, genre economy patterns.
---

# Game Economy & Balance Planning

Plan resource systems that create meaningful choices. Start simple, add complexity only when needed.

## Quick Reference

### Economy Complexity Decision

| Complexity | What It Is | Best For | MLP Viable? |
|---|---|---|---|
| **None** | No persistent resources | Puzzle, rhythm, pure action | Yes |
| **Single resource** | One currency (coins, XP, energy) | Platformer, casual, arcade | Yes |
| **Dual currency** | Soft + hard currency, or resource + currency | RPG-lite, tower defense, roguelike | Yes (start with one) |
| **Full economy** | Multiple interconnected resources | Sim, strategy, MMO, survival | No — scope to single resource for MLP |

**Decision rule:** Start one level simpler than you think you need. Add complexity after playtesting proves the simple version lacks interesting choices.

### MLP Economy Checklist

- [ ] At least one resource the player earns (tap exists)
- [ ] At least one meaningful way to spend it (sink exists)
- [ ] Spending involves a real choice (not obvious best option)
- [ ] Resource is visible and understandable to the player
- [ ] Economy supports ≥10 minutes of play without breaking (no infinite loops, no dead ends)

### Taps & Sinks Core

| If... | Then... | Fix |
|-------|---------|-----|
| Taps > Sinks | Inflation — resources lose meaning | Add sinks (repair costs, consumables, upgrades) |
| Sinks > Taps | Deflation — players feel starved | Add taps or reduce sink costs |
| Taps = Sinks | Equilibrium — but can feel flat | Add variance (jackpots, costly upgrades) |

**MLP rule:** One tap, one sink, one resource. Prove the decision is interesting before adding more.

## Deep Dives

- `(see economy-design/frameworks.md for Taps & Sinks detail, Economy Flow Mapping, Progression Curves, Loot & Reward Planning)`
- `(see economy-design/balance.md for Balance Heuristics, Design-Phase Validation, Economy Anti-Patterns)`
- `(see economy-design/genre-patterns.md for Roguelike, Idle, Tower Defense, RPG, Survival patterns + Dual→Full Economy Scaling)`

## See Also

- **design-frameworks** — Feedback loops, systems thinking, and progression system types `(see design-frameworks → Core Loop Design)`
- **scoping** — Cutting heuristics for economy features `(see scoping → MLP Scoping Process)`
- **playtesting** — Validate economy decisions with real players `(see playtesting)`
- **antipatterns** — Economy-related planning mistakes `(see antipatterns)`
- **scenario-walkthrough** — Narrate how the economy feels during play `(see scenario-walkthrough → The 5-Beat Structure)`
- **difficulty-design** — Economy difficulty curves and resource scarcity as challenge `(see difficulty-design → Challenge Types)`
- **content-planning** — Content as economy scope and production cost `(see content-planning)`
- **mechanics-palette** — Collection & resource mechanics that feed economy systems `(see mechanics-palette)`
