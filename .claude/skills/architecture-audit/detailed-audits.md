# Detailed Architecture Audits

## State Management Audit

### The Boolean Flag Problem

`is_jumping, is_ducking, is_firing` creates combinatorial explosion. Every new action doubles possible states, most combinations are invalid (`is_jumping AND is_ducking AND is_dead`).

### State Patterns (Progressive Complexity)

| Pattern | When to Use | Key Insight |
|---------|-------------|-------------|
| **FSM (enum + switch)** | Distinct behaviors, small state count (≤8) | Replaces boolean flags entirely |
| **Pushdown Automata** | "Do this, then return to previous" (firing while running, pause) | Stack of states, pop to restore |
| **Hierarchical FSM** | Shared transitions (all ground states can jump) | Superstates handle common logic |
| **Concurrent FSMs** | Orthogonal concerns (armed/unarmed × standing/jumping) | Separate machines per axis |

### State Management Smells

| Smell | Symptom | Fix |
|-------|---------|-----|
| **Boolean flags** | `if is_jumping and not is_ducking and is_alive` | Replace with FSM enum |
| **Missing transitions** | States change without validation | Explicit transition table |
| **Global mutable state** | Singletons modified from everywhere | Encapsulate state ownership |
| **State desync** | Same state tracked in multiple places | Single source of truth |

## Entity Architecture Audit

| Pattern | When Appropriate | Primary Risk |
|---------|-----------------|-------------|
| **ECS** | High entity counts, perf-critical simulation (Bevy, EnTT) | Higher initial complexity |
| **Component-based** | Scene-graph engines (Godot, Unity) | Component coupling over time |
| **Inheritance hierarchy** | <10 entity types, no runtime flexibility needed | Fragile base class, diamond problem |
| **Data-driven** | Designer-authored entities, moddable games | Harder to debug |

### Entity Architecture Smells

| Smell | Symptom | Fix |
|-------|---------|-----|
| **Deep inheritance (>3 levels)** | "Where does this method come from?" unanswerable | Flatten to composition |
| **God entity/node** | >10 responsibilities on one entity | Extract components/sub-nodes |
| **Component coupling** | Components directly reference each other | Use signals/events for communication |
| **Monolithic scene** | >500 lines in one scene/file | Extract sub-scenes/sub-components |

## Input Handling Audit

### Three-Layer Architecture

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Raw Input** | Hardware signals, no game logic | Keyboard events, gamepad axis values |
| **Mapping** | Translates to named actions, supports remapping | "jump" = Space / A button / swipe up |
| **Action** | Game systems consume actions, buffering + priority | Jump system reads "jump" action, applies buffer window |

### Input Handling Smells

| Smell | Why It's Bad | Fix |
|-------|-------------|-----|
| **Raw key checks in gameplay** | No remapping, no gamepad, no accessibility, no replay | Use action mapping layer |
| **No input buffering** | Dropped inputs, poor game feel | Buffer inputs for 0.1-0.2s |
| **Platform-specific hardcoding** | Accessibility barrier, can't port | Abstract through mapping layer |
| **Input during wrong state** | Player acts during cutscene/pause | Filter by game state |

## Performance Smells

| Smell | Detection | Impact |
|-------|-----------|--------|
| **Allocation in hot path** | `new`/`malloc` in update loop | GC spikes, frame drops |
| **O(n²) collision** | Nested entity loops without spatial partitioning | Exponential scaling with entity count |
| **String comparison in loop** | Type checks by string in update | Slow, error-prone |
| **Unbounded entity count** | No pooling or despawn limits | Memory growth, eventual crash |
| **AoS data layout** | Arrays of Structures in tight loops | Cache misses, poor vectorization |

### Frame Budget Reference

| Target | Budget per Frame | Typical Split |
|--------|-----------------|--------------|
| 30 FPS | 33ms | 10ms logic, 10ms physics, 13ms render |
| 60 FPS | 16.6ms | 5ms logic, 5ms physics, 6.6ms render |

### Spatial Partitioning Options

| Structure | Best For |
|-----------|----------|
| **Uniform Grid** | Evenly distributed, similar-sized entities |
| **Quadtree/Octree** | Variable density, mixed entity sizes |
| **BSP / k-d Tree** | Static geometry, ray queries |
| **BVH** | Complex meshes, dynamic objects |

## Game-Specific Technical Debt

Not all debt is bad. Some debt is correct to take early and pay later.

| Debt | Accept During | Pay Before |
|------|-------------|-----------|
| Magic numbers | Tracer bullet, MLP | Content production |
| No save architecture | Tracer bullet | Meta-progression implementation |
| Monolithic scenes | Tracer bullet | Second level/area |
| Missing event/signal system | MLP (<4 system interactions) | 4th system interaction |
| No asset pipeline | MLP | Content batching |
| Hardcoded resolution | MLP | First external playtest |
| No input remapping | MLP | Public release |
| Tightly coupled scene transitions | MLP | Scene reordering or branching paths |

**Rule:** Accept debt that speeds up validation. Pay debt before it blocks the next phase.
