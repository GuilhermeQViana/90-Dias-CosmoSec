# Economy Frameworks

## Taps & Sinks Framework

**Taps** = sources where resources enter the economy. **Sinks** = drains where resources leave.

```
  [TAP]              [SINK]
  Resources    →→→   Resources
  enter              leave
  (earn gold)        (buy items)
```

| If... | Then... | Fix |
|-------|---------|-----|
| Taps > Sinks | Inflation — resources lose meaning | Add sinks (repair costs, consumables, upgrades) |
| Sinks > Taps | Deflation — players feel starved | Add taps or reduce sink costs |
| Taps = Sinks | Equilibrium — but can feel flat | Add variance (jackpots, costly upgrades) |

**MLP rule:** One tap, one sink, one resource. Prove the decision is interesting before adding more.

**Common taps:** Enemy drops, quest rewards, harvesting, time-based generation, exploration pickups.

**Common sinks:** Purchasing items/upgrades, crafting costs, repair/maintenance, consumable use, entry fees.

## Economy Flow Mapping

Map your economy as a node graph to spot problems:

```
[Earn Gold] → [Gold Pool] → [Buy Sword]
                    ↓
              [Buy Potion] → [Use in Combat] → [Survive] → [Earn More Gold]
```

**What to look for:**
- **Dead ends** — resources with no sink (accumulate forever, lose meaning)
- **Circular flows** — spend to earn to spend (good — this is your economy loop)
- **Disconnected nodes** — resources that don't interact (simplify or connect them)
- **Single path** — only one way to spend (no interesting choice)

**For MLP:** Your economy graph should have 3-5 nodes maximum. If it needs more, you're over-scoping.

## Progression Curves

How resource costs and rewards scale over time:

| Curve | Pattern | Feel | Best For |
|-------|---------|------|----------|
| **Linear** | Cost increases by fixed amount | Predictable, steady | Casual, puzzle |
| **Exponential** | Cost doubles or triples | Early progress fast, late game grindy | RPG, idle |
| **Logarithmic** | Cost increases slow down | Diminishing returns feel fair | Skill upgrades |
| **Stepped** | Flat periods with sudden jumps | Clear milestones and goals | Tier-based progression |

**"Felt progression" principle:** Players should feel meaningful progress every play session. If a session ends with no visible advancement toward the next purchase/upgrade, the curve is too flat or too steep.

**MLP guidance:** Linear or stepped curves are easiest to balance. Save exponential for post-MLP when you have playtest data.

## Loot & Reward Planning

**Rarity tiers — design intent, not just drop rates:**

| Tier | Purpose | Player Reaction | Drop Frequency |
|------|---------|-----------------|----------------|
| **Common** | Baseline, always useful | "Good, I need these" | Every encounter |
| **Uncommon** | Meaningful upgrade | "Nice, that's better" | Every few encounters |
| **Rare** | Build-defining choice | "This changes my strategy" | Once per session |
| **Epic/Legendary** | Memorable moment | "I can't believe I got this" | Once per many sessions |

**"First 30 minutes" principle:** Players should see common and uncommon rewards in the first play session. If the first session has no meaningful reward, players won't return for rare ones.

**MLP guidance:** Two tiers (common + uncommon) are enough. Add rare tier only after core loop is proven fun.
