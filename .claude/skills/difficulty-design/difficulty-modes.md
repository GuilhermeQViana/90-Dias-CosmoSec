# Difficulty Modes & Accessibility

## Traditional Difficulty Modes

**Easy / Normal / Hard approach:**
- Low cost if modes only adjust values (enemy HP, damage, resource amounts)
- High cost if modes change encounter design, AI behavior, or level layout
- Most players pick Normal and never change — design for Normal first

**Implementation tiers:**

| Tier | What Changes | Scope Cost | Player Impact |
|------|-------------|-----------|---------------|
| **Value tweaks** | HP, damage, speed, resource amounts | Low | Perception of fairness changes |
| **Behavior changes** | AI aggression, attack patterns | Medium | Gameplay feel changes |
| **Content changes** | Different encounters, alternate paths | High | Essentially different games |

**MLP decision:** Difficulty modes are a "Could Have" for MLP. Design for one difficulty first, tune after playtesting confirms the core loop works.

## Assist Mode Design (Celeste Model)

The Celeste approach treats accessibility as granular, player-controlled, and judgment-free:

**Core principles:**
- **Granular toggles** — players adjust individual parameters, not preset bundles
- **Neutral language** — "Assist Mode" not "Easy Mode," no shame messaging
- **Always available** — toggle anytime, no menu lock-out
- **Transparent effects** — clearly state what each toggle changes

**Example toggles:**

| Toggle | Effect | Who It Helps |
|--------|--------|-------------|
| Game speed (50-100%) | Slows everything down | Motor accessibility, learning |
| Invincibility | Can't take damage | Experience the content/story |
| Infinite stamina | Removes resource management | Reduces cognitive load |
| Skip chapter | Jump past stuck sections | Prevents abandonment |

**Why this works:** Players self-select the help they need. No one-size-fits-all "easy mode" that might make combat trivial while leaving platforming too hard.

**Scope cost:** Medium. Each toggle needs testing to ensure it doesn't break game state. Budget 1-2 days per toggle for testing.

## Accessibility Planning

**The "Big 5" accessibility features and their planning cost:**

| Feature | What It Addresses | Scope Cost | When to Add |
|---------|------------------|-----------|-------------|
| **Remappable controls** | Motor disabilities | Low | Should Have for MLP |
| **Subtitles/captions** | Hearing impairment | Low | Should Have if game has audio cues |
| **Colorblind modes** | Color vision deficiency | Low-Medium | Should Have if color conveys info |
| **Screen reader support** | Visual impairment | High | Post-MLP unless core audience |
| **Difficulty options** | Cognitive/motor range | Medium | Could Have for MLP |

**Key insight:** Accessibility is not about eliminating challenge — it's about removing barriers that prevent players from reaching the challenge. A deaf player can still master a hard platformer if audio cues have visual equivalents.

**Planning rule:** If your game uses color, sound, or precise timing as the ONLY way to convey critical information, you have an accessibility problem. Always provide redundant channels.
