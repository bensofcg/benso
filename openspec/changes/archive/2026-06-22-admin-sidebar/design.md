# Design: Admin Sidebar Navigation

## Technical Approach

Replace the horizontal `admin-nav` (6 tabs in 3 groups) with a fixed vertical sidebar that collapses between 260 px (expanded) and 64 px (icon-only). The `<header>` is absorbed into the sidebar's top section. Layout changes from vertical stacking to a flex row: `sidebar | content`. No routing changes — `useState<activeTab>` remains.

## Architecture Decisions

### Decision: Positioning strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `position: fixed` sidebar + `margin-left` on content | Standard patterns; no reflow on scroll; works with existing admin | **Chosen** — sidebar is independent of content flow |
| `position: sticky` sidebar | Unexpected overlap with existing `z-index` layers | Rejected |
| CSS Grid layout | Requires restructuring parent tree | Rejected — too invasive |

### Decision: Sidebar-collapse state ownership

The `isCollapsed` state lives in `AdminPage` (page.tsx) and is passed down as a prop. Rationale: the toolbar and main content need to adjust margin-left in lockstep with the sidebar width. Local state inside the sidebar would require a callback chain anyway.

### Decision: Badge counts as a single prop object

Instead of threading `pedidos.length`, `citas.length`, etc. as individual props, pass a single `counts: Record<string, number>` — keeps the interface stable if future tabs are added.

### Decision: CSS transitions for content margin, framer-motion for sidebar

The sidebar `motion.aside` animates `width` via spring animation (`stiffness: 300, damping: 30`). The content wrapper uses plain `transition: margin-left 0.3s ease` matching the spring's settle time. This avoids coupling two framer-motion components.

### Decision: Section labels hidden on collapse

When collapsed (`width: 64px`), section titles ("OPERACIONES", "CATÁLOGO") are hidden. Only icons render. A `title` attribute on each button provides the label for screen readers and tooltip-on-hover.

## Layout Structure

```
┌─────────────────────────────────────────────┐
│  admin-layout (display: flex)               │
│                                              │
│  ┌─────────┐  ┌───────────────────────────┐ │
│  │ Sidebar  │  │ admin-content-wrapper     │ │
│  │ fixed    │  │ margin-left: 260|64       │ │
│  │ 260|64px │  │                           │ │
│  │          │  │  ┌─────────────────────┐  │ │
│  │ [Logo]   │  │  │ (admin-toolbar)     │  │ │
│  │          │  │  ├─────────────────────┤  │ │
│  │──Sec 1──│  │  │                     │  │ │
│  │ Dashboard│  │  │ admin-main          │  │ │
│  │ Pedidos  │  │  │ (scrollable)        │  │ │
│  │ Citas    │  │  │                     │  │ │
│  │          │  │  │                     │  │ │
│  │──Sec 2──│  │  │                     │  │ │
│  │Productos │  │  │                     │  │ │
│  │Servicios │  │  │                     │  │ │
│  │ Eventos  │  │  │                     │  │ │
│  │          │  │  │                     │  │ │
│  │[Refresh] │  │  │                     │  │ │
│  │ [Salir]  │  │  │                     │  │ │
│  └─────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/admin/AppSidebar.tsx` | **Create** | Sidebar component: logo, 2 nav groups with icons/badges, footer with refresh+logout, collapse toggle button |
| `src/app/admin/page.tsx` | Modify | Remove `<header>` + `<nav>` blocks; import AppSidebar; add `useState(isCollapsed)`, `layout` wrapper div, `matchMedia` listener for 768px; remove `Link`/`useRef` imports if no longer used elsewhere |
| `src/app/admin/admin.css` | Modify | Add `/* ---------- Sidebar ---------- */` block (~200 lines); remove `.admin-nav`, `.nav-group`, `.nav-item`, `.nav-item::after`, `.nav-item.active`, `.nav-item .badge`, `.admin-header`, `.header-left`, `.header-right`; keep `.btn-icon`, `.btn-outline`, `.admin-logo-*` |

## Interfaces

```typescript
type AdminTab = 'dashboard' | 'pedidos' | 'citas' | 'productos' | 'servicios' | 'eventos';

interface AppSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: Record<AdminTab, number>;       // badge numbers
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRefresh: () => void;
  loading: boolean;                        // for spinner on refresh icon
  onLogout: () => void;
  isMobile: boolean;                       // for overlay behavior < 768px
}
```

## CSS Architecture

New section in `admin.css` (`/* ---------- Sidebar ---------- */`):

| Selector | Purpose |
|----------|---------|
| `.app-sidebar` | Fixed, left:0, top:0, height:100vh, z-index:100, flex column |
| `.sidebar-inner` | Scrollable flex column filling the sidebar |
| `.sidebar-logo` | Top section: logo img + "Admin" label |
| `.sidebar-nav` | Flex column with gap, flex:1 for scroll |
| `.sidebar-section` | Group wrapper |
| `.sidebar-section-title` | Small caps label for group (hidden when collapsed) |
| `.sidebar-item` | Flex row, align center, gap 0.75rem, padding 0.75rem 1rem, border-radius 8px, color white, transition |
| `.sidebar-item:hover` | Background rgba(255,255,255,0.1) |
| `.sidebar-item.active` | Background var(--accent) or rgba(0,86,208,0.6) |
| `.sidebar-item .badge` | Reuse existing badge style or adapt |
| `.sidebar-footer` | Bottom area, flex row, padding, gap |
| `.sidebar-toggle` | Absolute positioned button at right edge to toggle collapse |
| `.admin-content-wrapper` | flex:1, transition margin-left 0.3s ease, margin-left:var(--sidebar-w) |
| `.sidebar-backdrop` | Mobile overlay (<768px), fixed, inset 0, bg rgba(0,0,0,0.5), z-index:99 |

## Responsive Strategy

| Breakpoint | Behavior |
|------------|----------|
| `>= 768px` | Sidebar fixed, starts expanded. Toggle button at bottom. |
| `< 768px` | Sidebar starts collapsed. Toggle button (hamburger) visible. Expanded sidebar overlays content with backdrop. `isMobile` prop disables `margin-left` on content (stays 0). |

Implementation: `useEffect` with `matchMedia('(max-width: 767px)')` listener sets `isMobile` state and auto-collapses when crossing below.

## Animation

```tsx
<motion.aside
  className="app-sidebar"
  animate={{ width: isCollapsed ? 64 : 260 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
```

The sidebar interior uses `overflow: hidden` during collapse. Items conditionally render labels/badges based on `!isCollapsed` — no AnimatePresence needed since framer-motion handles the container width.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | AppSidebar renders all 6 tabs in 2 groups | Render + query by text |
| Unit | Active tab has correct CSS class | Check `.sidebar-item.active` present |
| Unit | Badge counts display and update | Pass different counts prop |
| Unit | Collapse toggle fires callback | Mock `onToggleCollapse` |
| E2E | Sidebar renders in admin after login | Login flow + assert sidebar visible |
| E2E | Clicking tab changes content area | Click "Pedidos" → assert pedidos table |
| E2E | Responsive collapse at 768px | Set viewport 767px → assert collapsed state |

## Migration / Rollout

No migration required. Pure CSS/component refactor. Rollback: `git checkout` on `page.tsx`, delete `AppSidebar.tsx`, restore CSS section.

## Open Questions

- None.
