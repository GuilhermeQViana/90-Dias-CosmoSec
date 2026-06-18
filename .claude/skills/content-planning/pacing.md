# Content Pacing

## Content-to-Mechanic Planning

Every mechanic in your game needs sufficient meaningful application — not a ratio, a quality test.

**The quality test:** Does this mechanic have enough chances to create memorable moments? If not, it doesn't justify its existence.

**Decision framework:**

| Mechanic Usage | Assessment | Action |
|---|---|---|
| Used in >50% of content | Core mechanic | Keep — this IS the game |
| Used in 20-50% of content | Supporting mechanic | Keep if it adds meaningful variety |
| Used in <20% of content | Niche mechanic | Cut unless it creates peak moments |
| Used once | Gimmick | Cut — not worth the dev cost |

**MLP content target:** Minimum needed to prove core loop is fun. Usually 1-3 levels or zones.

**Critical rule:** If core loop isn't fun with minimum content, more content won't save it. Fix the loop first, then build content around the proven loop `(see antipatterns/catalog.md → Premature Content)`.

## Kishōtenketsu (Nintendo Pacing)

Nintendo's 4-step level design philosophy:

| Step | Japanese | Purpose | Example (Mario) |
|------|----------|---------|----------------|
| **Ki** | Introduction | Present the mechanic safely | See moving platform, jump on it |
| **Shō** | Development | Explore the mechanic | Multiple platforms, varying gaps |
| **Ten** | Twist | Surprise or combine mechanics | Platform over hazard, timed jump |
| **Ketsu** | Conclusion | Test mastery, reward | Fast sequence combining all of the above |

**Each section is a self-contained showcase (~3-5 minutes).** A full level might contain 2-3 kishōtenketsu sequences.

**Why this works:** Players learn by doing, in escalating complexity, with a satisfying test at the end. No tutorials needed.

## Beat-Based Pacing

**Valve's beat types (Left 4 Dead, Half-Life):**

| Beat Type | Purpose | Intensity |
|-----------|---------|-----------|
| **Explore** | Discover space, find resources, absorb story | Low |
| **Combat** | Engage enemies, test skills | High |
| **Choreography** | Scripted events, spectacle, story moments | Medium |
| **Puzzle** | Slow down, think, solve | Medium-Low |

**The pacing principle:** Troughs are as important as peaks. After a high-intensity combat section, players need a low-intensity exploration section to recover and process.

**Action/rest/reward pattern:**

```
Intensity
  ↑
  │     ╱╲        ╱╲
  │    ╱  ╲      ╱  ╲
  │   ╱    ╲    ╱    ╲
  │  ╱      ╲  ╱      ╲
  │ ╱    R   ╲╱    R   ╲
  └───────────────────────→ Time
     Peak  Rest  Peak  Rest
```

- Every intensity peak should be followed by a rest period
- Rest periods are opportunities for exploration, story, resource management
- Reward moments mark the transition from rest to the next peak
- Peaks should gradually increase in intensity across a session

## Environment-as-Teacher

The best tutorials don't feel like tutorials. The environment teaches through play.

**First level design principles:**
- Teaches ONE mechanic in a safe environment
- Show, don't tell — players learn by doing
- Failure is low-cost (quick restart, nearby checkpoint)
- No text instructions unless absolutely necessary

**Level ordering presents mechanics in order of complexity:**
1. Level 1: Core mechanic only (jump)
2. Level 2: Core + one twist (jump + moving platform)
3. Level 3: Previous mechanics + new element (jump + moving platform + hazard)
4. Each level assumes mastery of all previous levels

**Case study — Inside (Playdead):**
- First 8 minutes teach all basic mechanics
- No text, no UI prompts, no tutorial screens
- Each puzzle room introduces exactly one concept
- Player never breaks immersion to learn
- `(see design-frameworks → Game Feel, Juice & Onboarding)`

**Cost consideration:** Environmental teaching requires level design skill and iteration time. Budget 2-3x more time for early levels that serve as tutorials.
