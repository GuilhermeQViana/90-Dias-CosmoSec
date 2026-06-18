# Anti-Pattern Catalog

## Scope Anti-Patterns

### Everything Sounds Fun

**What it looks like:** Brainstorming produces 30 great ideas. Every feature sounds exciting. The plan includes all of them because "they're all important."

**Why it happens:** Creative enthusiasm. In brainstorming, ideas feel weightless — there's no sense of the implementation cost. Every feature sounds like "just a day or two."

**The fix:**
1. Brainstorm freely (ideas are cheap)
2. Apply the 3-feature MLP rule ruthlessly
3. Keep a "parking lot" document for deferred ideas
4. Revisit the parking lot only AFTER MLP is fun and playable

### Feature Creep vs Future Creep vs Scope Creep

| Type | Definition | Example | Fix |
|------|-----------|---------|-----|
| **Feature Creep** | Adding new features mid-build | "Let's also add a crafting system" | Feature freeze after planning |
| **Future Creep** | Building for hypothetical future | "We'll need multiplayer someday, so architect for it now" | Build for today, refactor when needed |
| **Scope Creep** | Existing features growing in scope | "The inventory was 10 slots, now it needs sorting, filtering, categories..." | Define acceptance criteria upfront |

**Feature Creep signals:** "While we're building combat, we should also...", "Other [genre] games all have...", "This would only take a day to add"

**Future Creep signals:** "We should design the architecture to support...", "If we ever want to add multiplayer...", "Let's make this configurable in case..."

**Scope Creep signals:** Acceptance criteria changing after work begins, feature taking 3x estimated time, "It's almost done, just need to add..."

### Premature Content

**What it looks like:** Building 20 levels, 15 enemy types, and a full story before confirming the core loop is fun.

**The fix:** Prove fun with 1 handcrafted level and 1-2 enemy types. Only after mechanics stabilize, begin content production.

**Test:** If you have more content than your playtesters have tested, you've built too much.

## Design Anti-Patterns

### Design in Isolation

**What it looks like:** Extensive design documents and systems planned on paper without any prototype or playtesting.

**The fix:** Timebox planning to days, not weeks. Build a playable prototype within the first week. Let prototype results drive design iteration.

**Rule:** No design decision survives first contact with a playtester `(see playtesting)`.

### Juice Addiction

**What it looks like:** Core mechanics are mediocre, but heavy screen shake, particles, and sound effects make it feel impactful.

**Test:** Remove all screen shake, particles, and sound. Play for 10 minutes. Still fun? Loop is solid. Boring? Juice was hiding a problem.

### Kitchen Sink Design

**What it looks like:** "An open-world survival crafting RPG with tower defense elements and a card game battle system."

**The fix:** Pick your primary genre/mechanic. Add at most ONE secondary mechanic that amplifies it. Cut everything that doesn't serve a one-sentence description.

**Test:** "My game is [genre] where [core loop]." If you need commas and "with"s, it's too broad.

### GDD Tome

**What it looks like:** A 50+ page Game Design Document written before any code exists, treated as sacred scripture.

**The fix:** MLP scope: max 2-3 pages. Living document that evolves with playtesting. Use issues/beads for tracking, not monolithic docs.

## Timing Anti-Patterns

### Core Loop Neglect

**What it looks like:** Months of work on menus, save systems, settings, progression — but the core gameplay loop was never validated as fun.

**The fix:** First playable build = core loop only (no menus, no saves, no progression). Validate fun before building anything else.

**Priority order:** Core loop → game feel → content → progression → infrastructure → polish

### Second System Effect

**What it looks like:** Developer's second game project is massively over-scoped because "I know what I'm doing now."

**The fix:** Scope your second project like it's your first. Apply the 30% rule twice. Past experience means you'll build faster, not bigger.

### Narrative/Mechanics Disconnect

**What it looks like:** Story wants urgency ("Save the world!") but mechanics reward slow exploration. Narrative says "you're weak" but mechanics make you powerful.

**The fix:** Define the core player fantasy before designing narrative or mechanics. When in conflict, mechanics win — players experience what they DO, not what they're TOLD.
