# Mechanics Palette — Full Reference

All 10 mechanic categories with full tables and design notes.

## Movement

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Platforming** | Jump between surfaces with gravity and momentum | `platformer` `action` | `physics` | Low |
| **Flight** | Free 3D or 2D aerial movement, often fuel-limited | `flight-sim` `action-adventure` | `physics` | Medium |
| **Teleportation** | Instant repositioning — point-to-point or line-of-sight | `FPS` `puzzle` `action` | `spatial` | Low |
| **Wall-running** | Temporary traversal along vertical surfaces | `action` `platformer` | `physics` | Medium |
| **Grappling** | Swing or pull toward anchor points — extends reach | `action-adventure` `platformer` | `physics` | Medium |
| **Swimming** | Underwater movement with oxygen/buoyancy constraints | `action-adventure` `survival` | `physics` `resource` | Medium |

**Design notes:** Movement mechanics define how the game *feels* second-to-second. The best movement mechanics create skill expression — the gap between a beginner and expert using the same system. Consider: does your movement mechanic have a skill ceiling?

## Combat

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Melee combo** | Chained close-range attacks with timing windows | `action` `fighting` `character-action` | `physics` `timing` | Medium |
| **Ranged/projectile** | Aim and fire at targets from distance | `FPS` `TPS` `shoot-em-up` | `physics` `spatial` | Low |
| **Parry/counter** | Timed defensive response that punishes attackers | `action` `fighting` `soulslike` | `timing` | Medium |
| **Stealth takedown** | Eliminate unaware enemies for bonus effect | `stealth` `immersive-sim` | `spatial` `AI` | High |
| **AoE (area of effect)** | Attacks that hit multiple targets in a zone | `RPG` `RTS` `MOBA` | `spatial` | Low |
| **Summon/companion** | Deploy AI allies that fight alongside the player | `RPG` `strategy` `action` | `AI` `economy` | High |

**Design notes:** Combat mechanics are frequently the core loop. Decide early: is combat about *precision* (timing, aim) or *decisions* (ability selection, positioning)? This choice cascades into every other system.

## Building & Crafting

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Construction** | Place structures in the world with snapping or free-form | `sandbox` `city-builder` `survival` | `spatial` `economy` | Medium |
| **Crafting recipes** | Combine ingredients into new items via known formulas | `survival` `RPG` `adventure` | `economy` `inventory` | Medium |
| **Terraforming** | Reshape terrain — dig, raise, flatten, sculpt | `sandbox` `god-game` | `spatial` `physics` | High |
| **Tower/turret placement** | Position defensive structures along enemy paths | `tower-defense` `RTS` | `spatial` `economy` | Low |
| **Automation** | Build systems that produce, transport, or process without player input | `factory` `idle` `sandbox` | `economy` `logic` | High |

**Design notes:** Building mechanics create ownership — players value what they've made. Consider destruction too: if nothing can threaten what players build, building loses tension. If everything is easily destroyed, building feels pointless.

## Collection & Resource

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Looting** | Collect items/currency from defeated enemies or containers | `RPG` `action` `roguelike` | `economy` `random` | Low |
| **Fishing** | Timing or reflex minigame to catch aquatic resources | `RPG` `life-sim` `adventure` | `timing` `economy` | Low |
| **Mining** | Extract resources from the environment, often with tool progression | `survival` `sandbox` `RPG` | `economy` `spatial` | Low |
| **Farming** | Plant, tend, and harvest crops over time cycles | `life-sim` `survival` `RPG` | `economy` `timing` | Medium |
| **Foraging** | Discover and gather scattered environmental resources | `survival` `adventure` `open-world` | `spatial` `economy` | Low |
| **Bartering** | Exchange resources with NPCs at fixed or variable rates | `RPG` `sim` `adventure` | `economy` | Low |

**Design notes:** Collection mechanics feed other systems — they're taps in your economy. The act of collecting should be satisfying on its own (good game feel), not just a chore to fuel crafting `(see economy-design)`.

## Cards & Deckbuilding

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Draw/play cycle** | Draw cards each turn, play within resource limits | `card-game` `deckbuilder` | `economy` `random` | Low |
| **Deck construction** | Build a persistent deck from a card pool between encounters | `deckbuilder` `roguelike` `TCG` | `economy` `strategy` | Medium |
| **Hand management** | Decide what to play, hold, or discard from limited hand | `card-game` `board-game` | `strategy` | Low |
| **Card combos** | Cards that amplify each other when played in sequence or combination | `deckbuilder` `TCG` | `strategy` `economy` | Medium |
| **Drafting** | Choose cards from shared pools, denying opponents options | `TCG` `board-game` `auto-battler` | `strategy` `social` | Medium |

**Design notes:** Card mechanics excel at creating meaningful choices with constrained randomness. The deck IS the progression system — every card added or removed is a permanent strategic decision. Consider: does adding a card always make the deck better, or is deck thinning part of the strategy?

## Management

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **City/base building** | Construct and expand a settlement, balancing needs and growth | `city-builder` `RTS` `survival` | `economy` `spatial` | High |
| **Unit control** | Direct multiple agents with distinct roles and abilities | `RTS` `tactics` `auto-battler` | `AI` `spatial` `strategy` | High |
| **Scheduling/time management** | Allocate limited time across competing activities | `life-sim` `management` `visual-novel` | `economy` `strategy` | Medium |
| **Worker placement** | Assign limited workers to action slots for returns | `board-game` `strategy` | `economy` `strategy` | Medium |
| **Supply chains** | Connect production nodes — output of one feeds input of another | `factory` `city-builder` `tycoon` | `economy` `logic` | High |

**Design notes:** Management mechanics create satisfying optimization problems. The key tension: efficiency vs resilience. A perfectly optimized system is fragile; a resilient system wastes resources. Let players choose where on that spectrum to sit.

## Social & Negotiation

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Trading** | Exchange resources or items with other players at negotiated rates | `strategy` `MMO` `board-game` | `economy` `social` | Medium |
| **Diplomacy** | Form alliances, declare rivalries, negotiate treaties | `grand-strategy` `4X` `board-game` | `social` `AI` | High |
| **Recruitment** | Convince NPCs or units to join the player's cause | `RPG` `tactics` `strategy` | `economy` `social` | Medium |
| **Relationship building** | Deepen bonds with characters through choices and gifts | `life-sim` `RPG` `visual-novel` | `social` `narrative` | Medium |
| **Bluffing** | Mislead opponents about your intentions, hand, or resources | `card-game` `board-game` `social-deduction` | `social` `strategy` | Low |

**Design notes:** Social mechanics are hardest to implement with AI (NPCs that feel like real negotiators) but easiest in multiplayer (other humans provide the depth). For single-player, relationship building is the most MLP-viable — it needs good writing more than complex AI.

## Puzzle & Logic

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Pattern matching** | Recognize and replicate or align visual/audio patterns | `puzzle` `rhythm` `match-3` | `logic` | Low |
| **Spatial reasoning** | Rotate, fit, or arrange objects in 2D/3D space | `puzzle` `Tetris-like` `sokoban` | `spatial` `logic` | Low |
| **Physics manipulation** | Use simulated physics to solve environmental challenges | `puzzle` `sandbox` `platformer` | `physics` | Medium |
| **Sequencing** | Arrange actions or elements in correct order | `puzzle` `adventure` `programming` | `logic` | Low |
| **Deduction** | Eliminate possibilities through clues and logic | `mystery` `board-game` `adventure` | `logic` `narrative` | Medium |

**Design notes:** Puzzle mechanics have a consumption problem — once solved, they lose value. Solutions: procedural generation (new puzzles each time), mastery optimization (solve faster/better), or integrate puzzles into other systems so the puzzle-solving is a means, not the end.

## Temporal

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Turn-based** | Players and AI alternate discrete actions — no time pressure | `RPG` `tactics` `strategy` `board-game` | `strategy` | Low |
| **Real-time with pause** | Continuous action with ability to pause and issue orders | `CRPG` `RTS` `sim` | `strategy` `timing` | Medium |
| **Time rewind** | Undo actions or reverse time to retry segments | `puzzle` `action` `platformer` | `timing` `logic` | High |
| **Rhythm/timing** | Actions synced to music beat or precise timing windows | `rhythm` `action` `RPG` | `timing` | Medium |
| **Simultaneous turns** | All players plan moves simultaneously, then resolve together | `board-game` `tactics` `strategy` | `strategy` `social` | Medium |

**Design notes:** Temporal mechanics define the pacing and stress level of your game. Turn-based = strategic thinking, real-time = execution skill, rhythm = pattern mastery. Hybrid approaches (real-time with pause, simultaneous turns) try to get both — at the cost of UI complexity.

## Progression & Meta

| Mechanic | Description | Genre Origins | System Type | Complexity |
|----------|-------------|---------------|-------------|------------|
| **Skill trees** | Branching ability unlocks that define player builds | `RPG` `action-RPG` `MOBA` | `economy` `strategy` | Medium |
| **Equipment/loadout** | Swap gear that changes stats or abilities before encounters | `RPG` `looter-shooter` `tactics` | `economy` `strategy` | Medium |
| **Mutations/modifiers** | Random or chosen modifiers that alter mechanics each run | `roguelike` `roguelite` `action` | `random` `strategy` | Medium |
| **Roguelike meta-progression** | Persistent unlocks across failed runs — expand the possibility space | `roguelike` `roguelite` | `economy` `strategy` | Medium |
| **Prestige/rebirth** | Reset progress for permanent bonuses — compress the growth loop | `idle` `incremental` `RPG` | `economy` | Medium |
| **Unlockables** | New characters, modes, or content gated behind achievements | `action` `platformer` `fighting` | `economy` | Low |

**Design notes:** Progression mechanics are how your game stays interesting over hours, not minutes. The best progression expands *options* (horizontal) rather than just *numbers* (vertical) `(see design-frameworks/progression.md)`.
