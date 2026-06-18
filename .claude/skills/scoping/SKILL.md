---
name: scoping
description: MLP scoping and tracer bullet planning for games. Use when scoping a game idea, prioritizing game features, defining vertical slices, creating a game MLP, or breaking down a game concept into buildable phases. Covers core loop identification, MoSCoW prioritization, scope management, feature cutting.
---

# Game Scoping & MLP Planning

Scope game ideas into buildable plans. Get to playable fast, iterate from there.

## Quick Reference

### MLP vs MVP

| | MVP (Software) | MLP (Games) |
|---|---|---|
| **Goal** | Validate market fit | Validate fun |
| **Success metric** | Users complete task | Players choose to keep playing |
| **Core question** | "Does it work?" | "Is it fun?" |
| **Minimum bar** | Functional | Enjoyable |
| **What to cut** | Non-essential features | Anything not serving the core loop |

**Key insight:** An MVP that works but isn't fun is a failed game. An MLP that's fun but limited is a successful foundation.

### Core Loop Identification

The core loop is what the player does **every 30-60 seconds**. Everything else is secondary.

**One-sentence test:** "The player [VERB]s [OBJECT] to [REWARD], which lets them [REINVEST]."

| Genre | Example Core Loop |
|-------|-------------------|
| Platformer | Jump through obstacles → reach checkpoint → unlock new area |
| Roguelike | Enter room → fight enemies → collect upgrades → go deeper |
| Puzzle | Observe pattern → manipulate pieces → solve → get harder puzzle |
| Tower Defense | Analyze wave → place towers → survive → earn currency → upgrade |
| Farming Sim | Plant crops → tend/wait → harvest → sell → buy better seeds |
| Card Game | Draw cards → play combinations → resolve effects → draw again |

### Core Loop Validation Checklist

- [ ] Can be stated in one sentence
- [ ] Involves player agency (not watching)
- [ ] Has a clear reinvestment path (reward feeds back into action)
- [ ] Is inherently repeatable without getting stale in first 10 minutes
- [ ] Can be prototyped with programmer art
- [ ] Is fun with zero content (no levels, no story, no progression)

## MLP Scoping Process

### The 3-Feature Rule

Your MLP gets **three features** beyond the core loop. Choose wisely.

**Process:**
1. Define the core loop (non-negotiable, not counted as a feature)
2. List every feature you want
3. For each feature, ask: "Does this make the core loop more fun?"
4. Rank by impact on core loop fun
5. Take the top 3

**Why 3?** More than 3 features for an MLP means you're building content, not validating fun. If your core loop needs more than 3 supporting features to be fun, your core loop is too weak.

### Feature Impact Assessment

| Impact Level | Description | Example (Roguelike) |
|---|---|---|
| **Core** | Loop doesn't work without it | Combat system |
| **Amplifier** | Makes core loop significantly more fun | Upgrade selection between rooms |
| **Enhancer** | Adds variety/polish | Different enemy types |
| **Content** | More of the same | Additional levels |
| **Cosmetic** | Visual/audio polish | Particle effects |

MLP includes: Core + up to 3 Amplifiers. Everything else waits.

## Post-MLP Iteration Phases

| Phase | Focus | Duration Target |
|-------|-------|-----------------|
| **MLP** | Core loop + 3 features | Build as fast as possible |
| **Fun Polish** | Juice, game feel, feedback | Until core loop feels good |
| **Content Alpha** | Variety (enemies, levels, items) | Until 15-30 min play session |
| **Systems** | Progression, meta-game, saves | Until players want to return |
| **Content Beta** | Full content pipeline | Until target play length |
| **Polish** | UI, audio, accessibility | Until shippable |

**Rule:** Don't advance to the next phase until the current phase's goal is met. Especially don't skip Fun Polish.

## Checklists

### Before Scoping

- [ ] Core loop defined in one sentence
- [ ] Core loop validated with checklist above
- [ ] Genre identified (affects scope expectations)
- [ ] Target play session length defined (5 min? 30 min? 2 hours?)
- [ ] Platform/input constraints known (keyboard? controller? touch?)
- [ ] Solo dev or team? (drastically affects achievable scope)
- [ ] Economy complexity level identified (none / single resource / dual currency / full economy) `(see economy-design)`

### Scope Review

- [ ] MLP has ≤3 features beyond core loop
- [ ] 30% rule applied (original scope reduced)
- [ ] Every feature passes the cutting heuristics test
- [ ] Tracer bullet target defined (first thing to build)
- [ ] No features that require "new systems" to support
- [ ] No content-heavy items in MLP (those come later)
- [ ] Scope fits target timeline (be honest)
- [ ] Playtest plan: who will test, when, what you're testing for `(see playtesting → Playtest Planning Checklist)`
- [ ] MLP scenario walkthrough written `(see scenario-walkthrough)`

## Tracer Bullet Methodology

A tracer bullet proves your game works end-to-end through all 5 layers:

```
┌─────────────────────────────────────┐
│  Layer 1: INPUT                     │
│  Player presses button / clicks     │
├─────────────────────────────────────┤
│  Layer 2: CORE MECHANIC             │
│  Game responds (jump, card play)    │
├─────────────────────────────────────┤
│  Layer 3: GAME STATE                │
│  World updates (HP, position)       │
├─────────────────────────────────────┤
│  Layer 4: FEEDBACK                  │
│  Player sees/hears result           │
├─────────────────────────────────────┤
│  Layer 5: OUTPUT / CONSEQUENCE      │
│  Game state creates new situation   │
└─────────────────────────────────────┘
```

**Rule:** First build touches all 5 layers for ONE action. Don't build Layer 1 for all actions before starting Layer 2.

| Genre | Tracer Bullet |
|-------|---------------|
| Platformer | Run, jump on one platform, fall, respawn |
| Roguelike | Enter room, fight enemy, pick up item |
| Puzzle | Manipulate element, solve puzzle |
| Tower Defense | Place tower, enemy walks path |
| Card Game | Draw hand, play card, see effect |

A tracer bullet is NOT: a polished demo, feature-complete, balanced, or content-rich.

## Genre-Specific Scoping Tips

| Genre | MLP Must Have | Common Over-Scope | Hidden Complexity |
|-------|--------------|-------------------|-------------------|
| **Platformer** | Run, jump, platforms, one hazard, one level | Wall jump, double jump, dash, multiple worlds | Jump feel (coyote time, buffering, variable height) |
| **Roguelike** | One floor, one enemy type, one item, permadeath | Meta-progression, 10+ enemies, proc-gen | Proc-gen that feels good is a project itself |
| **Puzzle** | One mechanic, 5-10 handcrafted puzzles, clear win state | Proc-gen puzzles, hint system, multiple mechanics | Difficulty curves require extensive playtesting |
| **Tower Defense** | One path, one tower type, waves, win/lose | Tech trees, multiple maps, hero units | Tower cost vs enemy HP balance is iterative |

## Deep Dives

- `(see scoping/vertical-slices.md for Vertical Slice Decomposition: best practices, antipatterns, SPIDR technique, 5-beat slicing)`
- `(see scoping/prioritization.md for MoSCoW Prioritization, 30% Rule, cutting heuristics, scope creep signals)`

## See Also

- **design-frameworks** — MDA, core loop theory, player motivation (the "why" behind scoping decisions) `(see design-frameworks → MDA Framework)`
- **antipatterns** — Common planning mistakes to avoid during scoping `(see antipatterns/catalog.md → Scope Anti-Patterns)`
- **economy-design** — Plan resource systems and balance before building `(see economy-design)`
- **playtesting** — Structure your playtest plan and iteration methodology `(see playtesting → Playtest Planning Checklist)`
- **scenario-walkthrough** — Narrate the player experience before implementation `(see scenario-walkthrough → The 5-Beat Structure)`
- **difficulty-design** — Difficulty modes as a scope decision, accessibility planning costs `(see difficulty-design)`
- **content-planning** — Content scope estimation, world structure decisions, procedural vs handcrafted `(see content-planning)`
- **mechanics-palette** — Browse mechanics during brainstorming before scoping to MLP `(see mechanics-palette)`
