# Unity-Specific Architecture Patterns

Architecture patterns, best practices, and smells specific to Unity and C#.

## MonoBehaviour Lifecycle

**Principle:** Know when Unity calls each method. Most bugs stem from wrong assumptions about execution order.

| Phase | Method | Use For |
|-------|--------|---------|
| **Initialization** | `Awake()` | Self-initialization, `GetComponent` caching, runs even if disabled |
| **Initialization** | `OnEnable()` | Subscribe to events, runs each time object is enabled |
| **Initialization** | `Start()` | Cross-object setup (references to other objects), runs once before first Update |
| **Physics** | `FixedUpdate()` | Physics, movement, raycasts, Rigidbody forces |
| **Game Logic** | `Update()` | Input, animations, non-physics game logic |
| **Late** | `LateUpdate()` | Camera follow, UI updates that depend on Update results |
| **Cleanup** | `OnDisable()` | Unsubscribe from events |
| **Cleanup** | `OnDestroy()` | Final cleanup, release unmanaged resources |

**Common mistake:** Referencing other objects in `Awake()` — they may not be initialized yet. Use `Awake()` for self-setup, `Start()` for cross-references.

## Component Architecture

| Pattern | When | Details |
|---------|------|---------|
| **MonoBehaviour composition** | Most gameplay objects | Small, focused components. `Health`, `Mover`, `DamageDealer` — not `PlayerController` doing everything |
| **ScriptableObjects as data** | Shared configuration, item definitions | Assets that hold data without scene presence. Weapon stats, enemy configs, event channels |
| **Plain C# classes** | Pure logic with no Unity lifecycle needs | State machines, pathfinding algorithms, data structures. Testable without Play mode |
| **ECS/DOTS** | Thousands of entities, perf-critical simulation | Full paradigm shift. Only when profiling proves MonoBehaviour can't keep up |

**ScriptableObject event channels:** Create a `GameEvent` ScriptableObject that acts as a decoupled event bus. Listeners register via inspector. No singleton required.

## Scene & Prefab Organization

```
Assets/
├── _Scenes/          # Underscore sorts to top
│   ├── Boot.unity    # Initialization, persistent managers
│   ├── MainMenu.unity
│   └── Gameplay.unity
├── Prefabs/
│   ├── Player/
│   ├── Enemies/
│   └── UI/
├── Scripts/
│   ├── Player/
│   ├── Combat/
│   └── Core/         # Managers, events, utilities
├── Art/
└── Audio/
```

**Assembly Definitions:** Use `.asmdef` files per subsystem folder. Enforces dependency direction, speeds up compilation. `Core` has no dependencies; `Player` depends on `Core`; `UI` depends on `Core`.

**Additive scenes:** Load `UI` and `Gameplay` additively on top of `Boot`. Persistent managers live in `Boot` and survive scene transitions via `DontDestroyOnLoad`.

## Communication Patterns

| Pattern | Coupling | When |
|---------|----------|------|
| **GetComponent / direct reference** | Tight | Components on the same GameObject |
| **UnityEvents (Inspector)** | Loose | Designer-configurable wiring (buttons, triggers) |
| **C# events / delegates** | Loose | Code-driven events, high frequency |
| **ScriptableObject event channels** | None | Cross-system communication, no scene references |
| **Static event bus** | None | Last resort — harder to debug, no inspector visibility |

**Rule of thumb:** Use the loosest coupling that doesn't add unnecessary complexity. ScriptableObject events are the sweet spot for most cross-system communication.

## Unity Architecture Smells

| Smell | Why It's Bad | Fix |
|-------|-------------|-----|
| **God MonoBehaviour (>200 lines)** | Untestable, merge conflicts, single responsibility violation | Extract components: `PlayerMovement`, `PlayerCombat`, `PlayerAnimation` |
| **Singleton abuse** | Hidden dependencies, test difficulty, initialization order bugs | ScriptableObject event channels or dependency injection |
| **`Find` / `FindObjectOfType` in runtime** | O(n) scene search every call, string-based fragility | Cache in `Awake()`, use direct references, or event-driven lookup |
| **Public fields everywhere** | No encapsulation, inspector clutter, accidental mutation | `[SerializeField] private` for inspector access, properties for API |
| **String-based references** | `Animator.Play("Run")`, `GameObject.Find("Player")` — silent failures | Constants, enums, `[SerializeField]` direct references, Addressable keys |
| **Logic in coroutines** | Hard to debug, no return values, silent stop on disable | Async/await with UniTask, or explicit state machines |
| **DontDestroyOnLoad sprawl** | Objects accumulate across scenes, duplicate managers | Single Boot scene pattern with one persistent root |

## Unity Performance Patterns

| Pattern | When | Details |
|---------|------|---------|
| **Object pooling** | Bullets, particles, enemies — anything spawned frequently | `Queue<GameObject>` pool. Deactivate on "destroy", reactivate on "spawn" |
| **Cache GetComponent** | Any `GetComponent` called more than once | Store result in `Awake()`. Each call does a lookup |
| **Avoid LINQ in hot paths** | Per-frame code | LINQ allocates enumerators → GC spikes. Use `for` loops in Update |
| **Addressables** | Asset-heavy games, large builds | Lazy loading, memory control, remote content. Replaces `Resources.Load` |
| **Non-allocating physics** | Frequent raycasts, overlap checks | `Physics.RaycastNonAlloc`, `Physics.OverlapSphereNonAlloc` — reuse result arrays |
| **Shader property IDs** | Material property access | `Shader.PropertyToID("_Color")` once, reuse the int. String lookup every frame is wasteful |

## State Management

| Pattern | When | Details |
|---------|------|---------|
| **Enum FSM** | Simple states (Idle, Walk, Jump, Attack) | Switch on enum in Update. Explicit transition validation |
| **Animator as state machine** | Animation-driven characters | State machine is the Animator. Use StateMachineBehaviours for enter/exit logic |
| **ScriptableObject state** | Shared state across systems | `GameState` ScriptableObject referenced by multiple systems. Single source of truth |
| **GameManager pattern** | Global game flow (menu, playing, paused, game over) | One manager handles transitions. Systems query current state before processing |
