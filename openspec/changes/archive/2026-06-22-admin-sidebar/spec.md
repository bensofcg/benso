# Admin Sidebar Specification

## Purpose

The Admin Sidebar replaces the horizontal tab navigation in the admin panel with a fixed vertical sidebar. It groups nav items into sections, supports collapsible mode on desktop (≥768px), and auto-collapses on mobile with a hamburger toggle.

## Requirements

### Requirement: Desktop Layout and Collapse

The sidebar MUST render as a fixed vertical panel on the left edge on viewports ≥768px. The expanded state MUST show icon and label per item; the collapsed state MUST show icons only. Toggling SHOULD animate via framer-motion. The content area MUST have a left margin matching sidebar width.

#### Scenario: Expanded sidebar on desktop

- GIVEN viewport width ≥768px
- WHEN the admin panel loads
- THEN the sidebar is a fixed vertical panel showing icons and labels

#### Scenario: Collapse on toggle

- GIVEN the sidebar is expanded
- WHEN the user clicks the collapse toggle
- THEN it animates to narrow, icons only; labels hide

#### Scenario: Expand on toggle

- GIVEN the sidebar is collapsed
- WHEN the user clicks the collapse toggle
- THEN it animates to full width showing icons and labels

### Requirement: Mobile Behavior (<768px)

On viewports below 768px the sidebar MUST default to collapsed. A hamburger button MUST toggle it open or closed.

#### Scenario: Auto-collapse on resize

- GIVEN the viewport resizes from ≥768px to <768px
- WHEN the width crosses 768px
- THEN the sidebar collapses to icon-only mode

#### Scenario: Hamburger toggle

- GIVEN viewport <768px and sidebar collapsed
- WHEN the user clicks the hamburger button
- THEN the sidebar expands; the icon changes to close

### Requirement: Navigation Groups

The sidebar MUST organize tabs in two sections: "Operaciones" (Dashboard, Pedidos, Citas) and "Catálogo" (Productos, Servicios, Eventos). Section headings MUST show when expanded and MUST hide when collapsed.

#### Scenario: Section headings visible when expanded

- GIVEN the sidebar is expanded
- WHEN viewing the nav list
- THEN "Operaciones" and "Catálogo" headings are shown

#### Scenario: Headings hidden when collapsed

- GIVEN the sidebar is collapsed
- WHEN viewing the nav list
- THEN section headings are hidden

### Requirement: Tab Navigation

Clicking a nav item MUST update `activeTab` and display the corresponding content panel.

#### Scenario: Click changes active tab

- GIVEN the sidebar is rendered
- WHEN the user clicks a nav item different from the active one
- THEN `activeTab` updates and the matching panel replaces the previous one

#### Scenario: Active tab survives toggle

- GIVEN a tab is active
- WHEN the sidebar collapses or expands
- THEN the active tab remains unchanged

### Requirement: Active and Hover States

The active nav item MUST be visually distinct from inactive items. All nav items SHOULD show a hover state.

#### Scenario: Active item highlighted

- GIVEN the sidebar is rendered
- WHEN the item matching `activeTab` is displayed
- THEN it shows the active style (highlighted background/color); other items show default

#### Scenario: Hover feedback

- GIVEN the sidebar is rendered
- WHEN the user hovers over any nav item
- THEN it displays a hover background and pointer cursor

### Requirement: Badge Counts

Items with associated data SHOULD show an inline numeric badge when expanded. Badges MUST NOT render when collapsed.

#### Scenario: Badge visible when expanded

- GIVEN the sidebar is expanded
- WHEN a nav item has data entries
- THEN a badge with the count is displayed next to the label

#### Scenario: Badge hidden when collapsed

- GIVEN the sidebar is collapsed
- WHEN only icons are visible
- THEN badges are not displayed

### Requirement: Header Controls

The sidebar top MUST include the app logo, a refresh button, and a logout button.

#### Scenario: Header controls visible

- GIVEN the sidebar is rendered
- WHEN inspecting the top section
- THEN the logo, refresh, and logout button are visible
- AND clicking refresh reloads data; logout signs out
