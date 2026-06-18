# Progression Systems

## Progression Types

| Type | Mechanism | Risk | Scope Cost |
|------|-----------|------|-----------|
| **Skill-based** | Player gets better at the game | Can hit ceiling without external help | Free |
| **Character-based** | Stats/abilities increase over time | Can mask boring core loop | Medium |
| **Content-based** | New levels, areas, enemies unlock | Expensive to produce, consumed quickly | High |
| **Narrative-based** | Story unfolds with progress | Can feel like carrot-on-stick | Medium |
| **Social-based** | Rankings, sharing, competition | Requires player base | Low-Medium |

**For MLP:** Skill-based progression is free (no content cost) and validates core loop strength. If your game isn't fun without character/content progression, the core loop needs work. Resource-based progression requires balance planning `(see economy-design/frameworks.md → Progression Curves)`.

## Horizontal vs Vertical Progression

| Type | What Changes | When to Use |
|------|-------------|-------------|
| **Vertical** | Player gets stronger (more HP, more damage) | When power fantasy is the aesthetic |
| **Horizontal** | Player gets different options (new abilities, tools) | When variety and expression are the aesthetic |

- Vertical is simpler to implement but has a ceiling — eventually numbers become meaningless
- Horizontal is harder to balance but scales better — new options don't obsolete old ones
- Best approach for most games: primarily horizontal with light vertical (new sword types, not just +1 sword)

## Progression as Scope

- Skill-based = zero content cost (player improves, game doesn't need new content)
- Character-based = medium cost (need upgrade trees, balance passes)
- Content-based = high cost (every new level/area/enemy requires production)
- Plan progression type based on your production capacity, not just design preference

## Meta-Progression Planning

- Meta-progression = persistent unlocks across runs/sessions (Hades mirror, roguelike unlocks)
- Unlocks should expand options, not just increase power (variety > stats)
- Collection mechanics (unlock all characters, find all items) provide long-term goals cheaply
- Prestige systems (reset for permanent bonus) extend endgame but require careful economy balance `(see economy-design/genre-patterns.md)`

## Layering Progression

- Start with skill-based (core loop mastery)
- Add character-based (new tools, not just bigger numbers)
- Layer content-based (new contexts for core loop)
- Weave narrative (motivation to continue)

## Red Flags

- Players need progression to tolerate gameplay → fix the gameplay
- Progression makes the game easier instead of different → adjust curve
- All progression is numeric (+5 damage) → add qualitative variety
- Progression masks a boring core loop — the most dangerous anti-pattern. If you remove all progression and the game isn't fun for 5 minutes, no amount of unlocks will save it
