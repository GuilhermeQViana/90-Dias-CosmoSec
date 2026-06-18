# Unreal Engine-Specific Architecture Patterns

Architecture patterns, best practices, and smells specific to Unreal Engine and C++.

## Actor/Component Model

**Principle:** Actors are things in the world. Components give them behavior. Compose, don't inherit.

| Class | Role | When |
|-------|------|------|
| **AActor** | Entity that exists in the world | Any placeable game object |
| **UActorComponent** | Logic without transform | Health, inventory, stat tracking |
| **USceneComponent** | Logic with transform (attachable) | Weapons, VFX attach points, sockets |
| **APawn** | Actor that can be possessed | Anything a player or AI controls |
| **ACharacter** | Pawn with CharacterMovementComponent | Humanoid or bipedal characters |

**Antipattern:** Deep ACharacter subclasses (`ACharacter → ABaseEnemy → ARangedEnemy → AArcherEnemy`). Use composition: `ACharacter` + `UCombatComponent` + `URangedAttackComponent`.

## Gameplay Framework

**Unreal's multiplayer-first architecture — one instance per role:**

| Class | Count | Owns | Purpose |
|-------|-------|------|---------|
| **GameMode** | 1 (server only) | Rules | Match rules, spawn logic, win conditions. Doesn't exist on clients |
| **GameState** | 1 (replicated) | Shared state | Score, timer, team data. Visible to all players |
| **PlayerController** | 1 per player | Input/UI | Input processing, UI ownership, camera management |
| **PlayerState** | 1 per player (replicated) | Player data | Name, score, team. Replicated to all clients |
| **HUD / Widgets** | Per player (client only) | Display | UI rendering. Never put game logic here |

**Common mistake:** Putting game logic in PlayerController. PlayerController handles input translation only. Game logic belongs in the Pawn or components.

## Blueprint vs C++ Decision

| Factor | Blueprint | C++ |
|--------|-----------|-----|
| Iteration speed | Fast (hot reload, visual) | Slower (compile required) |
| Performance | ~10x slower than native | Full speed |
| Type safety | Weak (runtime errors) | Strong (compile-time) |
| Merge conflicts | Binary format, unmergeable | Text, standard git workflow |
| Designer access | Full | Requires exposing via UPROPERTY/UFUNCTION |

**Boundary rule:** C++ for systems, data structures, and performance-critical code. Blueprint for content, prototyping, and designer-tunable behavior. Expose C++ to Blueprint via `UFUNCTION(BlueprintCallable)` and `UPROPERTY(EditAnywhere)`.

**Blueprint Interfaces:** Define cross-system contracts (e.g., `IInteractable`, `IDamageable`). Both C++ and Blueprint classes can implement them. Preferred over casting.

## Communication Patterns

| Pattern | Coupling | When |
|---------|----------|------|
| **Direct function call** | Tight | Component-to-owner, parent-child |
| **Delegates (single-cast)** | Loose | One listener, C++ only |
| **Multicast delegates** | Loose | Multiple C++ listeners |
| **Event Dispatchers** | Loose | Blueprint-visible multicast delegates |
| **Gameplay Tags** | None | Data-driven state queries (`Character.Status.Stunned`) |
| **Interface casting** | Loose | Cross-system contracts without knowing concrete type |
| **Gameplay Message Router** (5.x) | None | Global event bus, subsystem-level decoupling |

**Gameplay Tags over booleans:** Instead of `bIsStunned, bIsOnFire, bIsInvulnerable`, use a `FGameplayTagContainer`. Tags are hierarchical, data-driven, and queryable: `HasTag("Status.Stunned")`.

## UObject Lifecycle & Memory

| Pattern | When | Details |
|---------|------|---------|
| **UPROPERTY()** | All UObject references | Required for garbage collection tracking. Missing = dangling pointer |
| **TWeakObjectPtr** | References that shouldn't prevent GC | Caches, optional references. Check `IsValid()` before use |
| **TSoftObjectPtr / FSoftObjectPath** | Assets not needed immediately | Async loading, reduces memory. Load on demand with `LoadSynchronous()` or `StreamableManager` |
| **TObjectPtr** (UE5) | Strong references in headers | Replaces raw `UObject*` in UPROPERTY. Adds lazy load support |

**Critical rule:** Every `UObject*` stored as a member must be `UPROPERTY()`. Non-UPROPERTY pointers will be garbage collected out from under you.

## Unreal Architecture Smells

| Smell | Why It's Bad | Fix |
|-------|-------------|-----|
| **God Actor (>1000 lines)** | Untestable, unreadable, merge magnet | Extract ActorComponents per responsibility |
| **Blueprint spaghetti** | Unmaintainable visual graphs, no diff/review | Extract logic to C++ functions, keep Blueprint graphs small |
| **Tick-heavy Actors** | Every actor ticking every frame kills perf | Disable tick when idle. Use timers, events, or `SetActorTickInterval` |
| **Hardcoded asset paths** | `"/Game/Characters/BP_Player"` — breaks on rename | Data Tables, Gameplay Tags, Soft Object References |
| **Casting everywhere** | Tight coupling, slow (`Cast<T>` does type check) | Blueprint Interfaces for cross-system contracts |
| **Game logic in Widget/HUD** | Mixing display and logic, untestable | Widgets read state only. Logic in PlayerController or components |
| **Ignoring Gameplay Framework** | Putting match state in PlayerController | Use GameMode, GameState, PlayerState as designed |

## Unreal Performance Patterns

| Pattern | When | Details |
|---------|------|---------|
| **Tick management** | Any project | Disable tick on actors that don't need it. Use `SetActorTickEnabled(false)` |
| **Object pooling** | Projectiles, FX, AI spawns | Deactivate + hide instead of Destroy/SpawnActor. Reactivate on reuse |
| **World Partition** (UE5) | Open worlds, large levels | Automatic streaming of level chunks. Replaces manual Level Streaming |
| **Significance Manager** | Many active AI, distant objects | Reduce tick rate and LOD for low-significance actors |
| **Async loading** | Large asset counts | `FStreamableManager` for non-blocking loads. Never `LoadObject` in gameplay |
| **Subsystems** | Per-engine/world/player services | `UGameInstanceSubsystem`, `UWorldSubsystem` — scoped singletons with proper lifecycle |

## State Management

| Pattern | When | Details |
|---------|------|---------|
| **Gameplay Ability System (GAS)** | Combat, abilities, buffs/debuffs | Industry-standard for AAA action games. Abilities, effects, attributes, tags |
| **Enhanced Input** (UE5) | All input handling | Input Actions + Input Mapping Contexts. Replaces legacy input system |
| **Behavior Trees** | AI decision-making | Standard for NPC AI. Blackboard for shared data, decorators for conditions |
| **State Trees** (UE5) | Complex state machines | Visual state machine editor. Alternative to Behavior Trees for state-heavy AI |
| **Enum FSM** | Simple game states (menu, playing, paused) | Lightweight, sufficient for game flow. Use GameMode for transitions |
