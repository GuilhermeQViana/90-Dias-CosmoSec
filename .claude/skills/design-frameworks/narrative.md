# Narrative Integration

## 4 Integration Levels

| Level | Description | Example | Scope Cost |
|-------|-------------|---------|-----------|
| **Separated** | Story and gameplay don't interact | Cutscene → gameplay → cutscene | Low |
| **Contextual** | Story gives meaning to gameplay | "You're fighting to save your sister" | Low |
| **Integrated** | Gameplay mechanics serve the story | Losing health = character getting weaker narratively | Medium |
| **Emergent** | Gameplay creates unique stories | Dwarf Fortress, RimWorld, Hades | High |

**For MLP:** Aim for Contextual at minimum. Integrated if your game is narrative-driven. Emergent only if systems support it naturally.

### Choosing Integration Level

**How to decide based on game type and team size:**

| Game Type | Recommended Level | Why |
|---|---|---|
| Puzzle, rhythm, arcade | Separated or Contextual | Story isn't the draw — keep scope low |
| Action, platformer | Contextual | Context motivates without adding scope |
| RPG, adventure | Integrated | Story IS the product — invest here |
| Sandbox, sim | Emergent (if systems support it) | Player-created stories are the point |

**Team size considerations:**
- Solo dev → Separated or Contextual. Integrated narrative requires writing + implementation + testing = significant solo effort
- Small team with a writer → Integrated is achievable
- Emergent narrative comes from systems design, not writing — requires systems-first development

**Branching narrative as scope multiplier:**
- Each meaningful branch doubles content (dialogue, consequences, testing)
- 3 branches with 2 choices each = 8 possible paths to write and test
- For MLP: linear narrative with contextual integration. Branch ONLY if branching IS the core mechanic (visual novels, choice-driven RPGs)

**Environmental storytelling as low-cost alternative:**
- Tell stories through the environment (scattered notes, visual details, item placement)
- No dialogue trees, no voice acting, no branching paths
- Players who want story find it; players who don't can ignore it
- Examples: Dark Souls item descriptions, Gone Home environmental details, BioShock audio logs

## Ludonarrative Dissonance Test

**Ask:** "Does what the player DOES match what the story SAYS?"

| Dissonance | Mechanic | Narrative | Problem |
|-----------|----------|-----------|---------|
| Ludonarrative | Kill hundreds of enemies | "I'm not a violent person" | Actions contradict character |
| Tonal | Goofy physics | Serious story | Mood clashes |
| Pacing | Urgent main quest | 100 side quests available | Urgency undercut by freedom |

**Guideline:** If you can't resolve dissonance, lean into it (comedy) or restructure the narrative to match the mechanics.
