# Plan: Phase 4 Task List Generation

## Task Overview
1. Move current task list (`docs/task-list.md`) to `docs/old/task-list-phase-3.md`
2. Generate new task list for Phase 4 based on PRD requirements

## Phase 4 Scope (from PRD)

### NPM Distribution Setup
- Finalize `@grimoire` organization on npmjs.com
- Publish all packages atomically
- PR-137 already defined (new state, ready to work)

### Additional Components
| Component | Element | Notes |
|-----------|---------|-------|
| Snackbar/Toast | `<ytz-snackbar>` | Queue management, auto-dismiss, stacking, position anchoring |
| Progress/Spinner | `<ytz-progress>` | CSS-driven, indeterminate/determinate, circular/linear |
| Badge | `<ytz-badge>` | Notification dot/count overlay |
| Carousel | `<ytz-carousel>` | *Maybe* - stripped-down version |

### Solid.js Wrappers (`@grimoire/yetzirah-solid`)
- Native signal integration
- Ref forwarding with reactive primitives
- Event handler bridging
- SSR-compatible (Solid Start)

### Alpine.js Plugin (`@grimoire/yetzirah-alpine`)
- `x-ytz` directive for event.detail → event.target.value bridging
- `x-ytz:model` for two-way binding
- Auto-detection of Yetzirah components
- Alpine magics: `$ytz.open()`, `$ytz.close()`

## Proposed PR Structure

### Block 1: NPM Distribution (Foundation)
- **PR-137**: Package Registry Publication Setup (already exists, carry forward)

### Block 2: Additional Core Components
- **PR-138**: Snackbar/Toast Core Component
- **PR-139**: Progress/Spinner Core Component
- **PR-140**: Badge Core Component

### Block 3: React Wrappers for New Components
- **PR-141**: Snackbar React Wrapper
- **PR-142**: Progress React Wrapper
- **PR-143**: Badge React Wrapper

### Block 4: Vue/Svelte/Angular Wrappers for New Components
- **PR-144**: Snackbar Vue/Svelte/Angular Wrappers
- **PR-145**: Progress Vue/Svelte/Angular Wrappers
- **PR-146**: Badge Vue/Svelte/Angular Wrappers

### Block 5: Solid.js Integration
- **PR-147**: Solid.js Package Setup
- **PR-148**: Solid.js Core Component Wrappers (Tier 1 + Tier 2)
- **PR-149**: Solid.js New Component Wrappers (Snackbar, Progress, Badge)
- **PR-150**: Solid.js Integration Tests & Documentation

### Block 6: Alpine.js Integration
- **PR-151**: Alpine.js Plugin Package Setup
- **PR-152**: x-ytz Directive Implementation
- **PR-153**: x-ytz:model Two-way Binding
- **PR-154**: Alpine.js Magic Methods ($ytz)
- **PR-155**: Alpine.js Integration Tests & Documentation

### Block 7: Documentation & Finalization
- **PR-156**: Server Framework Integration Patterns (Rails/Laravel/Django)
- **PR-157**: Phase 4 Architecture Documentation
- **PR-158**: CDN Distribution for New Components & Plugins

## Execution Steps

1. **Git mv** current task list to archive location:
   ```bash
   mkdir -p docs/old
   git mv docs/task-list.md docs/old/task-list-phase-3.md
   ```

2. **Create** new `docs/task-list.md` with Phase 4 PRs in standard Lemegeton format

3. **Commit** both changes together

## Dependencies Diagram

```
PR-137 (NPM Publish)
    │
    ├── PR-138 (Snackbar Core)
    │       └── PR-141 (Snackbar React)
    │               └── PR-144 (Snackbar Vue/Svelte/Angular)
    │
    ├── PR-139 (Progress Core)
    │       └── PR-142 (Progress React)
    │               └── PR-145 (Progress Vue/Svelte/Angular)
    │
    └── PR-140 (Badge Core)
            └── PR-143 (Badge React)
                    └── PR-146 (Badge Vue/Svelte/Angular)

After Block 4 (all framework wrappers complete):
    │
    ├── PR-147 (Solid Setup)
    │       └── PR-148 (Solid Tier 1+2)
    │               └── PR-149 (Solid New Components)
    │                       └── PR-150 (Solid Tests/Docs)
    │
    └── PR-151 (Alpine Setup)
            └── PR-152 (x-ytz Directive)
                    └── PR-153 (x-ytz:model)
                            └── PR-154 (Magic Methods)
                                    └── PR-155 (Alpine Tests/Docs)

After PR-150 and PR-155:
    └── PR-156 (Server Framework Patterns)
            └── PR-157 (Architecture Docs)
                    └── PR-158 (CDN New Components)
```

## Notes
- Carousel marked as "Maybe" in PRD - excluding from initial task list
- PR-137 carries forward from Phase 3 as the bridge between phases
- Total: 22 PRs (including PR-137)
