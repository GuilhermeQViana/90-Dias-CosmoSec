---
name: architecture-audit
description: Game-specific code architecture auditing. Use when auditing game code architecture, reviewing game loop patterns, evaluating game state management, assessing frame budget, checking entity architecture, input handling, or running architecture-audit on a game project. Covers game loop timing, state machines, ECS patterns, performance smells, technical debt timing.
---

# Game Architecture Audit

Audit game code architecture for correctness, performance, and maintainability. Catches game-specific patterns that generic code audits miss.

## Quick Reference

### Game Architecture Health Scorecard

| Category | Healthy | Warning | Critical |
|----------|---------|---------|----------|
| **Game Loop** | Fixed update + variable render | Variable delta time | Physics in render loop |
| **State Management** | FSM or state pattern | Boolean flags (≤3) | Boolean combinatorial explosion |
| **Input Handling** | Action mapping layer | Direct key checks with remapping | Hardcoded key checks in gameplay |
| **Entity Architecture** | Components/ECS appropriate to scale | Mild inheritance (≤3 deep) | Deep inheritance or god objects |
| **Resource Management** | Object pooling for hot paths | Occasional allocation in loops | `new`/`malloc` every frame |
| **Frame Budget** | Measured, within target | Unmeasured but seems fine | Visible frame drops, no profiling |
| **Scene Organization** | Subsystem separation, clear ownership | Some coupling between subsystems | Monolithic scene, spaghetti refs |
| **Build/Deploy** | Automated, reproducible | Manual but documented | "Works on my machine" |

## Game Loop Patterns

**The correct answer for most games: Fixed Update with Variable Rendering** `(see implementation → Game Loop Setup for the accumulator pattern and code)`.

### Audit Smells

| Smell | What's Wrong | Fix |
|-------|-------------|-----|
| **Physics in render loop** | Physics in `_process`/`Update`/render callback | Move to `_physics_process`/`FixedUpdate` |
| **No delta time** | Hardcoded `position += 5` | Multiply by delta: `position += speed * delta` |
| **God update function** | Single `update()` >100 lines | Extract subsystems with single responsibilities |
| **Missing state guards** | Game logic runs during pause/menu | Check game state before processing |
| **Spiral of Death** | Uncapped accumulator, physics falls behind | Cap max accumulated time (e.g., 0.25s) |

## Architecture Health Checklist

- [ ] Game loop uses fixed update for physics, variable for rendering
- [ ] No physics or movement code in render/draw callbacks
- [ ] State management uses FSM or state pattern (no boolean flag explosion)
- [ ] Input goes through a mapping/action layer (not raw key checks)
- [ ] No allocations in per-frame hot paths
- [ ] Entity architecture matches project scale (not over- or under-engineered)
- [ ] Scene/node organization has clear subsystem boundaries
- [ ] Technical debt is intentional and scheduled for payoff
- [ ] Frame budget is measured, not assumed

## Deep Dives

- `(see architecture-audit/detailed-audits.md for State Management, Entity Architecture, Input Handling, Performance Smells, Game-Specific Technical Debt)`

## Engine-Specific Patterns

Engine-agnostic principles above apply everywhere. For engine-specific guidance:

- `(see architecture-audit/godot.md for Godot/GDScript scene tree, signals, and process patterns)`
- `(see architecture-audit/rust.md for Rust/Bevy ECS, plugin architecture, and system ordering)`
- `(see architecture-audit/unity.md for Unity/C# MonoBehaviour lifecycle, ScriptableObjects, and component architecture)`
- `(see architecture-audit/unreal.md for Unreal/C++ Actor model, Gameplay Framework, and Blueprint vs C++ patterns)`
- `(see architecture-audit/python.md for Python/Pygame game loop management, sprite groups, and performance constraints)`
- `(see architecture-audit/typescript.md for TypeScript/Phaser browser game patterns, asset loading, and typed event systems)`

## See Also

- **plan-audit** — Plan-level audit (companion to code architecture audit) `(see plan-audit)`
- **scoping** — MLP scope determines acceptable technical debt levels `(see scoping)`
- **antipatterns** — Design anti-patterns that manifest as architecture problems `(see antipatterns)`
- **design-frameworks** — Systems thinking for architecture decisions `(see design-frameworks)`
- **playtesting** — Playtest methodology for validating architecture decisions `(see playtesting)`
