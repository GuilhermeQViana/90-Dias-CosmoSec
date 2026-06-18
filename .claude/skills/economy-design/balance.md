# Balance & Validation

## Balance Heuristics

**Time to First Value (TTFV):**
- Player should earn AND spend a resource within the first play session
- If a player earns currency but can't afford anything for 3 sessions, the economy feels broken
- TTFV for the first purchase should be 5-15 minutes for most genres

**Session-end progress test:**
- Every play session should end with visible progress toward the next purchase or milestone
- If any session ends with no meaningful advancement, the curve is too flat or rewards are too sparse
- Corollary: if a player can afford everything after one session, rewards are too generous

**Percentage-based sinks:**
- Scale costs with player wealth to prevent inflation naturally
- Repair costs as % of equipment value, not flat fee
- Transaction taxes that grow with economy scale
- This prevents late-game players from hoarding while keeping early-game affordable

**Diminishing returns on generation:**
- First gold mine produces 10/min, second produces 8/min, third produces 6/min
- Encourages diversification over stacking one strategy
- Prevents runaway exponential growth from resource spam

**The value anchor principle:**
- Define one "anchor" purchase that players understand early (a sword costs 100 gold)
- All other prices feel intuitive relative to the anchor (a shield costs 80, a potion costs 20)
- Without an anchor, players can't judge if prices are fair

## Design-Phase Validation

Economy defects found during design are 30x cheaper to fix than those found after players experience them. Validate before building.

**Spreadsheet prototyping:**
- Model your economy in a spreadsheet before writing code
- Project hours/days of gameplay: when does the player hit each milestone?
- Simulate 10 play sessions — does inflation or starvation emerge?
- Column per resource, row per time unit (minutes or sessions)

**Economy flow tracing:**
- Pick one resource and follow it from generation through every spend path
- At each node: is there a meaningful choice? Can the resource dead-end?
- Repeat for each resource — interactions between resources are where bugs hide

**Validation gates (check in order):**
1. Is the core loop fun without any economy? → If no, fix the loop first
2. Does the economy create interesting choices? → If no, simplify or redesign
3. Does content production break the economy? → If yes, rebalance before making more content
4. Do edge cases exploit the economy? → Test min/max strategies, find dominant paths

## Economy Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|---|---|---|
| **Infinite faucet** | Resources accumulate with nothing to spend on | Add meaningful sinks before adding more taps |
| **Single dominant strategy** | One spend path is always optimal | Rebalance or add situational value to alternatives |
| **Number goes up** | Progression is purely numerical (+5 damage) | Add qualitative choices (fire vs ice, speed vs power) |
| **Meaningless choice** | All options roughly equivalent | Differentiate options with clear trade-offs |
| **Pay wall** | Progress impossible without specific resource | Ensure multiple paths to advancement |
| **Reward inflation** | Early rewards feel worthless quickly | Scale reward meaning, not just quantity |
| **Hyperinflation** | Mid-to-late game resources lose all meaning | Exponential taps need matching exponential sinks |
| **Grind wall** | Exponential costs without exponential rewards | Cost curve and reward curve must grow proportionally |

**"Economy works in isolation but breaks combined":**
- Each resource loop may balance individually, but interactions create exploits
- Map system interactions and test each edge: what happens when a player focuses entirely on one resource?
- Test the player who min-maxes, not just the player who plays "normally"

**Currency addition test:** Before adding a new currency, ask: "Can an existing currency fill this role?" If yes, don't add a new one. Each currency requires new sources + sinks = exponential complexity.

**Dominant strategy (City of Heroes example):** Unlimited same-type enhancements → players stack one stat → diminishing returns fix restored build diversity. If players can stack one thing infinitely, they will.
