# Content Production

## Procedural vs Handcrafted

| Factor | Handcrafted | Procedural | Hybrid |
|--------|------------|------------|--------|
| **Quality per unit** | High (designed) | Variable (algorithmic) | Medium-High |
| **Content volume** | Limited by dev time | Unlimited | Large |
| **Upfront cost** | Low per level | High (system design) | High |
| **Iteration cost** | High per level | Low (tweak parameters) | Medium |
| **Player experience** | Curated, intentional | Fresh, surprising | Best of both |
| **Pacing control** | Full control | Limited | Moderate |

**Procedural generation is NOT a scope-reduction tool.** It often increases total scope:
- Designing the generation system takes weeks-months
- Testing requires validating thousands of possible outputs
- Bad seeds/layouts need detection and prevention
- Players notice and resent obviously random content

**When procedural IS appropriate:**
- Replayability is core to the experience (roguelikes)
- Content volume would be impossible to handcraft (infinite runners)
- Variety itself is the value proposition (Minecraft worlds)

**When to handcraft instead:**
- Pacing and difficulty control matter (narrative games)
- Each piece of content needs to be memorable (puzzle games)
- Total content count is manageable (<20 levels)

**Hybrid approach:** Procedural rough draft → hand-curate results. Generate a hundred levels, pick the best 20, polish by hand. Spelunky uses authored "chunks" that get procedurally assembled.

**Decision questions:**
1. Will procgen speed up dev time? (Usually no — it shifts time from content creation to system engineering)
2. Will it add something players actively want? (Replayability, surprise, variety)
3. Can you test it thoroughly? (Every possible output needs to be at least playable)
4. If adding procgen as a buzzword — don't.

## Content Reuse Strategies

The most polished games reuse content intelligently. Players don't notice reuse if the experience feels different.

**Palette swap / Variant enemies:**
- Same model or base, different abilities or behavior
- Spyro: same enemy archetype across worlds with themed skins and one new trick
- 3 base enemy types x 3 behavior variants = 9 perceived enemies

**Remixed encounters:**
- Same assets, different combinations and contexts
- God of War Valkyries: same move pool, each Valkyrie uses a unique subset
- A room with 2 fast enemies feels completely different from 1 fast + 1 ranged

**Modular level building:**
- Design reusable building blocks (rooms, corridors, arenas)
- Rotate, reskin, mirror, and remix modules
- Players recognize spaces subconsciously (comfort) but don't feel repetition if context changes

**Environmental reskinning:**
- Same layout structure, different theme (forest → cave → temple)
- New visuals + new enemy variants in familiar structure
- Players feel progression through visual novelty

**The quality principle:** 10 well-designed levels > 50 mediocre levels. A memorable level teaches a mechanic, tests mastery, and delivers a moment. A filler level just exists.

## Content Anti-Patterns

**Filler content:**
- Content that pads game length without adding quality
- "Collect 100 feathers" quests, identical fetch quests, copy-paste environments
- Players can feel filler — it damages trust in the game
- Test: would the game be worse if this content were removed? If "about the same," it's filler

**Content gates blocking fun:**
- Don't gate the core experience behind unfun side content
- If players must grind boring content to reach the fun part, they'll quit before getting there
- The best content should be on the critical path, not hidden behind optional walls

**"Content is scope" underestimation:**
- Costs don't scale linearly — production fatigue, quality variance, testing burden
- Player falloff: statistically, most players won't see late-game content (only ~20% finish most games)
- Front-load your best content — don't save the best for last where few will see it

**Content treadmill:**
- Unsustainable cycle of producing content to retain players
- Relevant mainly for live-service, but indie devs fall into it too
- Plan for mechanics that don't require constant new content to remain engaging

**Over-relying on content to compensate for weak mechanics:**
- "Players will love the game once they reach world 3"
- If world 1 isn't fun, world 3 won't save it
- Content adds variety but cannot substitute for a fun core loop
- `(see antipatterns/catalog.md → Core Loop Neglect)`

**Premature content production:**
- Building levels before the core loop is proven fun
- Content built around mechanics that later change → wasted work
- Validate fun first, then produce content
- `(see antipatterns/catalog.md → Premature Content)`

## Content Sequencing in Development

**The content development sequence:**

1. **Validate core loop** — one room/level, programmer art, is it fun?
2. **Minimal content for playtesting** — 2-3 levels proving the loop works across contexts
3. **Tool investment decision** — hack content first, then build tools for what you actually need
4. **Content batching** — build and test in batches (5 levels), not all at once
5. **Polish pass** — iterate on existing content before making more

**Why batching matters:**
- Building 5 levels → playtesting → building 5 more catches problems early
- Building 30 levels → playtesting finds a systematic problem → 30 levels need fixing
- Batch size should match your playtest cadence `(see playtesting)`

**Tool investment timing:**
- First 3-5 levels: build by hand, learn what you actually need
- Levels 5-10: identify repetitive tasks, build tools for those specific tasks
- Levels 10+: tools should handle the repetitive parts, designers focus on creative parts
- Never build tools before you know what content you're making

**Sustainable content design:**
- Plan for mechanics that stay fun through repetition (core loop strength)
- Reuse systems: content should leverage existing mechanics in new combinations
- Avoid designing content that requires constant production to retain players
- A game that needs new content every month to stay fun has a core loop problem
