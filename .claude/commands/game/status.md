---
description: Show session state, progress, and design decisions
argument-hint: [slug] [--decisions [filter]]
allowed-tools: Read, Glob, Grep
---

## Summary

**Session status dashboard — show phase, progress, coverage, and decisions.** Read-only inspection of the active game design session.

**Arguments:** `$ARGUMENTS` (optional)
- Session slug to inspect (defaults to most recently updated session)
- `--decisions` — show full decision log instead of dashboard
- `--decisions <filter>` — filter decisions by category, phase, or origin

**Output:** Session dashboard (default) or full decision log (with `--decisions`).

---

## Process

### Step 1: Find Active Session

```
Glob(pattern=".game-design/sessions.yaml")
```

**If `.game-design/sessions.yaml` does not exist:**

```
NO ACTIVE SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No game design sessions found.

Get started: /game:start
```

**Stop here.**

**If `.game-design/sessions.yaml` exists:**

```
Read(file_path=".game-design/sessions.yaml")
```

Check if the `sessions` list has entries. If the list is empty:

```
NO ACTIVE SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session index exists but contains no sessions.

Get started: /game:start
```

**Stop here.**

### Step 2: Select Session

**If `$ARGUMENTS` is provided and non-empty**, find the session with that slug in the sessions list.

If no session matches the slug:

```
SESSION NOT FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No session with slug "<slug>".

Available sessions:
  - <slug-1>: <title-1> (<phase>)
  - <slug-2>: <title-2> (<phase>)

Usage: /game:status <slug>
```

**Stop here.**

**If no argument is provided**, use the most recently updated session (sort by `updated` descending, pick the first).

### Step 3: Load Session State

```
Read(file_path=".game-design/<slug>/state.yaml")
```

If the file does not exist or is unreadable:

```
SESSION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<slug>" exists in the index but state.yaml is missing.

Options:
  - Re-initialize: /game:start
  - Check directory: .game-design/<slug>/
```

**Stop here.**

### Step 4: Load Decisions Log

```
Read(file_path=".game-design/<slug>/decisions.log")
```

Parse the pipe-delimited log (header row: `id|date|phase|category|origin|decision|rationale|alternatives`).

- Count total data rows (excluding the header)
- Extract the last 3 decisions (most recent by row order)

If the file does not exist or contains only the header, set decision count to 0 and note "no decisions logged yet."

### Step 5: Check for Concept

```
Glob(pattern=".game-design/<slug>/concept.yaml")
```

If `concept.yaml` exists:

```
Read(file_path=".game-design/<slug>/concept.yaml")
```

Extract: `genre`, `subgenre`, `core_loop`, `scope.target`, `scope.engine`, `pitch`.

### Step 6: Present Status

Output the status dashboard:

**Standard output (session with concept):**

```
SESSION STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<title>
Phase: <phase>
Created: <created>  |  Updated: <updated>

───────────────────────────────────────────
CONCEPT
───────────────────────────────────────────

Genre: <genre> (<subgenre>)
Core loop: <core_loop>
Scope: <scope.target> / <scope.engine>
Pitch: <pitch>

───────────────────────────────────────────
PROGRESS
───────────────────────────────────────────

Simulation: <turn_count> turns, <beats_covered>/<beats_total> beats covered
  (omit this section if turn_count is 0)

Decisions: <decisions.total> logged (<by_origin breakdown>)

───────────────────────────────────────────
COVERAGE
───────────────────────────────────────────

  First Contact ........... <status>    # coverage.first_contact
  Learning the Verb ....... <status>    # coverage.learning_the_verb
  Core Loop in Motion ..... <status>    # coverage.core_loop_in_motion
  Rising Stakes ........... <status>    # coverage.rising_stakes
  Session End ............. <status>    # coverage.session_end

  (omit this section if all values are "uncovered")

───────────────────────────────────────────
RECENT DECISIONS
───────────────────────────────────────────

  [<id>] <decision> (<category>, <origin>)
  [<id>] <decision> (<category>, <origin>)
  [<id>] <decision> (<category>, <origin>)

  (omit this section if no decisions logged)

───────────────────────────────────────────
FLAGS
───────────────────────────────────────────

  Concept complete: <yes/no>
  Simulation ready: <yes/no>
  Plan ready: <yes/no>

───────────────────────────────────────────

Next phase: /game:<phase>
```

**Session without concept (early brainstorm):**

```
SESSION STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<title>
Phase: brainstorm
Created: <created>  |  Updated: <updated>

───────────────────────────────────────────
CONCEPT
───────────────────────────────────────────

Not yet defined. Run /game:brainstorm to develop the concept.

───────────────────────────────────────────
PROGRESS
───────────────────────────────────────────

Decisions: <decisions.total> logged (<by_origin breakdown>)

───────────────────────────────────────────
FLAGS
───────────────────────────────────────────

  Concept complete: no
  Simulation ready: no
  Plan ready: no

───────────────────────────────────────────

Next phase: /game:brainstorm
```

**Completed session:**

```
SESSION STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<title>
Phase: complete ✓
Created: <created>  |  Updated: <updated>

<concept and progress sections as above>

───────────────────────────────────────────

This session has completed all phases.
Outputs are in: .game-design/<slug>/

Options:
  - Start a new session: /game:start
  - Review outputs in .game-design/<slug>/
```

**Multiple sessions available (no argument provided):**

Append after the status dashboard:

```
───────────────────────────────────────────
OTHER SESSIONS
───────────────────────────────────────────

  <slug-2>: <title-2> (<phase>) — updated <date>
  <slug-3>: <title-3> (<phase>) — updated <date>

View another: /game:status <slug>
```

Only show this section if there are 2+ sessions. List up to 4 other sessions, sorted by `updated` descending.

## Decisions View (--decisions)

If `$ARGUMENTS` contains `--decisions`, skip the dashboard and show the full decision log instead. Steps 1-2 (find session, load state) remain the same.

### Parse and Filter

Load `.game-design/<slug>/decisions.log` (pipe-delimited, header: `id|date|phase|category|origin|decision|rationale|alternatives`).

If a filter word follows `--decisions`, determine the field:
- **Phase values:** `brainstorm`, `simulate`, `build-plan`
- **Origin values:** `user`, `suggested`, `inferred`
- **Category:** anything else (e.g., `genre`, `mechanics`, `core_loop`)

Filter rows by the matching field (case-insensitive).

**If no decisions exist or filter matches nothing:**

```
NO DECISIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<If no log: "No design decisions logged yet. Decisions are recorded during brainstorm and simulation.">
<If filter matched nothing: "No decisions matching '<filter>'. Available categories: <list>">
```

### Present Decision Table

Mark provenance: `suggested` and `inferred` origins get prefixed on the decision text.

```
DECISIONS<if filtered: " — <filter>">
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session: <title>
<If filtered: "Showing <filtered_count> of <total_count> decisions">

  ID   │ Date       │ Category    │ Origin    │ Decision                        │ Rationale
  ─────┼────────────┼─────────────┼───────────┼─────────────────────────────────┼──────────────────
  ...

SUMMARY
───────────────────────────────────────────
Total: <count>  By origin: user <n>, suggested <n>, inferred <n>
By category: <category>: <count>, ...
```

If >50% of decisions are AI-proposed (suggested + inferred), append:

```
⚠ <pct>% of decisions were AI-proposed. Review during playtesting.
```

## Error Handling

**If state.yaml has missing or unexpected fields:**

Read what's available and show it. For missing fields, display "—" instead of failing. Note which fields are missing at the bottom:

```
STATE WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Some state fields are missing: <list>
Consider re-initializing: /game:start
```

## Example Usage

```
/game:status                           # Show most recently updated session
/game:status dungeon-crawler           # Show specific session by slug
/game:status --decisions               # Full decision log
/game:status --decisions mechanics     # Filter by category
/game:status --decisions suggested     # Filter by origin
```
