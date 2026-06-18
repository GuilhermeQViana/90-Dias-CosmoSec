# MoSCoW Prioritization & Scope Management

## MoSCoW Prioritization for Games

Adapted from standard MoSCoW with game-specific criteria.

### Must Have (MLP-blocking)
- Core loop mechanics
- One complete path from start to "one more round"
- Minimum feedback (player knows what happened)
- Win/loss or progress/regress state

### Should Have (First update after MLP)
- 2-3 content variations (enemy types, level layouts)
- Basic progression (something carries over between sessions)
- Audio feedback for core actions
- Pause/resume

### Could Have (Polish phase)
- Settings menu
- Multiple difficulty levels
- Achievements/unlocks
- Detailed tutorial

### Won't Have (Not this project phase)
- Multiplayer (unless it IS the core loop)
- Level editor
- Mod support
- Localization

## Scope Management

### The 30% Rule

Whatever scope you think the MLP needs, cut 30%. Then you're close to right.

**Why:** First-time scoping for games is always optimistic because:
- "Simple" mechanics have hidden complexity (collision, edge cases, feel)
- Fun requires iteration time you didn't budget for
- Integration between systems takes longer than building them separately
- Playtest feedback will change your priorities

### Ruthless Cutting Heuristics

Ask these questions about every feature. If any answer is "yes," cut it.

| Question | If Yes → Cut |
|----------|-------------|
| Can the core loop function without this? | Cut |
| Is this adding content rather than mechanics? | Defer |
| Does this require a new system/architecture? | Cut from MLP |
| Am I adding this because other games have it? | Cut |
| Would a player miss this in a 5-minute playtest? | If no → Cut |
| Does this feature serve MY game's core loop? | If no → Cut |

### Scope Creep Signals

Watch for these during planning:

- "While we're at it, we could also..." → Stop. Separate issue.
- "This would only take a day" → It won't. Defer it.
- "Players expect this in [genre]" → Maybe. After MLP.
- Feature list growing between planning sessions → Freeze and re-evaluate.
- Excitement about a feature unrelated to core loop → Parking lot it.
- "We need this for the trailer/demo" → Marketing scope ≠ MLP scope.
