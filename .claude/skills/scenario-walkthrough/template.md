# 5-Beat Walkthrough Template

## Beat 1: First Contact

**Prompt:** The player launches the game. What happens?

Narrate:
- What appears on screen (title? game world? character select?)
- Time to first input (how quickly can they DO something?)
- First moment of agency (what's the first choice they make?)

**Good example:** "The screen shows a dark forest. A character stands at the left edge. No menu, no text. The player presses right arrow — the character walks. They see a gap ahead."

**Bad example:** "The main menu loads with Play, Settings, and Credits buttons. Player clicks Play and watches a cutscene."

**Principle:** Minimize time between launch and first player action. Every second of non-interaction is a second they might quit.

## Beat 2: Learning the Verb

**Prompt:** How does the player discover what they can do?

Narrate:
- How the core mechanic is introduced (show, don't tell)
- The first time they use it successfully
- The feedback they receive (what do they see/hear?)

**Key question:** Could a player discover this without text instructions? `(see design-frameworks → Game Feel, Juice & Onboarding)`

**Good example:** "The gap is too wide to walk across. The player notices the character's legs bend slightly near edges. They press space — the character jumps. They clear the gap. A subtle chime plays."

**Bad example:** "A tooltip says 'Press SPACE to jump.' Player presses space."

## Beat 3: The Core Loop in Motion

**Prompt:** Narrate 2-3 complete cycles of the core loop.

For each cycle, describe:
- **Action:** What does the player decide to do?
- **Execution:** What input do they give? What do they see?
- **Outcome:** What changes in the game state?
- **Reinvestment:** How does the outcome feed back into the next action?

`(see design-frameworks → Core Loop Design)` for loop structure theory.

**Key question:** Does each cycle feel slightly different from the last? If all 3 cycles read identically, the loop lacks variation.

**Input/feedback mapping:** Fill in the mapping table for every new input introduced in this beat.

## Beat 4: Rising Stakes

**Prompt:** How does the player first encounter real challenge?

Narrate:
- What changes to make the game harder (new obstacle, faster enemies, resource scarcity)
- The first time the player fails — what do they see? `(see difficulty-design → Flow State & Difficulty)`
- How they recover (respawn? restart? lose progress?)
- What they learn from failure (skill growth signal)

**Key question:** Does the player understand WHY they failed? If failure feels random, it's frustrating. If it feels like "I should have done X," it's motivating.

## Beat 5: Session End

**Prompt:** What makes the player want to play again?

Narrate:
- The moment a natural session end occurs (death, level complete, time limit)
- What the player sees (score? progress? unlock? teaser?)
- The "one more round" hook — what pulls them back in?
- What carries over between sessions (if anything)

**Key question:** If you stopped playing here, would you open the game again tomorrow? Why?

**MLP note:** For MLP, the hook can be simple — "I want to beat my score" or "I want to see if I can clear that section." Progression systems come later `(see scoping → Post-MLP Iteration Phases)`.

## Visual Snapshot Prompts

At any point in the walkthrough, you can add a **visual snapshot** to increase specificity:

- **"What is on screen right now?"** — Describe layout: player character position, UI elements, environment features, enemy positions
- **"What are the player's options?"** — List every action available to the player at this moment
- **"What draws their eye?"** — What is the most visually prominent element? Does it guide them correctly?
- **"What information does the player have?"** — Health, score, resources, objective — what do they know?

**Use snapshots when:** A beat feels too abstract. If you can't visualize the screen, the designer hasn't decided enough yet.

## Walkthrough Anti-Patterns

| Anti-Pattern | Example | Fix |
|---|---|---|
| **Too abstract** | "The player has fun exploring" | Describe specific actions and feedback |
| **Too technical** | "The sprite renderer instantiates a prefab" | Describe what the player SEES, not implementation |
| **Skipping failure** | Only narrating the happy path | Add Beat 4 — how does failure work? |
| **Feature listing** | "The player can jump, attack, dash, and wall-climb" | Narrate them discovering ONE mechanic at a time |
| **Emotion prescribing** | "The player feels excited and engaged" | Describe what happens; let the emotion follow |
| **Missing inputs** | Describing what happens without HOW the player causes it | Fill in the input/feedback mapping table |
