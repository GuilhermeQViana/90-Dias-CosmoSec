# Playtest Questionnaire Frameworks & Templates

Validated instruments and ready-to-use question sets for structured playtest feedback.

## Validated Instruments

| Framework | Measures | Best For | Format |
|-----------|----------|----------|--------|
| **GEQ** (Game Experience Questionnaire) | Immersion, flow, competence, tension, challenge, negative/positive affect | Post-session emotional quality | 7-point Likert, 33 items (or 14-item core) |
| **PENS** (Player Experience of Need Satisfaction) | Competence, autonomy, relatedness, presence/immersion | WHY players find it satisfying (SDT-based) | Motivational diagnosis, 21 items |
| **GUESS-18** (Game User Experience Satisfaction Scale) | 9 subscales: usability, narratives, play engrossment, enjoyment, creative freedom, audio, personal gratification, social, visual aesthetics | Tracking satisfaction across builds | 18 items, validated across 450+ titles |
| **SUS** (System Usability Scale) | Single usability score (0-100) | Menu, HUD, inventory, settings usability | 10 items, score >68 = above average |
| **FFWWDD** | Frustrating, favorite, wanted, wand, doing, describe | Quick qualitative with 6 open-ended questions | 5 min, overlapping answers reveal priorities |

### When to Use Which

| Situation | Instrument |
|-----------|------------|
| "Is the core loop engaging?" | GEQ (flow + competence subscales) |
| "Why do players keep playing / stop playing?" | PENS (intrinsic motivation) |
| "How does build N compare to build N-1?" | GUESS-18 (consistent subscales across builds) |
| "Can players navigate the UI?" | SUS (quick, standardized) |
| "Quick pulse check after a playtest" | FFWWDD (5 minutes, zero prep) |

## Targeted Mini-Questionnaires

Templates for specific audit areas. Each set is 5-8 questions, takes under 5 minutes.

### Core Loop Engagement

1. How satisfying was the main action? (1-5)
2. Why? (open)
3. How strong was your desire to do "one more run/round/attempt"? (1-5)
4. When you received a reward, how much did it change what you did next? (1-5)
5. What was the most fun moment? (open)
6. What were you doing during the least fun moment? (open)

### Tutorial / Onboarding Clarity

1. How quickly did you understand what to do? (1-5)
2. At what point (if any) were you confused? (open)
3. Did you feel you needed more explanation or less? (more / about right / less)
4. How soon did you feel confident playing without guidance? (1-5)
5. What would you tell a friend to do first? (open)

### Difficulty Perception

1. How challenging was the experience? (1=trivial, 5=impossible)
2. How fair did the difficulty feel? (1=unfair, 5=very fair)
3. When you failed, did you understand why? (1-5)
4. When you failed, did you want to try again? (1-5)
5. Was there a specific moment that felt too easy or too hard? (open)

### Economy Fairness

1. How satisfying was earning resources? (1-5)
2. Did spending decisions feel meaningful? (1-5)
3. Did you ever feel stuck because you lacked resources? (never / once / often)
4. Did you ever stockpile resources because nothing was worth buying? (never / once / often)
5. What would you save up for? (open)

### UI/UX Usability

1. Could you find the information you needed? (1-5)
2. Was text/icons readable and clear? (1-5)
3. Did the game respond to your inputs as expected? (1-5)
4. Did you accidentally trigger something you didn't intend? (never / once / often)
5. What part of the interface frustrated you? (open)

### Overall Satisfaction

1. How likely are you to recommend this to a friend? (0-10, NPS-style)
2. What one thing would you change? (open)
3. What one thing should NOT change? (open)
4. In one sentence, how would you describe this game? (open)

## Question Design Rules

### Do

- Use **Likert scales** (5 or 7 point) for tracking across builds — consistent, comparable
- Ask the **rating FIRST**, then "why?" — number anchors the response, open-ended explains it
- Use **forced choice** for prioritization — "Which mattered more: X or Y?"
- Limit to **10-15 questions** (5-10 minutes max) — fatigue destroys data quality
- Use **consistent scale direction** throughout — always 1=low, 5=high

### Don't

- **Leading questions**: "Wasn't the combat exciting?" → "How would you describe the combat?"
- **Double-barreled**: "Was the game fun and easy to learn?" → Split into two questions
- **Yes/No only**: "Did you like it?" → "How much did you enjoy it? (1-5)"
- **"Would you buy this?"**: Hypothetical purchase intent is unreliable — observe behavior instead
- **Asking for solutions**: "What feature should we add?" → "What frustrated you?" (players diagnose problems well, prescribe solutions poorly)
- **More than 15 questions**: Fatigue kicks in, later answers degrade

### FFWWDD Deep Dive

Six questions, asked in this specific order. Overlap between answers reveals true priorities.

1. **Frustrating** — "What was the most frustrating thing?" (captures pain points while memory is fresh)
2. **Favorite** — "What was your favorite moment?" (captures delight)
3. **Wanted** — "What did you want to do that you couldn't?" (expectation gaps)
4. **Wand** — "If you had a magic wand, what one thing would you change?" (forces prioritization)
5. **Doing** — "What were you actually doing most of the time?" (reveals true gameplay vs intended)
6. **Describe** — "How would you describe this game to a friend?" (player's mental model of your game)

**Analysis tip:** When the same theme appears in 3+ answers from one player, it's their top priority. When the same theme appears across 3+ players, it's a pattern worth acting on.
