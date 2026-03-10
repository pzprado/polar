# Polar — Agent Orchestration Guide

## Task Dependency Graph

```
                    Task 0: Scaffolding + Shared Types
                                   |
                 ┌─────────┬───────┼───────┬──────────┐
                 v         v       v       v          v
              Task 1    Task 2  Task 3  Task 4     Task 5
              Dashboard Contracts AI Gen  Preview   Deploy
              + Landing Templates Pipeline System   System
                 |         |       |       |          |
                 └─────────┴───────┴───────┴──────────┘
                                   |
                                   v
                          Task 6: Builder Page
                          (Integration + Wiring)
                                   |
                                   v
                          Task 7: Polish + Testing
```

## Phase-by-Phase Execution

### Phase 0: Setup (1 agent, sequential)

| Agent | Task | Doc |
|-------|------|-----|
| Any | Task 0: Scaffolding | `docs/tasks/TASK-0-SCAFFOLDING.md` |

**Must complete before any other task starts.** Creates the project, installs deps, writes shared types.

### Phase 1: Parallel Build (up to 5 agents, all independent)

| Agent | Task | Doc | Notes |
|-------|------|-----|-------|
| Agent A | Task 1: Dashboard + Landing | `docs/tasks/TASK-1-DASHBOARD.md` | Pure UI, no backend deps |
| Agent B | Task 2: Smart Contracts | `docs/tasks/TASK-2-CONTRACTS.md` | Backend-only, no UI |
| Agent C | Task 3: AI Pipeline | `docs/tasks/TASK-3-AI-PIPELINE.md` | API route + prompt eng |
| Agent D | Task 4: Preview System | `docs/tasks/TASK-4-PREVIEW.md` | Sandpack components |
| Agent E | Task 5: Deploy System | `docs/tasks/TASK-5-DEPLOY.md` | Deploy UI + API route |

**Key notes for parallel execution:**
- Tasks 1, 4 are pure UI — they create components that receive data as props
- Tasks 2, 3, 5 involve server-side code (API routes, compiler, deployer)
- Task 5's API route imports from Task 2 (compiler.ts, deployer.ts) — if running truly parallel, Task 5 should create a stub or wait for Task 2's files
- Task 3's API route imports from Task 2 (template registry) — same stub strategy

**Recommended groupings for 3 agents:**

| Agent | Tasks | Rationale |
|-------|-------|-----------|
| Agent A | Task 1 + Task 4 | Both UI-focused, no backend deps |
| Agent B | Task 2 + Task 5 | Deploy depends on compiler/deployer from Task 2 |
| Agent C | Task 3 | Largest single task with complex prompt engineering |

### Phase 2: Integration (1 agent, sequential)

| Agent | Task | Doc |
|-------|------|-----|
| Any | Task 6: Builder Page | `docs/tasks/TASK-6-BUILDER.md` |

**Must wait for all Phase 1 tasks.** Wires all components together into the 3-column builder.

### Phase 3: Polish (1 agent, sequential)

| Agent | Task | Doc |
|-------|------|-----|
| Any | Task 7: Polish + Testing | `docs/tasks/TASK-7-POLISH.md` |

**Must wait for Task 6.** Final polish, error handling, deploy prep.

## Agent Instructions Template

When delegating to an agent, provide this context:

```
You are building Polar, an AI-native web3 app builder for Avalanche.

Read these docs before starting:
1. docs/ARCHITECTURE.md — full system overview
2. docs/TYPES.md — shared type definitions
3. docs/tasks/TASK-{N}-{NAME}.md — your specific task

Key rules:
- Use pnpm (not npm/yarn)
- Use TypeScript throughout
- Use shadcn/ui components from src/components/ui/
- Follow the design direction: light theme, clean, Avalanche red (#E84142) for CTAs only
- Don't modify files outside your task scope unless absolutely necessary
- Don't modify src/lib/types.ts or src/lib/constants.ts (shared, owned by Task 0)
- Test that your code compiles: pnpm build (or at least pnpm dev with no errors)
```

## File Ownership (to avoid conflicts)

| Task | Owns These Paths | Can Read/Import From |
|------|-------------------|----------------------|
| Task 0 | `src/lib/types.ts`, `src/lib/constants.ts`, `src/components/ui/*`, root configs | — |
| Task 1 | `src/app/page.tsx`, `src/components/landing/*`, `src/components/shared/*`, `src/lib/templates/community.ts` | types, constants, ui |
| Task 2 | `src/lib/contracts/*` | types, constants |
| Task 3 | `src/lib/ai/*`, `src/app/api/generate/route.ts` | types, constants, contracts/templates |
| Task 4 | `src/lib/preview/*`, `src/components/builder/preview-panel.tsx`, `src/components/builder/code-viewer.tsx` | types, ui |
| Task 5 | `src/app/api/deploy/route.ts`, `src/components/builder/deploy-button.tsx`, `src/components/builder/deploy-result.tsx`, `src/hooks/use-deploy.ts` | types, constants, contracts, ui |
| Task 6 | `src/app/app/[id]/page.tsx`, `src/components/builder/chat-panel.tsx`, `src/components/builder/prompt-input.tsx`, `src/components/builder/generation-status.tsx`, `src/hooks/use-generation.ts` | everything |
| Task 7 | Any file (for polish) | everything |

## Merge Strategy

If using git worktrees or branches:

1. Task 0 goes to `main`
2. Tasks 1-5 branch from Task 0's commit
3. Merge Tasks 1-5 into `main` (should be conflict-free due to file ownership)
4. Task 6 branches from merged state
5. Task 7 branches from Task 6

If working in a single worktree sequentially: just work on `main`.

## Quick Reference

| Task | Files Created | Lines of Code (est.) |
|------|--------------|----------------------|
| 0 | 5 files + shadcn | ~100 |
| 1 | 8 files | ~400 |
| 2 | 8 files | ~500 |
| 3 | 3 files | ~250 |
| 4 | 4 files | ~200 |
| 5 | 4 files | ~250 |
| 6 | 5 files | ~300 |
| 7 | Edits only | ~100 |
| **Total** | **~37 files** | **~2,100** |
