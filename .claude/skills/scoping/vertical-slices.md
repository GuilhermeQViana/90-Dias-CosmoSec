# Vertical Slice Decomposition

## What Makes a Good Vertical Slice?

A vertical slice is a thin, end-to-end cut through all 5 game layers — from player input down to consequence. `(see scoping → Tracer Bullet Methodology)`

**How the terms relate:**
- **Tracer bullet** = your first vertical slice. Proves the architecture works.
- **Vertical slice** = any subsequent end-to-end cut that adds a new player-facing path.
- **MLP** = the thinnest playable set of slices. When slices combine into a fun loop, you have an MLP.

**The playtester test:** A good slice passes when a playtester can experience it in isolation and give useful feedback. If you can't playtest it, it's not a slice — it's a layer.

## Best Practices

### 1. Core Loop as Walking Skeleton

Build one complete pass through the core loop before anything else. This is your tracer bullet. Every subsequent slice widens the skeleton. Prove fun before building breadth.

### 2. Slice by Player Outcome, Not System

| Good Slice | Bad Slice |
|---|---|
| "Player defeats an enemy" | "Build combat system" |
| "Player buys an item from a shop" | "Implement economy backend" |
| "Player unlocks a new area" | "Create progression framework" |

**The verb test:** If your slice description doesn't start with "Player [verb]s...", it's probably a system, not a slice.

### 3. Intentional Stubs

Early slices should use:
- Hardcoded values instead of config files
- Programmer art instead of final assets
- Simplified AI (move toward player) instead of behavior trees
- One handcrafted level instead of procedural generation

Stubs are not tech debt. They're a decision to validate fun before investing in infrastructure.

### 4. Slice Along Gameplay Variations

Each variation of a mechanic is its own slice:

| Mechanic | Slice 1 | Slice 2 | Slice 3 |
|---|---|---|---|
| Combat | Melee enemy | Ranged enemy | Boss |
| Movement | Walk + jump | Wall jump | Dash |
| Cards | Attack cards | Defense cards | Combo cards |
| Towers | Basic turret | Slow tower | Area damage |

Don't build all enemy types before any enemy is fightable.

### 5. Slice Along Progression Stages

Work through the game experience in order:

1. **Core loop** — one cycle of play (tracer bullet)
2. **Session arc** — a reason to keep playing for 10 minutes
3. **Meta-game** — progression between sessions
4. **Persistence** — saves, unlocks, long-term goals

Each stage is a slice boundary. Don't build meta-game before the core loop is fun.

### 6. Playtest Each Slice

A slice that nobody plays isn't validating anything. After each slice:
- Have someone play it (even yourself counts for early slices)
- Ask: "Is this part fun yet?" and "What's confusing?"
- Let answers influence the next slice

### 7. Hamburger Method

Every slice must contain all three hamburger layers (a simplified lens on the 5-Layer Vertical Slice), however thin:

| Layer | Thin | Thick |
|---|---|---|
| **UI** | Health bar as a number | Animated hearts with screen shake |
| **Mechanic** | Press button, enemy takes damage | Combo system with timing windows |
| **State** | Enemy health decrements | Status effects, resistances, damage types |

Build one complete hamburger at a time, not all buns first, then all patties. If your slice is missing a layer, it's not a vertical slice.

## Don'ts

1. **Don't build entire systems before any feature works end-to-end.** A physics engine with no game using it proves nothing about fun.
2. **Don't slice by engine subsystem.** "All physics first, then all rendering, then all audio" is horizontal work wearing a vertical hat.
3. **Don't make content-only slices.** Adding 10 levels with no new mechanics is horizontal. Each slice should introduce or deepen a mechanic.
4. **Don't wait for perfect architecture before your first playable.** You will refactor. Budget for it. Don't prevent it.

## Antipatterns

### THE LAYER CAKE

Building complete systems one horizontal layer at a time.

**Looks like:** "First we build the full physics engine, then the full rendering pipeline, then the full audio system, then we assemble a game."

**Why it's tempting:** Each layer feels complete and testable in isolation. It maps cleanly to specializations. Feels like solid engineering.

**What goes wrong:** Integration is where the surprises live. You discover at month 3 that the physics engine doesn't support the mechanic you need — but now you're invested in it. No one has played the game because there's been nothing to play.

**Do instead:** Build the thinnest possible version of each layer simultaneously. Prove the path works, then deepen individual layers.

### THE DEMO REEL

A polished front-end with no real game behind it.

**Looks like:** Beautiful menus, animated transitions, a title screen with a logo — but pressing "Play" leads to a grey box or a barely interactive prototype.

**Why it's tempting:** UI work produces visible, shareable progress. Screenshots look great. Stakeholders love it.

**What goes wrong:** The demo reel creates an illusion of progress. When you replace mocks with actual gameplay, the UI needs to change anyway because it was designed without knowing how the game actually plays.

**Do instead:** Programmer art UI that serves real mechanics. Polish the UI after the mechanics are stable.

### THE FEATURE BUFFET

Many thin slices, but none deep enough to evaluate fun.

**Looks like:** "We have movement, combat, inventory, crafting, dialogue, and trading!" — but each is a bare skeleton that isn't satisfying to use.

**Why it's tempting:** Breadth creates excitement. Each new feature is a dopamine hit for the developer. It's more fun to start things than to finish them.

**What goes wrong:** Nothing is deep enough for meaningful playtesting. Players can't tell if combat is engaging when it has one attack with no feedback. You end up with 10 systems to maintain and zero fun to show for it.

**Do instead:** Depth before breadth. Make one mechanic feel great, then add the next. Follow the 3-Feature MLP rule `(see scoping/SKILL.md → The 3-Feature Rule)`.

### THE PERFECTIONIST SLICE

Polishing each slice to final quality before starting the next.

**Looks like:** The first enemy type has 12 animations, hand-tuned AI, a custom death effect, and sound design — but there's only one enemy in the game, and the player can only attack in one direction.

**Why it's tempting:** "Do it right the first time." Polish is rewarding work with visible results. Leaving placeholder work behind feels uncomfortable.

**What goes wrong:** You invest 40 hours in an enemy that might get cut when playtesting reveals the combat system needs rework. Polish is wasted on unstable mechanics.

**Do instead:** Get each slice to "playtest quality" — functional, testable, ugly is fine. Save the polish pass for after the MLP is fun `(see scoping/SKILL.md → Post-MLP Iteration Phases)`.

### THE INVISIBLE SLICE

Infrastructure work with no player-facing result.

**Looks like:** "This sprint we built the save system, refactored the entity component system, and set up the asset pipeline." Nothing changed from the player's perspective.

**Why it's tempting:** You genuinely need this infrastructure. It feels essential. It scratches an engineering itch.

**What goes wrong:** You can't playtest infrastructure. You don't know if the architecture is right until features use it. Weeks pass with zero player feedback. You might be building the wrong abstractions.

**Do instead:** Embed infrastructure in a real feature. Don't build "save system" — build "player completes a run and their high score persists." The save system emerges from a vertical slice.

## Decomposition Techniques

### SPIDR for Games

SPIDR (Spike, Paths, Interfaces, Data, Rules) adapted for game features:

| Dimension | Software Meaning | Game Meaning | Example (Roguelike Upgrade System) |
|---|---|---|---|
| **Spike** | Research unknowns | Prototype to test fun | Prototype: are upgrades satisfying? |
| **Paths** | User workflows | Player choices | Path 1: offensive upgrades. Path 2: defensive. Path 3: utility. |
| **Interfaces** | API boundaries | How player interacts | UI: selection screen vs auto-apply vs shop |
| **Data** | Data variations | Content variations | 3 upgrades → 10 upgrades → 30 upgrades |
| **Rules** | Business logic | Mechanic complexity | Simple stat boosts → synergies → build-defining combos |

**How to use it:** Take a feature. Ask which SPIDR dimension is riskiest. Slice along that dimension first. For games, start with Spike (is it fun?) then Paths (what choices does the player have?).

### The 5-Beat Slice

Maps directly to the 5-Layer Vertical Slice model. For any new feature, define all five beats:

1. **Input** — What does the player press/click?
2. **Mechanic** — What happens in the game?
3. **State** — What changes?
4. **Feedback** — What does the player see/hear?
5. **Consequence** — What's different going forward?

If you can't fill in all 5, you don't have a slice yet. If any beat says "reuse existing," that's fine — the slice is thinner there but still end-to-end.

### Worked Example: Roguelike Upgrade System

Starting feature: "Between rooms, the player chooses upgrades that modify their abilities."

**Decomposed into slices:**

| Slice | Input | Mechanic | State | Feedback | Consequence |
|---|---|---|---|---|---|
| 1. Basic pick | Choose 1 of 3 | Stat boost applied | Player stats update | UI shows new value | Next room is slightly easier |
| 2. Rarity tiers | Same | Upgrades have rarity | Rarity affects magnitude | Color-coded cards | Rare upgrades shift stat balance more |
| 3. Synergies | Same | Some upgrades combo | Synergy tracker | "Combo!" notification | Build strategies emerge |
| 4. Trade-offs | Choose 1, lose 1 | Upgrade + downgrade | Two stats change | Risk/reward UI | Meaningful decisions |

Each row is independently playtestable. Slice 1 alone proves whether the upgrade loop is satisfying. Don't build slice 4 until slice 1 is fun.

## Context Matters

### When Horizontal Work IS Appropriate

Not everything can be a vertical slice. Some work is genuinely foundational:
- **Build pipeline and CI** — you need this before any slice ships
- **Engine/framework setup** — choosing and configuring your tools
- **Asset pipeline** — how art gets from tool to game
- **Core input handling** — you'll use this in every slice

**Rule of thumb:** If it takes less than a day AND every future slice needs it, build it horizontally. Otherwise, embed it in a slice.

### Solo Dev vs Team

Solo devs can tolerate slightly thicker slices because context-switching cost is lower — you hold the whole game in your head. But don't use this as an excuse to build Layer Cakes. The principle still holds: end-to-end beats depth-first.

### Jam Games vs Production

Game jams reward fewer, thicker slices. A 48-hour jam gets 2-3 big slices, not 15 thin ones. Make the first one the core loop and make it fun. Production games benefit from thin slices because iteration happens over weeks, not hours.

### Cross-References

- **Scope antipatterns:** "Premature Content" is what happens when you build horizontal content instead of vertical slices. "Everything Sounds Fun" leads to The Feature Buffet. `(see antipatterns/catalog.md → Scope Anti-Patterns)`
- **MoSCoW prioritization:** Vertical slices help you identify what's truly Must Have vs Should Have — if a Must Have feature can't be expressed as a playtestable slice, it might be a system masquerading as a feature. `(see scoping/prioritization.md)`
- **Tracer bullets:** Your first slice. Start here. `(see scoping → Tracer Bullet Methodology)`
