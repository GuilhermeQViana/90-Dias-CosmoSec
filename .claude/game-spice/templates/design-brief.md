<!-- Design Brief Template
     Concise plan output from /game:build-plan (default mode).
     Lives at: .game-design/<slug>/output/design-brief.md
     Use --full for the complete GDD + tech-spec instead. -->

# <Title> — Design Brief

## Core Loop

<!-- One-sentence format: "The player [VERB]s [OBJECT] to [REWARD], which lets them [REINVEST]."
     Source: concept.yaml, validated during brainstorm -->

## MLP Features (3 max)

<!-- Core loop + up to 3 amplifier features. Each: name, one-line description, why it amplifies the loop.
     Source: simulation decisions, scoping 3-Feature Rule -->

1. **<Feature>** — <!-- description and why it amplifies the core loop -->
2. **<Feature>** — <!-- description -->
3. **<Feature>** — <!-- description -->

## Key Decisions

<!-- 5-10 most impactful decisions with rationale. Focus on decisions that constrain implementation.
     Source: decisions.log, prioritized by category (mechanic > feedback > progression > content) -->

| Decision | Rationale | Origin |
|----------|-----------|--------|
| <!-- decision --> | <!-- why --> | <!-- user/suggested/inferred --> |

## Technical Constraints

<!-- Engine, platform, input, team size, and any hard constraints.
     Source: concept.yaml → scope -->

- Engine: <!-- engine -->
- Platform: <!-- platform --> (<!-- input method -->)
- Team: <!-- size -->

## First Vertical Slice

<!-- The tracer bullet: first thing to build, touches all 5 layers.
     Source: scoping → Tracer Bullet Methodology, simulation decisions -->

## Assumptions to Validate

<!-- AI-proposed decisions (suggested/inferred) that need playtesting confirmation.
     Only list high-priority (mechanic) assumptions here. Full list in GDD --full.
     Source: decisions.log filtered by origin -->

## Deferred

<!-- Ideas parked for post-MLP. Brief list with reasons.
     Source: brainstorm open questions, simulation "deferred" decisions -->
