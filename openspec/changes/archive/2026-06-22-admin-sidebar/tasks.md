# Tasks: Admin Sidebar Navigation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~490 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: AppSidebar component (~140 lines) → PR 2: page.tsx + CSS integration (~350 lines) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

```
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High
```

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Create AppSidebar component + add sidebar CSS (no removals) | PR 1 | ~140 lines, standalone, no behavioral change |
| 2 | Modify page.tsx, remove old nav/header CSS, wire sidebar | PR 2 | ~350 lines, depends on PR 1 (targets main after PR 1 merges) |

## Phase 1: Foundation — AppSidebar Component

- [x] **T1** Create `src/app/admin/AppSidebar.tsx` with props interface, 2 nav groups (Operaciones + Catálogo), logo header, refresh/logout footer, collapse toggle, and `motion.aside` spring animation for width. (~140 lines)

## Phase 2: Integration — CSS + page.tsx

- [x] **T2** Update `src/app/admin/admin.css`: add `/* ---------- Sidebar ---------- */` block (~170 lines) with `.app-sidebar`, `.sidebar-*`, `.admin-content-wrapper`, `.sidebar-backdrop` selectors; remove `.admin-header`, `.header-left`, `.header-right`, `.admin-nav`, `.nav-group`, `.nav-item`, `.nav-item::after`, `.nav-item.active`, `.nav-item .badge` (~110 lines). Keep `.btn-icon`, `.btn-outline`, `.admin-logo-*`. (~280 lines)

- [x] **T3** Modify `src/app/admin/page.tsx`: remove `<header>` and `<nav>` blocks; add `isCollapsed`/`isMobile` state; add `useEffect` with `matchMedia('(max-width: 767px)')` listener; build `counts` object; wrap content in `<div className="admin-layout"><AppSidebar ... /><div className="admin-content-wrapper">`; remove unused imports (`Link`, 7 unused lucide icons). (~67 lines)

## Phase 3: Verification

- [x] **T4** Run `npm run build` — verify zero TS/lint errors. Verify sidebar renders all 6 tabs, active tab matches state, collapse/expand animation works, badges display correctly, responsive collapse at <768px, all existing CRUD operations and modals unaffected. (0 lines)

## Implementation Order

1. **T1** first — standalone new component, no dependencies
2. **T2** second — CSS additions can land alongside T1 in PR 1
3. **T3** third — depends on AppSidebar existing (PR 2, targets main after PR 1)
4. **T4** last — build verification across all changes

For PR 1 (T1 + T2 CSS additions only, no removals): standalone, safe, ~140 lines.
For PR 2 (T2 CSS removals + T3 + T4): ~350 lines, depends on PR 1 merged to main.
