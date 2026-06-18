---
description: Start a new game design session or resume an existing one
argument-hint: [title]
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Skill
---

## Summary

**Session lifecycle — start new or resume existing game design sessions.** Entry point for the game-spice design workflow.

**Arguments:** `$ARGUMENTS` (optional) - Working title for a new session (skips the title prompt)

**Output:** Initialized session directory with state.yaml and decisions.log, then chains to the appropriate phase command.

---

## Process

### Step 1: Check for Existing Sessions

```
Glob(pattern=".game-design/sessions.yaml")
```

**If `.game-design/sessions.yaml` exists:**

```
Read(file_path=".game-design/sessions.yaml")
```

Check if the `sessions` list has entries. If it does, go to Step 2 (offer new or resume). If the list is empty, go to Step 3 (new session).

**If `.game-design/sessions.yaml` does not exist:**

Go to Step 3 (new session — directory will be created).

### Step 2: New or Resume

Present the choice to the user. Show existing sessions with their phase and last-updated date.

Build the session list from the YAML:

```
AskUserQuestion(questions=[{
  question: "Start a new game design session or resume an existing one?",
  header: "Session",
  options: [
    {label: "New session", description: "Start a fresh game design from scratch"},
    {label: "<session-1-title>", description: "<phase> — last updated <date>"},
    {label: "<session-2-title>", description: "<phase> — last updated <date>"}
  ],
  multiSelect: false
}])
```

List up to 3 most recently updated sessions as options (sorted by `updated` descending). If there are more than 3 sessions, use the 3 most recent and note how many others exist.

**If the user picks "New session":** Go to Step 3.
**If the user picks an existing session:** Go to Step 5 (resume flow).

### Step 3: Get Working Title

**If `$ARGUMENTS` is provided and non-empty**, use it as the working title.

**Otherwise**, ask:

```
AskUserQuestion(questions=[{
  question: "What's the working title for your game? (This is just a name for the session — you can change it later.)",
  header: "Title",
  options: [
    {label: "I'll type one", description: "Enter a custom working title"}
  ],
  multiSelect: false
}])
```

The user will almost always choose "Other" and type a title.

### Step 4: Create New Session

**4a: Slugify the title**

Convert the working title to a URL-safe slug:
- Lowercase the title
- Replace spaces and non-alphanumeric characters (except hyphens) with hyphens
- Collapse multiple hyphens into one
- Trim leading/trailing hyphens

Example: "Dungeon Crawler Roguelike" → `dungeon-crawler-roguelike`

```bash
date -u +%Y-%m-%d
```

Store the current date for `created` and `updated` fields.

**4b: Check for slug collision**

```
Glob(pattern=".game-design/<slug>/state.yaml")
```

If a session with this slug already exists, append a number: `<slug>-2`, `<slug>-3`, etc.

**4c: Read templates**

```
Read(file_path=".claude/game-spice/templates/session-state.yaml")
Read(file_path=".claude/game-spice/templates/sessions-index.yaml")
```

**4d: Write session files**

Create the session directory and initialize files:

**state.yaml** — Copy from template, filling in:
- `slug`: the generated slug
- `title`: the user's working title
- `created`: today's date
- `updated`: today's date
- All other fields keep their template defaults

```
Write(file_path=".game-design/<slug>/state.yaml", content=<populated state template>)
```

**decisions.log** — Empty log with header row:

```
Write(file_path=".game-design/<slug>/decisions.log", content="id|date|phase|category|origin|decision|rationale|alternatives\n")
```

**4e: Update sessions index**

**If `.game-design/sessions.yaml` exists:**

```
Read(file_path=".game-design/sessions.yaml")
```

Append the new session entry to the `sessions` list.

**If `.game-design/sessions.yaml` does not exist:**

Create it from the template with the new session as the first entry.

Write the updated index:

```
Write(file_path=".game-design/sessions.yaml", content=<updated sessions index>)
```

Each session entry in the list:
```yaml
- slug: "<slug>"
  title: "<working title>"
  phase: "brainstorm"
  created: "<date>"
  updated: "<date>"
```

**4f: Confirm creation**

```
NEW SESSION CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: <working title>
Slug: <slug>
Directory: .game-design/<slug>/

Files created:
  .game-design/<slug>/state.yaml
  .game-design/<slug>/decisions.log
  .game-design/sessions.yaml (created or updated)

Chaining to /game:brainstorm...
```

**Chain to brainstorm:**

```
Skill(skill="game:brainstorm")
```

**Stop here** — brainstorm takes over.

### Step 5: Resume Existing Session

**5a: Load session state**

Use the slug from the selected session:

```
Read(file_path=".game-design/<slug>/state.yaml")
```

**5b: Present session summary**

```
RESUMING SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: <title>
Phase: <phase>
Created: <created>
Last updated: <updated>

Progress:
  Simulation: <turn_count> turns, <beats_covered>/<beats_total> beats covered
              (omit this line if turn_count is 0 — simulation has not started)
  Decisions: <decisions.total> logged

Flags:
  Concept complete: <yes/no>
  Simulation ready: <yes/no>
  Plan ready: <yes/no>
```

If the session has a concept.yaml, also show:
```
Read(file_path=".game-design/<slug>/concept.yaml")
```

And add to the summary:
```
Concept:
  Genre: <genre> (<subgenre>)
  Core loop: <core_loop>
  Scope: <scope.target> / <scope.engine>
```

**5c: Update session timestamp**

Update the `updated` field in state.yaml to today's date.

Also update the `updated` field in the matching sessions.yaml entry.

**5d: Chain to active phase**

Map the current phase to its command:

| Phase | Command |
|-------|---------|
| `brainstorm` | `/game:brainstorm` |
| `simulate` | `/game:simulate` |
| `build-plan` | `/game:build-plan` |
| `complete` | No chain — session is finished |

**If phase is `complete`:**

```
This session has completed all phases. All outputs have been generated.

Options:
  - Start a new session: /game:start
  - Review outputs in .game-design/<slug>/
```

**Stop here** — do not chain.

**Otherwise, chain to the phase command:**

```
Chaining to /game:<phase>...
```

```
Skill(skill="game:<phase>")
```

**Stop here** — the phase command takes over.

## Error Handling

**If template files are missing:**

```
TEMPLATE ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing: .claude/game-spice/templates/session-state.yaml
The game-spice plugin may not be fully installed.

Run: Check that the game-spice plugin is installed in your project.
```

**If session state.yaml is corrupted or missing fields:**

```
SESSION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session "<slug>" has a corrupted state file.
Missing fields: <list>

Options:
  1. Re-initialize from template (keeps existing files, resets state)
  2. Start a new session instead
```

## Example Usage

```
/game:start                    # Interactive — asks new or resume
/game:start Dungeon Crawler    # Creates session with title "Dungeon Crawler"
```
