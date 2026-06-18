# Difficulty Design Depth

## Difficulty Curve Guidelines

**Sawtooth pattern (most versatile):**
- Each "tooth" introduces one new challenge element
- Breather sections let players consolidate skills
- Boss encounters test mastery of recent skills
- Each peak is slightly higher than the last
- Breathers should still involve gameplay — low intensity, not zero intensity

**Sine wave combination:**
- Overlay intensity waves on top of a gradually rising baseline
- Creates a rhythm: tense → release → tense → release
- Works especially well for narrative-driven games where story pacing matters
- Each wave crest should introduce something new, not just repeat harder

**Common mistakes:**
- Difficulty spike with no new skill to learn (frustrating)
- Long plateaus with no challenge growth (boring)
- Multiple new mechanics introduced simultaneously (overwhelming)
- Difficulty that requires content knowledge, not skill (unfair)
- Late-game difficulty that only increases numbers, not complexity

## Recovery Design Guidelines

**Choosing recovery type:**
- Match recovery to your target aesthetic
- Mastery games → harsh recovery (run restart) because repeated attempts ARE the gameplay
- Accessibility-focused → gentle recovery (instant respawn, rewind)
- Narrative-focused → soft fail (story continues but changes)

**Recovery as difficulty tuning:**
- Generous checkpoints make hard games more accessible WITHOUT reducing challenge
- Celeste is extremely difficult but feels fair because respawn is instant
- Dark Souls is moderate difficulty but FEELS harder because corpse runs add time-loss anxiety

**Common mistakes:**
- Checkpoint too far from challenge (player replays easy section repeatedly)
- Permadeath without enough run variety (same early game every time)
- No recovery information — player doesn't know what they lost or how to avoid it

**MLP guidance:** Choose one recovery type and commit. Don't implement multiple recovery systems for MLP — that's scope creep.

## Boss Design Principles

**Beat structure for boss encounters:**

1. **Introduce** — boss shows its primary pattern in a safe/low-stakes way
2. **Escalate** — pattern speeds up or combines with secondary mechanic
3. **Breather** — brief low-intensity phase (boss vulnerable, reposition)
4. **Climax** — hardest phase, all patterns combine, tests everything learned

**Bosses test recently taught skills:**
- A boss after a section teaching wall-jumps should require wall-jumps
- If a boss requires a skill the game hasn't taught, it's unfair
- Boss as "exam" — confirms the player has mastered the current skill set before introducing new ones

**Planning implications:**
- Boss count = pacing decision (how often do you want dramatic peaks?)
- Each boss needs design time, art assets, testing → significant scope per boss
- MLP: 0-1 bosses. One well-designed boss > three rushed ones
- Bosses with multiple phases multiply scope — keep MLP bosses to 2 phases max

**Budget guidance:**

| Boss Complexity | Design Time | Art/Animation | Testing | Total |
|----------------|------------|--------------|---------|-------|
| Single-phase, value-variant | 1 day | Existing assets | 1 day | 2 days |
| Two-phase, unique patterns | 2-3 days | New animations | 2 days | 5-7 days |
| Multi-phase, cinematic | 1 week+ | Significant assets | 3+ days | 2+ weeks |
