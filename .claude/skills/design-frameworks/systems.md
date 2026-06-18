# Systems Thinking

## Feedback Loops in Games

| Type | Effect | Example |
|------|--------|---------|
| **Positive (reinforcing)** | Rich get richer, snowball effect | Winning team gets more resources → wins more |
| **Negative (balancing)** | Rubber-banding, catch-up mechanics | Losing player gets better items → catches up |

**Design guideline:** Positive feedback loops create decisive, dramatic moments. Negative feedback loops create tension and comebacks. Most games need both.

### When to Use Each Loop Type

**Use positive feedback loops when:**
- You want games/matches to end decisively (not drag on)
- Snowballing creates exciting momentum (racing games, MOBAs)
- Rewarding skilled play is a core aesthetic

**Use negative feedback loops when:**
- Comebacks should be possible (party games, casual multiplayer)
- You want close matches that go down to the wire
- New players need protection from experienced players

**Balancing the two:**
- Most competitive games use positive loops within a round but negative loops between rounds
- Mario Kart: blue shells (negative) keep races close; boost pads (positive) reward good driving
- If your game feels "predetermined after 2 minutes," you need more negative feedback
- If your game "always drags to a stalemate," you need more positive feedback

## Planning for Emergence

Emergence = simple rules creating complex behavior players didn't expect.

**How to design for emergence:**
1. Create systems that interact (fire + wind, physics + inventory)
2. Give players tools, not solutions
3. Don't hard-code outcomes — let systems resolve naturally
4. Playtest and observe what players discover

**Warning:** Emergence is unpredictable. Budget testing time for discovering (and deciding whether to keep) unintended interactions.

### Systems Interaction Planning

**Approach:** Map systems as nodes, interactions as edges.

```
[Combat] ←→ [Physics]
   ↕            ↕
[Inventory] ←→ [Environment]
```

For each edge, ask:
- What happens when these systems interact?
- Can the player exploit this interaction?
- Is the exploitation fun or game-breaking?
- Does this interaction create interesting choices?

**Rule of thumb:** 3-4 interconnected systems create enough emergence for an MLP. More systems = exponentially more interactions to test.

**Interaction complexity math:**
- 2 systems = 1 interaction to test
- 3 systems = 3 interactions
- 4 systems = 6 interactions
- 5 systems = 10 interactions
- Each interaction can produce multiple emergent behaviors

**The "interesting or exploitable?" decision:**

| System Interaction | Interesting? | Exploitable? | Keep? |
|---|---|---|---|
| Fire + wind = fire spreads | Yes (tactical) | Mildly | Yes — emergent tactics |
| Healing + damage = invincibility | No (bypasses game) | Severely | No — patch it |
| Physics + inventory = item launching | Yes (creative) | Mildly | Yes — embrace it (BotW) |
| Economy + combat = buy-to-win | No (skips gameplay) | Severely | No — cap or rebalance |

**Emergence budget:** For each system interaction you keep, plan 1-2 extra testing sessions to discover unintended combinations. The combinatorial explosion of 4+ systems means some interactions WILL surprise you.

**Do this / not that:**
- DO: Fire spreads to wooden objects → players use torches tactically (simple rules, rich outcomes)
- DON'T: 8 elemental types that each interact differently → 28 interaction pairs to balance
- DO: Physics objects can be stacked → players build creative solutions
- DON'T: Custom scripting for each physics interaction → brittle, untestable
