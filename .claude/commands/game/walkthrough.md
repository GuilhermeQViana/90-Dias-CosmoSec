---
description: Generate a structured 5-beat scenario walkthrough to visualize the player experience before building
argument-hint: [name]
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion
---

## Summary

**Interactive 5-beat scenario walkthrough generator.** Produces a planning artifact that narrates the player experience from launch to session end.

**Arguments:** `$ARGUMENTS` (optional) - Name for the walkthrough (used in output filename)

**Output:** `docs/planning/walkthrough-<name>.md`

---

## Process

### Step 1: Gather Context

**Determine walkthrough name:**

If `$ARGUMENTS` is provided, use it as the walkthrough name.

Otherwise, ask:
```
AskUserQuestion(questions=[{
  question: "What should we name this walkthrough? (used in the filename, e.g. 'dungeon-crawler' → walkthrough-dungeon-crawler.md)",
  header: "Name",
  options: [
    {label: "game-mlp", description: "Generic MLP walkthrough"},
    {label: "prototype", description: "Early prototype walkthrough"}
  ],
  multiSelect: false
}])
```

**Load existing planning context:**

Search for relevant planning documents in the project:

```
Glob(pattern="docs/planning/**/*.md")
Glob(pattern="docs/planning/**/*.yaml")
Glob(pattern="**/brainstorm*.md", path="docs/")
```

Read any found documents to understand:
- What game is being designed
- Core loop definition (if any)
- Feature list or scope decisions
- Economy or difficulty plans
- Any prior walkthroughs

Also read the walkthrough skill knowledge for reference:
```
Read(file_path=".claude/skills/scenario-walkthrough/template.md")
Read(file_path=".claude/skills/scenario-walkthrough/SKILL.md")
```

**Summarize context found:**
```
WALKTHROUGH: <name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Planning context loaded:
  - <list of documents found and key details>

Starting 5-beat walkthrough. Each beat asks you to narrate
a specific moment in the player's experience.
```

If no planning context is found, note this and proceed — the walkthrough can still be created from scratch.

### Step 2: Beat 1 — First Contact

Ask the user to narrate the first 10 seconds of the player experience:

```
AskUserQuestion(questions=[{
  question: "Beat 1: First Contact — The player launches the game. What happens in the first 10 seconds? Describe: what appears on screen, time to first input, and the first moment of agency (first choice they make).",
  header: "Beat 1",
  options: [
    {label: "Straight to gameplay", description: "No menu — player is immediately in the game world with something to do"},
    {label: "Minimal menu", description: "Brief title/start screen, then quickly into gameplay"},
    {label: "Character setup", description: "Player makes a choice (character, loadout, name) before gameplay begins"}
  ],
  multiSelect: false
}])
```

After the user responds, ask a follow-up to get specific detail:

```
AskUserQuestion(questions=[{
  question: "Now narrate it moment by moment: What does the player SEE on screen? What is the FIRST thing they can DO? What happens when they do it?",
  header: "Detail",
  options: [
    {label: "I'll describe it", description: "Let me write out the moment-by-moment experience"},
    {label: "Help me narrate", description: "I have the idea but need help making it concrete and specific"}
  ],
  multiSelect: false
}])
```

If the user chooses "Help me narrate," use the planning context to draft a first-contact narration and present it for their approval/editing.

**Anti-pattern check:** If the response is too abstract (mentions "the player has fun" or "the player explores" without specifics), gently prompt: "Can you describe what's actually on screen? What buttons/keys does the player press? What do they see in response?"

Record the beat content.

### Step 3: Beat 2 — Learning the Verb

Ask the user how the core mechanic is discovered:

```
AskUserQuestion(questions=[{
  question: "Beat 2: Learning the Verb — How does the player discover what they can do? Describe: how the core mechanic is introduced (show don't tell), the first time they use it successfully, and the feedback they receive.",
  header: "Beat 2",
  options: [
    {label: "Environmental teaching", description: "Level design guides the player to discover the mechanic naturally"},
    {label: "Contextual prompt", description: "A subtle UI hint appears when the mechanic is relevant"},
    {label: "Forced encounter", description: "Player must use the mechanic to progress past an early obstacle"}
  ],
  multiSelect: false
}])
```

Follow up for specific narration:

```
AskUserQuestion(questions=[{
  question: "Narrate the discovery: What situation makes the player TRY the mechanic? What do they see/hear when it works? Could a player discover this without text instructions?",
  header: "Detail",
  options: [
    {label: "I'll describe it", description: "Let me write the discovery moment"},
    {label: "Help me narrate", description: "I know the mechanic but need help with the discovery flow"}
  ],
  multiSelect: false
}])
```

**Anti-pattern check:** If the response includes tooltips or explicit text instructions as the primary teaching method, note: "Consider: could this be taught through level design instead? The best onboarding lets players discover mechanics through play."

Record the beat content.

### Step 4: Beat 3 — Core Loop in Motion

Ask the user to narrate 2-3 complete cycles of the core loop:

```
AskUserQuestion(questions=[{
  question: "Beat 3: Core Loop in Motion — Narrate 2-3 complete cycles of the core gameplay loop. For each cycle describe: what the player decides to do (Action), what input they give and what they see (Execution), what changes in the game (Outcome), and how that feeds the next cycle (Reinvestment).",
  header: "Beat 3",
  options: [
    {label: "I'll narrate cycles", description: "Let me describe 2-3 loop cycles in detail"},
    {label: "Help me structure", description: "I know the loop but need help breaking it into Action → Execution → Outcome → Reinvestment"}
  ],
  multiSelect: false
}])
```

After the core loop narration, collect the input/feedback mapping:

```
AskUserQuestion(questions=[{
  question: "Now let's map player inputs to feedback. For each core action the player performs, what is: the Player Intent (what they want to do), Input (key/button), Visual Feedback (what they see), Audio Feedback (what they hear), and State Change (what changes in the game)?",
  header: "Input/Feedback Map",
  options: [
    {label: "I'll fill in the table", description: "Let me provide the mapping for each action"},
    {label: "Help from context", description: "Use my planning docs to draft the mapping, I'll refine it"}
  ],
  multiSelect: false
}])
```

**Anti-pattern check:** If all cycles read identically, note: "Each loop cycle should feel slightly different from the last. What varies between cycles? New enemies, harder terrain, different resources?"

Record the beat content and input/feedback mapping table.

### Step 5: Beat 4 — Rising Stakes

Ask the user about challenge and failure:

```
AskUserQuestion(questions=[{
  question: "Beat 4: Rising Stakes — How does the player first encounter real challenge? Describe: what changes to make it harder, the first time the player FAILS (what do they see?), how they recover, and what they learn from failure.",
  header: "Beat 4",
  options: [
    {label: "Difficulty ramp", description: "Existing mechanics get harder (faster, more complex, less forgiving)"},
    {label: "New obstacle type", description: "A new challenge is introduced that requires adapting the core mechanic"},
    {label: "Resource pressure", description: "Scarcity or time pressure forces harder decisions"}
  ],
  multiSelect: false
}])
```

Follow up on the failure experience:

```
AskUserQuestion(questions=[{
  question: "Narrate the failure: What does the player see when they fail? Do they understand WHY they failed? How do they get back into the action (respawn, restart, lose progress)?",
  header: "Failure",
  options: [
    {label: "I'll describe it", description: "Let me narrate the failure and recovery"},
    {label: "Help me design", description: "I haven't figured out failure/recovery yet — help me think through it"}
  ],
  multiSelect: false
}])
```

**Anti-pattern check:** If the response skips failure entirely (only happy path), note: "Every game needs a failure state. If the player can't fail, there's no challenge. What happens when they make a mistake?"

Record the beat content.

### Step 6: Beat 5 — Session End

Ask about the end of a play session:

```
AskUserQuestion(questions=[{
  question: "Beat 5: Session End — What makes the player want to play again? Describe: what triggers a natural session end (death, level complete, time), what the player sees (score, progress, unlock, teaser), and the 'one more round' hook.",
  header: "Beat 5",
  options: [
    {label: "Score/mastery", description: "Player wants to beat their score or improve their skill"},
    {label: "Progression unlock", description: "Player sees new content or abilities they haven't tried yet"},
    {label: "Narrative pull", description: "Story or mystery draws them back to find out what happens next"},
    {label: "Social/competitive", description: "Leaderboards, sharing, or competing with others"}
  ],
  multiSelect: false
}])
```

Follow up on the replay hook:

```
AskUserQuestion(questions=[{
  question: "If you stopped playing here, would you open the game again tomorrow? Why? What carries over between sessions (if anything)?",
  header: "Hook",
  options: [
    {label: "I'll describe the hook", description: "Let me explain what pulls them back"},
    {label: "Help me find the hook", description: "I'm not sure what the replay motivation is yet"}
  ],
  multiSelect: false
}])
```

Record the beat content.

### Step 7: Anti-Pattern Review

Before writing the artifact, review the full walkthrough against the anti-pattern checklist:

| Anti-Pattern | Check |
|---|---|
| **Too abstract** | Does every beat describe specific actions and feedback? |
| **Too technical** | Does it describe what the player SEES, not implementation? |
| **Skipping failure** | Is Beat 4 present with a real failure scenario? |
| **Feature listing** | Are mechanics introduced one at a time through narration? |
| **Emotion prescribing** | Does it describe what happens, not how the player "feels"? |
| **Missing inputs** | Is the input/feedback mapping table filled in for core actions? |

Also verify the MLP Scenario Checklist:
- [ ] First 30 seconds described
- [ ] First failure described
- [ ] Complete core loop cycle narrated
- [ ] Every input method mentioned at least once
- [ ] A reason to replay or continue is present at session end
- [ ] No beat says "the player has fun" — describe what they DO, not how they feel

If any issues are found, note them in the output artifact under a "Review Notes" section.

### Step 8: Write Artifact

**Check output directory:**
```
Glob(pattern="docs/planning/")
```

If `docs/planning/` does not exist, create it by writing the artifact directly (the Write tool creates parent directories).

**Check for existing walkthrough:**
```
Glob(pattern="docs/planning/walkthrough-<name>.md")
```

If a walkthrough with this name already exists, ask the user:
```
AskUserQuestion(questions=[{
  question: "A walkthrough named '<name>' already exists. What should we do?",
  header: "Conflict",
  options: [
    {label: "Overwrite", description: "Replace the existing walkthrough with this new one"},
    {label: "Rename", description: "Save with a different name (e.g. walkthrough-<name>-v2.md)"}
  ],
  multiSelect: false
}])
```

**Write the artifact:**
```
Write(file_path="docs/planning/walkthrough-<name>.md", content=<assembled walkthrough>)
```

**Artifact format:**

```markdown
# Scenario Walkthrough: <Name>

> Generated by /game:walkthrough on <date>

## Planning Context

<Summary of planning documents referenced, or "Created from scratch — no prior planning documents found.">

---

## Beat 1: First Contact
*What does the player experience in the first 10 seconds?*

<User's narration for Beat 1>

---

## Beat 2: Learning the Verb
*How does the player discover the core mechanic?*

<User's narration for Beat 2>

---

## Beat 3: Core Loop in Motion
*What does a full gameplay loop feel like?*

<User's narration for Beat 3, including 2-3 cycle descriptions>

---

## Beat 4: Rising Stakes
*How does the player encounter challenge and failure?*

<User's narration for Beat 4>

---

## Beat 5: Session End
*What makes the player want to play again?*

<User's narration for Beat 5>

---

## Input/Feedback Mapping

| Player Intent | Input | Visual Feedback | Audio Feedback | State Change |
|---|---|---|---|---|
| <intent> | <input> | <visual> | <audio> | <state change> |
| ... | ... | ... | ... | ... |

---

## MLP Scenario Checklist

- [x/] First 30 seconds described
- [x/] First failure described
- [x/] Complete core loop cycle narrated
- [x/] Every input method mentioned at least once
- [x/] A reason to replay or continue is present at session end
- [x/] No beat says "the player has fun" — describe what they DO, not how they feel

## Review Notes

<Any anti-pattern issues found, or "No anti-pattern issues detected.">
```

### Step 9: Output Summary

```
╔════════════════════════════════════════════════════╗
║  WALKTHROUGH COMPLETE                              ║
╚════════════════════════════════════════════════════╝

Artifact: docs/planning/walkthrough-<name>.md

Beats: 5/5 complete
Input/Feedback Mapping: <count> actions mapped
Anti-Pattern Check: <pass/issues found>

MLP Scenario Checklist:
  [✓] First 30 seconds described
  [✓] First failure described
  [✓] Complete core loop cycle narrated
  [✓] Every input method mentioned
  [✓] Replay motivation present
  [✓] No emotion prescribing

Next steps:
  - Review and refine the walkthrough
  - Use it as a testable artifact for playtesting
  - Reference during /line:cook for implementation guidance
```
