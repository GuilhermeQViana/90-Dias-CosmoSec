# Genre-Specific Economy Patterns

## Roguelike (Hades pattern)
- Separate meta-currency (persistent) from run-currency (per-run)
- Meta-currency buys variety, not power — unlocks new options, not stat boosts
- Run-currency forces interesting in-the-moment choices
- Key: players who unlock everything should still find runs interesting because variety ≠ advantage

## Idle/Incremental
- Exponential growth is the genre: production scales ~x1.1 per upgrade, costs scale ~x1.15
- The cost-to-production ratio must gradually widen — progress slows, motivating prestige
- Prestige layers: reset progress for a permanent multiplier, creating a new metagame loop
- Each prestige layer needs its own economy that feeds back into the layer below

## Tower Defense (Plants vs Zombies pattern)
- Resource generation: passive (time-based), active (player collects), or hybrid (sunflowers)
- Active generation creates micro-decisions that layer onto tower placement macro-decisions
- Economy pacing mirrors wave pacing — scarcity early, abundance mid-wave, spend-down before boss

## RPG (multi-currency)
- Gold for commerce, XP for progression, materials for crafting — each with separate loops
- Gold sinks prevent inflation: repair costs, consumables, vendor trash buyback
- Material sinks ensure crafting stays relevant: upgrades consume lower-tier materials
- Danger zone: if players can convert between currencies freely, one currency dominates and others lose meaning

## Survival (builder/spender sync)
- Resources sync with game cycles: gather during day, spend (defend/craft) at night
- Progression-gated resources: tier 2 resources require tier 1 tools to harvest
- Builder/spender rhythm must match — if gathering takes 10 minutes but spending takes 1, pacing breaks

## Dual → Full Economy Transition

Most games should start with one currency and add complexity only when proven necessary.

**When to add a second currency:**
- After the first currency has proven it creates interesting choices
- When you need a decision that the first currency can't represent (time vs money, power vs versatility)
- NOT because "RPGs usually have gold and XP" — every currency must earn its place

**Complexity cost per currency:**
- 1 currency: 1 tap/sink pair to balance
- 2 currencies: 2 tap/sink pairs + conversion rate between them = 5 balance points
- 3 currencies: 3 tap/sink pairs + 3 conversion relationships = 9 balance points
- Each new currency roughly doubles total balance complexity

**Planning framework for scaling:**
1. Design the full economy on paper (even if building only one currency for MLP)
2. Define "value anchors" early — what is the baseline worth of each resource?
3. Stub placeholder values for future currencies — this prevents retrofit costs later
4. Expand only after playtesting confirms the current level needs more depth

**Conversion between currencies:**
- Avoid free conversion (makes one currency dominant)
- If conversion exists, make it lossy (spend 100 gold to get 80 gems — the 20% loss IS the balancing mechanism)
- Best approach: currencies serve different purposes with no direct conversion (gold buys items, XP unlocks abilities)
