# TypeScript-Specific Architecture Patterns

Architecture patterns, best practices, and smells specific to TypeScript browser game development.

## Game Loop & Timing

**Principle:** The browser owns the frame. You request frames, not demand them.

| Approach | When | Details |
|----------|------|---------|
| **`requestAnimationFrame`** | Custom engine, no framework | Browser-synced, pauses on tab hide. Use `performance.now()` for delta |
| **Framework-managed** | Phaser, Excalibur, PixiJS | Framework handles rAF loop. Override `update(time, delta)` |
| **Fixed timestep accumulator** | Physics-heavy games | Same accumulator pattern as other engines, inside the rAF callback |

**Tab visibility:** `requestAnimationFrame` stops when tab is hidden. Handle `document.visibilitychange` to pause game state — otherwise massive delta spike on tab return.

**`performance.now()`:** Use instead of `Date.now()`. Microsecond precision, monotonic (no clock skew). Pass delta in seconds, not milliseconds.

## Framework Decision

| Factor | Phaser | PixiJS | Excalibur | No Framework |
|--------|--------|--------|-----------|--------------|
| Scope | Full game framework | Rendering only | Full game framework | Full control |
| Built-in physics | Arcade + Matter.js | None | Built-in | Manual |
| Scene management | Yes (Scene class) | No | Yes (Scene class) | Manual |
| TypeScript support | Bundled type definitions | Native TS | Built in TS | Native |
| Best for | 2D games, rapid prototyping | Custom engines needing fast rendering | 2D games with TS-first DX | Learning, tiny games |

**Rule:** Phaser for most 2D browser games. PixiJS when you want only rendering. Excalibur for TypeScript-first development. No framework only for tiny experiments.

## Scene & Entity Organization

```
src/
├── main.ts           # Entry point, game config, boot
├── scenes/
│   ├── BootScene.ts  # Asset preloading
│   ├── MenuScene.ts
│   ├── GameScene.ts
│   └── UIScene.ts    # Overlay scene (HUD, running parallel)
├── entities/
│   ├── Player.ts
│   ├── Enemy.ts
│   └── Projectile.ts
├── systems/
│   ├── CollisionSystem.ts
│   ├── InputManager.ts
│   └── AudioManager.ts
├── types/
│   └── index.ts      # Shared interfaces, type definitions
└── utils/
    ├── ObjectPool.ts
    └── EventBus.ts
```

**Phaser Scenes:** Run scenes in parallel for UI overlays (`this.scene.launch('UIScene')`). Game scene handles gameplay; UI scene handles HUD. Communicate via events.

**ECS libraries:** For high entity counts, consider bitECS or miniplex. Component data in typed arrays, cache-friendly iteration. Overkill for <500 entities.

## Communication Patterns

| Pattern | Coupling | When |
|---------|----------|------|
| **Phaser Events** (`this.events.emit`) | Loose | Within a scene |
| **Phaser Scene Events** (`scene.events`) | Loose | Cross-scene communication |
| **Phaser Registry** (`this.registry`) | Global | Shared data across scenes (score, settings) |
| **Custom EventEmitter** | None | Framework-agnostic, testable |
| **Typed event bus with generics** | None | Type-safe events: `bus.on<EnemyDied>('enemy.died', handler)` |

**Typed event bus:** Define event types as interfaces, use generics for type-safe emit/subscribe. Catches mismatched payloads at compile time.

```typescript
interface GameEvents {
  'enemy.died': { enemy: Enemy; position: Vec2 };
  'score.changed': { score: number };
}
```

## Asset Loading & Browser Constraints

| Concern | Problem | Solution |
|---------|---------|----------|
| **Initial load time** | Users abandon after 3-5s wait | Preload only Boot scene assets. Lazy-load per scene |
| **Texture atlases** | Individual images = HTTP requests + draw call overhead | Pack sprites into atlases (TexturePacker, free-tex-packer) |
| **Audio context** | Browsers block audio until user gesture | Start `AudioContext` on first click/tap. Phaser handles this |
| **Memory limits** | Mobile browsers crash at ~300-500MB | Unload unused scenes/textures. Monitor with `performance.memory` |
| **Bundle size** | Large JS bundles = slow load | Tree-shake, code-split per scene, lazy import heavy modules |
| **Asset caching** | Repeated downloads on revisit | Set cache headers, use service worker for offline support |

## TypeScript Architecture Smells

| Smell | Why It's Bad | Fix |
|-------|-------------|-----|
| **`any` types** | Defeats TypeScript's purpose, hides bugs | Use proper interfaces. `unknown` + type guards for truly dynamic data |
| **DOM manipulation in game loop** | DOM ops are orders of magnitude slower than canvas | Use canvas/WebGL for rendering. DOM only for HTML UI overlays |
| **Magic string asset keys** | `this.add.image(0, 0, 'plyer')` — silent failure on typo | Asset key constants or enum: `Assets.Player` |
| **No strict mode** | `tsconfig.json` without `strict: true` | Enable `strict: true`. Fix all resulting errors |
| **Circular dependencies** | Module A imports B imports A — bundler may silently break | Event-driven communication, barrel exports, dependency inversion |
| **God Scene** | Single scene with all game logic | Extract systems, use parallel scenes for UI overlay |
| **Sync asset loading** | Blocking the main thread during load | Always use async preloading. Show progress bar during load |

## TypeScript Performance Patterns

| Pattern | When | Details |
|---------|------|---------|
| **Object pooling** | Bullets, particles, effects | Array-based pool with active/inactive tracking. Avoid `new` in gameplay |
| **Typed arrays** | Large numeric datasets, physics | `Float32Array` for positions/velocities. Cache-friendly, no boxing overhead |
| **OffscreenCanvas** | Heavy rendering + game logic | Move rendering to Web Worker (where supported). Keeps main thread responsive |
| **Avoid GC pressure** | Per-frame allocations | Reuse objects, pre-allocate arrays, avoid spread/destructuring in hot paths |
| **Texture batching** | Many sprites | Same-texture sprites in one draw call. Use atlas, avoid texture switches |
| **RAF throttling** | Battery/thermal on mobile | Reduce to 30 FPS when game is idle or in menus. `cancelAnimationFrame` on pause |

## State Management

| Pattern | When | Details |
|---------|------|---------|
| **Discriminated unions** | FSM with TypeScript safety | `type State = { kind: 'idle' } \| { kind: 'attack'; target: Enemy }`. Exhaustive switch |
| **Phaser Scene stack** | Game flow transitions | `scene.start('GameOver')`, `scene.launch('PauseMenu')`. Scene lifecycle handles cleanup |
| **Immutable state for replay** | Undo, replay, networking | Store state snapshots as plain objects. Diff for network sync |
| **State machine library** | Complex state logic | XState or custom FSM. Explicit transitions, guard conditions, side effects |
