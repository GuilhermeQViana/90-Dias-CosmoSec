---
description: Show available game design commands and workflow overview
argument-hint:
allowed-tools: Read
---

## Summary

**Command reference for the game-spice plugin.** Lists all commands, shows the design workflow, and provides a quick start example.

**Arguments:** None

**Output:** Static reference displayed to the user.

---

## Process

### Step 1: Display Reference

Display the following reference to the user:

```
GAME-SPICE COMMAND REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Interactive game design tools for Claude Code.
Plan, brainstorm, simulate, and build — all from the CLI.

───────────────────────────────────────────
WORKFLOW
───────────────────────────────────────────

  /game:start ─→ /game:brainstorm ─→ /game:simulate ─→ /game:build-plan
       │              │                    │                   │
   Create or      Explore ideas,      Play through the    Generate GDD
   resume a       define concept,     core loop in        and tech spec
   design         log decisions       ASCII turns         from session
   session                                                 data

  Each command chains to the next automatically.
  Use /game:status at any time to check progress.

───────────────────────────────────────────
COMMANDS
───────────────────────────────────────────

  Session Lifecycle:
    /game:start [title]       Start a new session or resume an existing one
    /game:brainstorm          Explore ideas, define concept, log decisions
    /game:simulate            Play through the core loop in ASCII turns
    /game:build-plan          Generate design brief (or --full for GDD + tech spec)
    /game:status [slug]       Show session progress, coverage, and decisions

  Utilities:
    /game:help                Show this reference

  Standalone (works outside sessions):
    /game:walkthrough [name]  Generate a 5-beat scenario walkthrough

───────────────────────────────────────────
QUICK START
───────────────────────────────────────────

  1. Start a session:
       /game:start Dungeon Crawler

  2. Brainstorm the concept — answer questions about genre,
     core loop, mechanics, and scope. Decisions are logged
     automatically.

  3. Simulate the core loop — play through turns in ASCII,
     testing mechanics before writing code.

  4. Build the plan — generate a GDD and tech spec ready
     for implementation with /line:cook.

  Check progress any time:
       /game:status
       /game:status --decisions

  Run a walkthrough any time:
       /game:walkthrough first-session

───────────────────────────────────────────
SKILLS (PASSIVE)
───────────────────────────────────────────

  Game-spice also includes 14 skills that activate automatically
  during Line Cook phases (/line:brainstorm, /line:scope, /line:cook,
  /line:serve). No commands needed — they inject game-specific
  frameworks and questions into the conversation.

  See the README for the full skill list.

───────────────────────────────────────────

  Docs: /game:help | README.md | docs/tutorial.md
```
