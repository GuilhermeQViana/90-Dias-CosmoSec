# Rust/Bevy ECS Architecture Patterns

Architecture patterns, best practices, and antipatterns specific to Rust with Bevy engine.

## ECS Best Practices

### Component Design

| Principle | Do | Don't |
|-----------|-----|-------|
| **Small, focused components** | `struct Health(f32)`, `struct Speed(f32)` | `struct PlayerData { health, speed, name, inventory, ... }` |
| **Marker components** | `struct Player;` → `With<Player>` for query filtering | Storing a `player: bool` field on a shared component |
| **Newtype wrappers** | `struct Damage(f32)` distinct from `struct Health(f32)` | Using bare `f32` for everything |
| **Derive essentials** | `#[derive(Component, Debug)]` on every component | Missing `Debug` (makes inspector/logging useless) |

### System Design

- **Do NOT query for bundle types** — Bundles are spawn-time conveniences, not query targets. Query individual components.
- **Use `Changed<T>` and `Added<T>`** — Reactive systems instead of checking every frame. Only runs when data actually changes.
- **All Update systems need run conditions** — Bind to `State` + `SystemSet` to prevent running during wrong states (menu, pause, loading).
- **Keep systems small** — One responsibility per system. If a system has >4 query parameters, split it.

## Plugin Architecture

**One plugin per subsystem.** `main.rs` is a list of `.add_plugins()` with no game logic.

```
src/
├── main.rs              # App::new() + plugin list only
├── player/
│   ├── mod.rs           # PlayerPlugin
│   ├── components.rs    # Player, Health, Inventory
│   ├── systems.rs       # movement, combat, interaction
│   └── events.rs        # PlayerDamaged, PlayerDied
├── enemy/
│   ├── mod.rs           # EnemyPlugin
│   └── ...
├── audio/
│   ├── mod.rs           # AudioPlugin
│   └── ...
└── ui/
    ├── mod.rs           # UiPlugin
    └── ...
```

**Co-locate `OnEnter` and `OnExit`** for each state in the same place. Don't scatter setup and teardown across files.

## Resource vs Component Decision

| Use Resource | Use Component |
|-------------|---------------|
| Exactly one global instance | Multiple instances possible |
| Not entity-associated (settings, config, caches) | Composes with other entity data |
| Rarely changes | Changes per-entity |
| Shared read-heavy data | Entity-specific mutable data |

**Even singletons like "the player" should be components**, not resources. Use a marker component (`struct Player;`) and query `Query<&Transform, With<Player>>`. This keeps player data in the ECS world where it composes with other systems.

## System Ordering

| Method | When to Use |
|--------|-------------|
| **Unspecified** (default) | When order doesn't matter — maximizes parallelism |
| **`.before()` / `.after()`** | Specific pair ordering (input before movement) |
| **`.chain()`** | Strict sequence for a small group |
| **`SystemSet`** | Coarse-grained subsystem ordering (Input → Logic → Physics → Render) |
| **`apply_deferred`** | When commands from one system must be visible to the next |

**Default to unspecified.** Only add ordering constraints when you observe incorrect behavior. Over-ordering kills parallelism.

## Bevy Antipatterns

| Antipattern | Why It's Bad | Fix |
|-------------|-------------|-----|
| **Bare `Entity` IDs for persistent data** | Invalid after despawn, no safety net | Custom ID types + lookup map, or `Name` component |
| **Unbounded systems** | Systems without state run conditions run during ALL states | Add `.run_if(in_state(GameState::Playing))` |
| **Unordered event readers/writers** | Reader before writer misses events that frame | Order writer `.before()` reader |
| **Scattered cleanup** | Despawn logic spread across systems | Use `StateScoped` components or marker + cleanup system |
| **Forgetting `Name` components** | Debugging is dramatically harder | `Name::new("Player")` on important entities |
| **Overusing `Commands` in hot path** | Each command is deferred, batching overhead | Batch spawning, use direct world access where possible |
| **Too many query parameters (>4)** | System does too much, hard to test | Split into multiple focused systems |
| **`Query<&mut T>` when `&T` suffices** | Causes unnecessary borrow contention, blocks parallelism | Use `&T` for read-only access |
| **Giant startup system** | One system spawns everything | Separate systems per subsystem, ordered if needed |
| **Panicking on query miss** | `.single()` panics if count ≠ 1 | Use `.get_single()` with error handling |

## Bevy Performance

| Technique | When | Details |
|-----------|------|---------|
| **Query filters (`With<T>`, `Without<T>`)** | Always | Narrows iteration to relevant entities, skips irrelevant archetypes |
| **`SparseSet` storage** | Components added/removed frequently | `#[component(storage = "SparseSet")]` — faster add/remove, slower iteration |
| **`Table` storage** (default) | Components iterated frequently | Default — fast iteration, slower add/remove |
| **`Local<T>`** | System-local state (cooldowns, counters) | Avoids `Resource` overhead for per-system data |
| **Parallel iteration** | Large entity counts | `par_iter()` on queries for data-parallel work |
| **Change detection** | Expensive per-entity work | `Changed<T>` to only process entities that actually changed |

### Storage Decision

| | Iterated Often | Iterated Rarely |
|---|---|---|
| **Added/Removed Often** | SparseSet | SparseSet |
| **Added/Removed Rarely** | Table (default) | Either (doesn't matter) |

## State Management in Bevy

Use Bevy's built-in `States` for high-level game states:

| State | Purpose |
|-------|---------|
| `Loading` | Asset loading, splash screen |
| `Menu` | Main menu, settings |
| `Playing` | Active gameplay |
| `Paused` | Gameplay frozen, pause menu visible |

**Substates** for finer-grained control within `Playing` (e.g., `Exploring`, `Combat`, `Dialogue`).

**Cleanup pattern:** Use `StateScoped` to automatically despawn entities when leaving a state. No manual cleanup needed.
