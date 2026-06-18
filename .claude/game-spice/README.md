# Game Spice

Game design spice for [Line Cook](https://github.com/smileynet/line-cook) — MLP scoping, core loop frameworks, economy design, difficulty curves, content planning, mechanics palette, playtesting methodology, scenario walkthroughs, planning anti-patterns, and architecture auditing.

## Quick Start

After [installing Line Cook](https://github.com/smileynet/line-cook#installation):

```bash
/plugin marketplace add smileynet/line-cook
/plugin install game@line-cook
/line:mise                                    # Plan a game
```

> **New here?** See the [tutorial](docs/tutorial.md) for a complete walkthrough planning a roguelike dungeon crawler.

Update: `/plugin update game`

## What It Looks Like

Here's a brainstorming session with game-spice active. The skills inject game-specific questions and frameworks automatically:

```
You: I want to make a roguelike dungeon crawler.

Claude: Let's explore that! First, some questions to shape the concept:

**What aesthetic are you targeting?**                     ← design-frameworks
MDA gives us 8 aesthetics. For a roguelike, the primary
candidates are Challenge, Discovery, and Sensation.
Which 1-2 resonate most?

You: Challenge and Discovery.

Claude: Good combo. Now let's nail the core loop:

**Can you describe your core loop in one sentence?**     ← scoping
Format: "Player [verbs] to [goal], earning [reward]
that enables [reinvestment]."

You: Player explores rooms to find loot, earning gear
     that enables deeper dungeon runs.

Claude: That's a clean loop. Let's browse mechanics
that could make exploration feel distinct:

**What movement style fits your vision?**                ← mechanics-palette
From the palette: grid-based, free movement,
auto-runner, teleport, grapple/swing...
Grid-based is classic roguelike. Free movement
opens real-time combat options.

You: Grid-based, turn-based.

Claude: Classic choice. For the economy:

**How complex should the resource system be?**           ← economy-design
┌─────────────────┬─────────────────────────────────┐
│ None            │ Pure action, no currency         │
│ Single resource │ Gold only — simple, clear        │
│ Dual currency   │ Gold + XP — spend vs grow        │
│ Full economy    │ Multiple interacting resources    │
└─────────────────┴─────────────────────────────────┘
For an MLP roguelike, dual currency is the sweet spot.
```

Each question comes from a different skill, but they flow as a natural conversation. Game-spice doesn't change what Line Cook does — it changes what Claude *knows to ask about* during planning.

## When to Use

**Use game-spice when:**
- Planning a new game project with `/line:mise`
- Scoping an MLP and need to cut features ruthlessly
- Designing core loops, economies, or difficulty curves
- Implementing game systems (game loop, state machines, input handling)
- Reviewing game code for architecture issues
- Running `/game:walkthrough` to visualize player experience
- Auditing your plan for anti-patterns, completeness, or architecture issues

**Skip it when:**
- Building non-game software (game-spice only adds game concepts)
- Working on a game engine or tooling project (not game design)

## Interactive Game Design

Game-spice includes an interactive design workflow that takes you from idea to implementation plan through structured conversation. Each phase builds on the previous one, with persistent state tracking and decision provenance throughout.

```
/game:start → /game:brainstorm → /game:simulate → /game:build-plan
    │              │                    │                  │
    │              │                    │                  └─ Design brief (or --full GDD)
    │              │                    └─ Wizard of Oz playtest
    │              └─ Concept definition
    └─ Session creation
```

Start a session, brainstorm your concept through natural conversation, prove the core loop works with an interactive simulation, then generate a design brief (or full GDD with `--full`). Use `/game:status` to check progress and `/game:status --decisions` to review the decision trail.

`/game:walkthrough` is a complementary tool — use it at any stage to stress-test your design by narrating the player experience.

## Commands

### Interactive Design Workflow

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/game:start` | Start a new session or resume an existing one | Beginning a new game design |
| `/game:brainstorm` | Explore and define a game concept through conversation | Turning an idea into a structured concept |
| `/game:simulate` | Run a Wizard of Oz gameplay simulation with ASCII wireframes | Proving the core loop works before coding |
| `/game:build-plan` | Generate a design brief (or `--full` for GDD + tech spec) | Turning design into implementation documents |
| `/game:status` | Show session state, progress, and decisions (`--decisions`) | Checking where you are in the workflow |
| `/game:walkthrough` | Generate a structured 5-beat scenario walkthrough | Visualize player experience before building |
| `/game:help` | Command reference and workflow overview | Quick orientation |

## Agents

| Agent | Description |
|-------|-------------|
| **game-reviewer** | Game-specific architecture review during `/line:serve`. Detects game engine/framework, applies an 8-category health scorecard, and flags game-specific smells (physics in render loops, missing delta time, god update functions, per-frame allocations). |

## What's Inside

| Skill | Activates During | Key Topics |
|-------|-------------------|------------|
| **scoping** | `/scope`, MLP planning | MLP vs MVP, 3-feature rule, tracer bullets, MoSCoW, 30% rule |
| **design-frameworks** | `/brainstorm`, idea exploration | MDA framework, core loops, player motivation, systems thinking |
| **mechanics-palette** | `/brainstorm`, mechanic selection | 54 mechanics in 10 categories, mashup patterns, guided exploration |
| **economy-design** | `/brainstorm`, `/scope` | Taps & sinks, currency tiers, progression curves, genre patterns |
| **difficulty-design** | `/scope`, challenge design | Flow state, difficulty curves, accessibility, recovery mechanics |
| **content-planning** | `/scope`, world structure | World structure, pacing, procedural vs handcrafted, content reuse |
| **playtesting** | `/scope`, plan review | 3-question framework, MVPt, build-test-learn, pivot decisions |
| **scenario-walkthrough** | `/scope`, `/finalize` | 5-beat template, input/feedback mapping, experience narration |
| **antipatterns** | Plan review, scope audits | Top 10 anti-patterns, over-scoped rubric, pre/post-planning audits |
| **plan-audit** | `/plan-audit`, plan review | Plan completeness, GDD quality, scope scoring, economy/difficulty/playtest readiness |
| **architecture-audit** | `/architecture-audit` | Game loop, state machines, entity architecture, performance, Godot, Rust/Bevy, Unity, Unreal, Python, TypeScript patterns |
| **implementation** | `/line:cook`, coding game systems | Game loop setup, state management, input handling, frame budget, entity architecture, delta time |
| **ascii-wireframing** | `/game:simulate`, wireframe creation | Box-drawing toolkit, common primitives, genre-specific starter patterns, legend.yaml conventions |
| **simulation-guide** | `/game:simulate`, gameplay simulation | Facilitator stance, turn structure, coverage pacing, scope control, decision recording |

14 skills, 7 commands, 1 agent.

## How It Works

Game-spice has two layers: **interactive commands** (`/game:*`) that guide you through game design, and **passive skills** that enrich Line Cook phases with game knowledge. Skills load automatically — no configuration needed. They activate during `/brainstorm`, `/scope`, `/plan-audit`, `/architecture-audit`, `/line:cook`, and `/line:serve` based on context.

Skills can activate in multiple phases — `economy-design` appears in both brainstorm and scope because resource decisions start broad and get concrete. Audit skills include engine-specific sub-files loaded on demand when Godot, Rust/Bevy, Unity, Unreal, Python, or TypeScript context is detected.

## FAQ

**Do I need to configure anything?**
No. Install the plugin and plan a game. Skills activate automatically based on what you're discussing. There's no config file, no setup step.

**Does game-spice work without Line Cook?**
The skills are designed for Line Cook's `/mise` workflow (brainstorm → scope → finalize). Without Line Cook, Claude won't have the planning commands that trigger these skills.

**What about non-standard genres?**
The frameworks are genre-agnostic. MDA, core loops, difficulty curves, and economy design apply to any game — the genre-specific examples just help illustrate the concepts. The mechanics palette covers 10 categories spanning most game types.

**MLP vs MVP — what's the difference?**
MVP (minimum viable product) asks "what's the least we can ship?" MLP (minimum lovable product) asks "what's the least that's *worth playing*?" Games need to be fun, not just functional. Game-spice uses MLP throughout because a game that works but isn't fun has failed.

**Does game-spice only work during planning?**
No. Skills activate throughout the development cycle: planning (`/mise`), implementation (`/line:cook`), review (`/line:serve`), and auditing (`/plan-audit`, `/architecture-audit`). Commands like `/game:walkthrough` are available on demand.

## Learn More

- [Tutorial](docs/tutorial.md) — Plan a roguelike dungeon crawler from scratch
- [Line Cook Tutorial](https://github.com/smileynet/line-cook/blob/main/docs/tutorial-claude-code.md) — Full workflow walkthrough
- [Changelog](CHANGELOG.md) — Version history

## Local Development

```bash
/plugin marketplace add /path/to/game-spice
```

## Requirements

- Claude Code >= 1.0.33
- [Line Cook](https://github.com/smileynet/line-cook) plugin (for mise workflow integration)

## License

MIT
