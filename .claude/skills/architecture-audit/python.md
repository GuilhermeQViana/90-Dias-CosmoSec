# Python-Specific Architecture Patterns

Architecture patterns, best practices, and smells specific to Python game development.

## Game Loop Management

**Principle:** Python frameworks handle the loop differently. Know whether you own it or the framework does.

| Framework | Loop Ownership | Fixed Timestep |
|-----------|---------------|----------------|
| **Pygame** | You write it (`while running:`) | Manual: accumulator + `Clock.tick()` |
| **Arcade** | Framework owns it (override `on_update`) | Built-in delta time passed to `on_update(delta)` |
| **Pyglet** | Framework owns it (`pyglet.app.run()`) | `pyglet.clock.schedule_interval` for fixed step |
| **No framework** | You write everything | Full control, full responsibility |

**Common mistake (Pygame):** Using `clock.tick(60)` alone for timing. This caps framerate but doesn't provide fixed-step physics. Movement is still framerate-dependent unless you multiply by delta time or use an accumulator.

## Framework Decision

| Factor | Pygame | Arcade | Pyglet |
|--------|--------|--------|--------|
| Learning curve | Lowest (procedural) | Low (class-based) | Medium |
| Built-in physics | None | Basic (pymunk optional) | None |
| Sprite management | Manual (Groups) | Built-in (SpriteList, GPU-backed) | Built-in (Batch) |
| Performance ceiling | Low (CPU-bound blitting) | Higher (OpenGL, shader support) | Higher (OpenGL) |
| Best for | Prototypes, jams, learning | 2D games, education | Custom engines, multimedia |

**Rule:** Pygame for learning and jams. Arcade for serious 2D projects. Pyglet when you want low-level OpenGL control.

## Scene & Entity Organization

```
src/
├── main.py           # Entry point, window setup, scene manager
├── scenes/
│   ├── base.py       # Scene base class (enter, exit, update, draw)
│   ├── menu.py
│   ├── gameplay.py
│   └── game_over.py
├── entities/
│   ├── player.py
│   ├── enemy.py
│   └── projectile.py
├── systems/
│   ├── collision.py
│   ├── audio.py
│   └── input.py
└── data/
    ├── assets/
    └── config.py     # Constants, tuning values
```

**Sprite Groups (Pygame):** Use `pygame.sprite.Group` for batch update/draw and `groupcollide`/`spritecollide` for collision. Don't iterate raw lists.

**Scene stack pattern:** Push/pop scenes for layering (gameplay → pause menu → gameplay). Each scene has `enter()`, `exit()`, `update(dt)`, `draw(surface)`.

## Communication Patterns

| Pattern | Coupling | When |
|---------|----------|------|
| **Direct method calls** | Tight | Parent-child, same module |
| **Observer / event bus** | Loose | Cross-system events (player died, score changed) |
| **pygame.event custom events** | Loose (Pygame only) | `pygame.event.post(Event(ENEMY_DIED, data))` — uses Pygame's built-in queue |
| **Callback registration** | Loose | Simple pub/sub without a framework |

**Simple event bus:** A dictionary mapping event names to listener lists. `bus.emit("enemy_died", enemy)` calls all registered callbacks. ~20 lines, no dependency.

## Python Architecture Smells

| Smell | Why It's Bad | Fix |
|-------|-------------|-----|
| **Global mutable state** | `global score, player_health` scattered across modules | Encapsulate in a `GameState` class passed explicitly |
| **God class** | `Game` class with update, draw, input, collision, UI, audio | Extract systems: `CollisionSystem`, `AudioManager`, `InputHandler` |
| **Pixel operations in Python** | Per-pixel loops are catastrophically slow | numpy/surfarray for batch operations, or pre-render to surfaces |
| **Circular imports** | `player.py` imports `enemy.py` imports `player.py` | Use events/callbacks, or restructure with a mediator |
| **Magic numbers** | `if self.y > 768:` hardcoded everywhere | Constants module: `SCREEN_HEIGHT = 768` |
| **No delta time** | `self.x += 5` — speed tied to framerate | `self.x += self.speed * dt` everywhere |
| **Mutable default arguments** | `def __init__(self, inventory=[])` — shared across instances | `def __init__(self, inventory=None)` then `inventory = inventory or []` |

## Python Performance Patterns

| Concern | Problem | Solution |
|---------|---------|----------|
| **Per-pixel Python loops** | Iterating pixels in Python is ~1000x slower than C | Use `pygame.surfarray` / `numpy` for batch pixel ops |
| **Object creation in loop** | GC pressure from creating tuples, Rects, Surfaces per frame | Pre-allocate and reuse. Cache `Rect` objects |
| **String concatenation** | `"Score: " + str(score)` allocates every frame | Cache rendered text surfaces, update only on change |
| **Global lookups** | `math.sin` slower than local `sin = math.sin` | Bind frequently-used functions to locals in hot loops |
| **GIL constraint** | No true parallelism for CPU-bound work | Offload to numpy (releases GIL) or use multiprocessing for heavy computation |
| **Large sprite counts** | Pygame blitting is CPU-bound, scales poorly past ~500 sprites | Switch to Arcade (GPU-backed) or batch with `convert_alpha()` |

**`__slots__`:** Use on entity classes to reduce memory and speed up attribute access:
```python
class Bullet:
    __slots__ = ('x', 'y', 'dx', 'dy', 'active')
```

## State Management

| Pattern | When | Details |
|---------|------|---------|
| **Enum FSM** | Character states, simple game flow | `State = Enum('State', ['IDLE', 'RUNNING', 'JUMPING'])`. Switch on state in update |
| **Scene stack** | Game flow (menu → gameplay → pause) | Push/pop scenes. Top of stack gets update/draw calls |
| **Dictionary dispatch** | Many states with distinct handlers | `{State.IDLE: self.idle_update, State.RUNNING: self.run_update}[self.state](dt)` |
| **Dataclass snapshots** | Save/load, undo, replay | `@dataclass` for serializable state. `dataclasses.asdict()` for JSON serialization |
