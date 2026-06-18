# Godot-Specific Architecture Patterns

Architecture patterns, best practices, and smells specific to Godot Engine and GDScript.

## Scene Tree Organization

**Principle:** Each subsystem gets its own branch. Use parent-child only when removing parent should remove children.

Every game needs a `Main` root node as the bird's-eye view of subsystems:

```
Main
├── World           # Game world, levels, entities
│   ├── Player
│   ├── Enemies
│   └── Environment
├── UI              # All UI layers
│   ├── HUD
│   ├── PauseMenu
│   └── DialogBox
├── Systems         # Game systems (autoload alternative)
│   ├── AudioManager
│   └── CameraRig
└── Debug           # Development tools (remove for release)
```

**Why separate UI from World:** UI should never be a child of game world nodes — camera movement, zoom, and scene transitions shouldn't affect UI positioning.

## "Call Down, Signal Up" Pattern

The foundational communication pattern in Godot:

| Direction | Method | When |
|-----------|--------|------|
| **Parent → Child** (calling down) | `get_node()` or direct method call | Parent owns children — safe to reference |
| **Child → Parent/Sibling** (signaling up) | Signals | Preserves loose coupling, scene reusability |
| **Sibling → Sibling** | Signal bus (autoload) or parent mediates | Siblings shouldn't know about each other |

**Antipattern:** `get_node("../../SomeDistantSibling")` — fragile, breaks on tree changes, prevents scene reuse. If you need this path, the architecture needs restructuring.

**Signal bus pattern:** One autoload (`Events` or `SignalBus`) that declares global signals. Emitters and listeners connect through the bus without knowing about each other.

## `_process` vs `_physics_process`

| Use `_physics_process(delta)` | Use `_process(delta)` |
|-------------------------------|----------------------|
| Movement and collision | Animations and VFX |
| Physics (gravity, forces, velocity) | Input polling (non-physics responses) |
| Anything requiring deterministic fixed-step timing | UI updates |
| Network-synced state | Camera smoothing (interpolation) |

**Common mistake:** Movement in `_process` → framerate-dependent speed. Player moves faster at 144 FPS than 60 FPS, even with delta time, because collision detection runs at different rates.

## Autoload Patterns

### Good Autoloads

| Autoload | Purpose |
|----------|---------|
| **GameManager** | Game state (playing, paused, menu), scene transitions |
| **AudioManager** | Music crossfading, SFX pooling (persists across scenes) |
| **SaveManager** | Save/load interface |
| **SignalBus** | Global signal declarations for decoupled communication |

### Autoload Antipatterns

| Antipattern | Problem | Fix |
|-------------|---------|-----|
| **Giant Autoload** | Everything in one singleton (god object) | Split by responsibility |
| **Mutable Global State** | Autoload data modified from arbitrary scenes | Explicit setter methods with validation |
| **Autoload for Shared Data** | Using autoload when you just need shared data | Use `Resource` instead — saveable, inspectable, no singleton |

### Resources as Data Containers

Use `Resource` subclasses (`.tres` files) for shared data that can be saved, loaded, and inspected in the editor. Better than autoloads when you don't need behavior, just data.

## GDScript vs C# Decision

| Factor | GDScript | C# |
|--------|----------|-----|
| Prototyping speed | Faster (no boilerplate) | Slower setup |
| Type safety | Optional (with annotations) | Strong |
| Large codebase | Manageable with discipline | Interfaces, generics help |
| Web export | Supported | Not supported |
| GDExtension access | Full | Cannot call GDExtensions |
| .NET ecosystem | Not available | NuGet packages, etc. |

**Mixing rule:** If mixing GDScript and C#, draw a clear boundary. GDScript for Godot-heavy scripting (scene interaction, signals, UI). C# for architecturally complex systems (state machines, AI, networking). Don't cross-call frequently — use signals at the boundary.

## Godot Performance Patterns

| Pattern | When | Details |
|---------|------|---------|
| **Object pooling** | Frequently spawned/despawned entities (bullets, particles) | `hide()` + `set_process(false)` instead of `queue_free()` + `instantiate()` |
| **TileMap over sprites** | Large worlds with repeating tiles | TileMap batches draw calls; individual sprites don't |
| **Area2D for detection** | Trigger zones, pickup ranges, aggro radius | Cheaper than raycasts for "is anything in this zone?" |
| **Raycast for line-of-sight** | Precise directional checks | Better than Area2D for "can I see the player?" |
| **Viewport optimization** | UI-heavy games | Separate viewport for UI at lower update rate |

## Godot Architecture Smells

| Smell | Why It's Bad | Fix |
|-------|-------------|-----|
| **Deep scene nesting (>5 levels)** | Hard to navigate, signals don't propagate well | Flatten structure, use groups |
| **Long `get_node()` paths** | Coupling to tree structure, breaks on refactor | Use `%UniqueNode` syntax, signals, or groups |
| **Game logic in `_ready()`** | Initialization order depends on tree order | Use explicit `initialize()` methods called by parent |
| **Missing `class_name`** | Can't use type hints, inspector doesn't show custom types | Register all reusable scripts with `class_name` |
| **Mixing GDScript and C# without boundary** | Coupling, complex build, confusing for contributors | Clear module boundary with signal-based interface |
| **Signals connected only in editor** | Invisible dependencies, break on scene duplication | Connect in `_ready()` for discoverability (or document clearly) |
| **Export vars for everything** | Inspector clutter, unclear what's tunable | Only export what designers need to change |
