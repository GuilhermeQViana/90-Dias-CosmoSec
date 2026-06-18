---
name: implementation
description: Game-specific coding guidance during implementation. Use when implementing game code, coding game mechanics, building game loop, setting up state machine, game architecture during development, writing game systems, structuring game update logic, or adding game input handling. Covers game loop setup, state management, input handling, frame budget, entity architecture, delta time.
---

# Game Implementation Guide

Prescriptive patterns for building game systems correctly from the start. Follow these defaults unless you have a measured reason to diverge.

## Quick Reference

| Area | Default Pattern | Upgrade When |
|------|----------------|-------------|
| **Game Loop** | Fixed update + variable render | Never (this is the correct answer) |
| **State Management** | Enum + switch FSM | States > 4: hierarchical FSM |
| **Input Handling** | Action mapping layer | Day 1 (no upgrade, start here) |
| **Frame Budget** | Measure first, optimize second | Profiler shows a bottleneck |
| **Entity Architecture** | Composition / components | Entity count > ~100: consider ECS |
| **Delta Time** | Every movement * delta | Never skip this |

## Game Loop Setup

**Build this: fixed update with variable rendering.**

The accumulator pattern decouples physics from framerate. Physics runs at a fixed rate. Rendering interpolates between physics states.

```
FIXED_TIMESTEP = 1.0 / 60.0  # Physics rate
accumulator = 0.0

while running:
    frame_time = clock.get_delta()
    accumulator += min(frame_time, 0.25)  # Cap to prevent spiral of death

    while accumulator >= FIXED_TIMESTEP:
        update_physics(FIXED_TIMESTEP)     # Fixed step, deterministic
        accumulator -= FIXED_TIMESTEP

    alpha = accumulator / FIXED_TIMESTEP
    render(alpha)                           # Interpolate for smooth display
```

**Key decisions:**
- Physics in the fixed update loop, rendering in the variable loop — never the reverse
- Cap accumulated time (0.25s) to prevent the spiral of death when frames drop
- Interpolate render state using `alpha` for smooth visuals between physics ticks
- Use `FIXED_TIMESTEP` as your single constant — don't pass `delta` to physics

`(see architecture-audit → Game Loop Patterns)`

## State Management

**Build this: enum + switch FSM from the start. Replace boolean flags immediately.**

Boolean flags (`is_jumping`, `is_ducking`, `is_firing`) create combinatorial explosion. Every new flag doubles possible states. Most combinations are invalid.

```
enum State { IDLE, RUNNING, JUMPING, FALLING, DEAD }

current_state = State.IDLE

func update(delta):
    match current_state:
        State.IDLE:
            if input.move: transition(State.RUNNING)
            if input.jump: transition(State.JUMPING)
        State.JUMPING:
            if velocity.y < 0: transition(State.FALLING)
        State.FALLING:
            if on_ground: transition(State.IDLE)
        State.DEAD:
            pass  # No transitions out

func transition(new_state):
    exit_state(current_state)
    current_state = new_state
    enter_state(new_state)
```

**Key decisions:**
- Start with enum + switch — it handles most games through completion
- Upgrade to hierarchical FSM when states exceed 4 and share transitions
- Use pushdown automata for "do this, then return" (pause menu, firing while running)
- Concurrent FSMs for orthogonal concerns (armed/unarmed x standing/jumping)
- Every state change goes through `transition()` — never set the enum directly

`(see architecture-audit/detailed-audits.md for State Management)`

## Input Handling

**Build this: an action mapping layer from day 1. Never check raw keys in gameplay code.**

Three layers, always:

| Layer | Responsibility |
|-------|---------------|
| **Raw Input** | Hardware signals — keyboard events, gamepad axes |
| **Mapping** | Translates to named actions, supports remapping |
| **Action** | Game systems consume actions with buffering |

```
# Mapping layer (configure once)
input_map = {
    "jump": [Key.SPACE, Gamepad.A],
    "move_left": [Key.A, Key.LEFT, Gamepad.LEFT_STICK_LEFT],
    "fire": [Key.F, Gamepad.RIGHT_TRIGGER],
}

# Action layer (game code reads this)
if actions.just_pressed("jump"):
    player.jump()
```

**Key decisions:**
- Gameplay code references action names ("jump"), never raw keys (Key.SPACE)
- Buffer inputs for 0.1-0.2s to prevent dropped inputs and improve game feel
- Filter actions by game state — no player input during cutscenes or pause
- This enables remapping, gamepad support, accessibility, and replay for free

`(see architecture-audit/detailed-audits.md for Input Handling)`

## Frame Budget

**Measure before optimizing. No per-frame allocations. Know your budget.**

| Target | Budget per Frame | Typical Split |
|--------|-----------------|--------------|
| 30 FPS | 33ms | ~10ms logic, ~10ms physics, ~13ms render |
| 60 FPS | 16.6ms | ~5ms logic, ~5ms physics, ~6.6ms render |

**Key decisions:**
- Profile first — never optimize without measurement
- Zero allocations in per-frame hot paths (no `new`/`malloc` in update loops)
- Use object pooling for frequently spawned/despawned entities (bullets, particles)
- Watch for O(n^2) patterns: nested entity loops need spatial partitioning
- String comparisons in tight loops are slow — use enums or integer IDs
- If you haven't profiled, your performance is "unknown", not "fine"

**Common frame budget violations:**

| Violation | Fix |
|-----------|-----|
| `new` / `malloc` in update loop | Pre-allocate, use object pools |
| Nested entity collision loops | Add spatial partitioning (grid, quadtree) |
| String type checks per frame | Use enum or integer IDs |
| Unbounded entity spawning | Pool with fixed max, recycle oldest |

`(see architecture-audit/detailed-audits.md for Performance Smells)`

## Entity Architecture

**Build this: composition first. Switch to ECS when entity count justifies it.**

| Scale | Pattern | Why |
|-------|---------|-----|
| < ~100 entities | Component-based composition | Simple, fits scene-graph engines |
| > ~100 entities, perf-critical | ECS (Bevy, EnTT, etc.) | Cache-friendly, scales linearly |
| < 10 entity types, no runtime flex | Inheritance (max 3 deep) | Acceptable only at tiny scale |

```
# Composition: attach behaviors as components
entity = Entity()
entity.add(PositionComponent(x=0, y=0))
entity.add(VelocityComponent(speed=200))
entity.add(SpriteComponent(texture="player.png"))
entity.add(HealthComponent(max_hp=100))
```

**Key decisions:**
- Favor composition over inheritance from the start
- Inheritance hierarchies deeper than 3 levels are a smell — flatten to components
- Components communicate through signals/events, not direct references
- One entity, one scene file — keep files under 500 lines
- God objects (>10 responsibilities) must be decomposed immediately

`(see architecture-audit/detailed-audits.md for Entity Architecture)`

## Delta Time

**Every movement value multiplied by delta. Speed expressed in units-per-second.**

```
# WRONG: framerate-dependent movement
position.x += 5

# RIGHT: framerate-independent movement
speed = 300  # units per second
position.x += speed * delta
```

**Key decisions:**
- Every position change, velocity update, and timer tick uses `delta`
- Express speeds in units-per-second for readable, tunable values
- In the fixed update loop, use `FIXED_TIMESTEP` instead of `delta`
- Animations and timers also need delta — not just movement
- Test at different framerates (30, 60, 144) to verify independence

**Common delta time mistakes:**

| Mistake | Symptom | Fix |
|---------|---------|-----|
| `position += 5` | Game speed changes with framerate | `position += speed * delta` |
| Speed as "pixels per frame" | Inconsistent on different hardware | Speed as "units per second" |
| Timer using frame count | Timer speed varies with FPS | Timer using elapsed seconds |

**Note:** In fixed update loops, do NOT multiply by delta — use the `FIXED_TIMESTEP` constant directly. This is correct behavior, not a bug.

## See Also

- **architecture-audit** — Audit existing code against these patterns `(see architecture-audit → Architecture Health Checklist)`
- **antipatterns** — Design mistakes that lead to bad architecture `(see antipatterns)`
- **scoping** — Scope determines acceptable shortcuts `(see scoping → MLP Scoping Process)`
