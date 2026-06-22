# Proposal: Admin Sidebar Navigation

## Intent

Replace the horizontal tab navigation in the admin panel (`admin/page.tsx`) with a vertical sidebar. The current horizontal `nav` with 6 tabs becomes a narrow, fixed sidebar — matching the shadcn sidebar-01 / sidebar-07 pattern — while preserving all business logic, CRUD code, and the single-page SPA architecture.

## Scope

### In Scope
- **Collapsible AppSidebar component**: vertical nav with 2 section groups (Operaciones, Catálogo), lucide icons, active-state highlight, badge counts
- **Layout restructure**: replace stacking layout (header → nav → toolbar → main) with sidebar + content-area flex layout
- **Header integration**: logo + refresh/logout controls move into the sidebar top section
- **Responsive behavior**: sidebar collapses to icon-only on `< 768px` with a hamburger toggle
- **CSS-only styling**: no Tailwind — use existing CSS variables (`--dark`, `--primary`, `--accent`, `--white`, `--font-main/heading`)
- **framer-motion** for collapse/expand animation on the sidebar width transition

### Out of Scope
- No changes to login screen, toolbar, tables, modals, forms, or CRUD logic
- No refactor of `admin/page.tsx` beyond removing the `<nav>` block and wrapping content in a layout flex container
- No routing or URL-based navigation — keeps `useState<activeTab>` as-is
- No Tailwind installation or shadcn component library usage

## Capabilities

### New Capabilities
- `admin-sidebar`: Collapsible sidebar navigation for the admin panel with grouped sections, icons, badges, and responsive toggle

### Modified Capabilities
- None — pure UI refactor, no spec-level behavior changes

## Approach

1. Extract the existing `<nav className="admin-nav">` block (lines 425–450) into a standalone `AppSidebar` component at `src/app/admin/AppSidebar.tsx`
2. `AppSidebar` receives `activeTab`, `onTabChange`, counts (`pedidos.length`, etc.), `isCollapsed`, `onToggleCollapse` as props
3. Layout becomes a flex row: `<div className="admin-layout"><AppSidebar /> <div className="admin-content">{toolbar + main}</div></div>`
4. Remove the `<header>` from `page.tsx` — logo + logout/refresh integrate into sidebar top
5. All new CSS goes into `admin.css` under a `/* ---------- Sidebar ---------- */` section; existing `admin-nav` styles get removed
6. Collapse logic: `useState` toggle at page level, CSS class switch + framer-motion `animate={{ width }}` on the sidebar container
7. Responsive: media query at 768px defaults sidebar to collapsed; hamburger button shown on mobile

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/admin/page.tsx` | Modified | Remove `<nav>`, `<header>`; import AppSidebar; add layout wrapper + collapse state |
| `src/app/admin/AppSidebar.tsx` | **New** | Sidebar component with nav groups, logo, collapse toggle, logout |
| `src/app/admin/admin.css` | Modified | Add sidebar styles, remove `.admin-nav`, `.nav-group`, `.nav-item` |
| `src/app/admin/layout.tsx` | Unchanged | No changes needed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSS positioning conflicts (sidebar vs `.admin-main` padding) | Med | Isolate sidebar to fixed positioning; content area uses `margin-left` matching sidebar width |
| Sidebar breaking the login screen (unauthenticated state) | Low | Sidebar only renders in the authenticated branch — login screen is unchanged |
| Badge re-renders on every data change causing layout shifts | Low | Sidebar stays fixed width; badges are inline; no layout shifts |
| activeTab state drilling through AppSidebar + layout | Low | Props stay simple — just `activeTab` + `setActiveTab`; no context needed |

## Rollback Plan

Revert `page.tsx`, delete `AppSidebar.tsx`, and restore `admin.css` from git. The old `<nav>` is a pure deletion — restoring the file from `git checkout` is zero-risk.

## Dependencies

None. Pure React + CSS. `framer-motion` already installed (`motion` package).

## Success Criteria

- [ ] Sidebar renders all 6 tabs grouped into 2 sections with correct icons
- [ ] Active tab is visually highlighted and matches `activeTab` state
- [ ] Clicking any nav item changes the visible content area
- [ ] Sidebar collapses/expands on toggle without content breakage
- [ ] Responsive: sidebar collapses automatically below 768px
- [ ] All existing CRUD operations, modals, and toolbar functions work identically
- [ ] `npm run build` succeeds with no TypeScript or lint errors
