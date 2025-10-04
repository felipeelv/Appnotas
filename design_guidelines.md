# Design Guidelines: Sistema de Avaliação Escolar

## Design Approach

**Selected Approach:** Design System (Material Design 3)
**Justification:** This is a utility-focused educational management system requiring information-dense displays, data tables, forms, and CRUD operations. Material Design excels at handling administrative interfaces with clear hierarchy and established patterns.

**Key Design Principles:**
- Clarity and efficiency over decoration
- Consistent data presentation patterns
- Quick information scanning
- Professional educational context
- Accessible to users with varying technical abilities

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 220 85% 55% (Professional blue)
- Primary Container: 220 90% 95%
- Secondary: 150 40% 50% (Success green)
- Error: 0 70% 50%
- Surface: 0 0% 98%
- Surface Variant: 220 15% 95%
- Outline: 220 10% 70%

**Dark Mode:**
- Primary: 220 80% 70%
- Primary Container: 220 70% 20%
- Secondary: 150 45% 60%
- Error: 0 80% 65%
- Surface: 220 15% 12%
- Surface Variant: 220 15% 18%
- Outline: 220 10% 40%

**Text Colors:**
- Light: Primary text 0 0% 15%, Secondary text 0 0% 45%
- Dark: Primary text 0 0% 95%, Secondary text 0 0% 70%

### B. Typography

**Font Family:** Inter (Google Fonts) for UI, Roboto as fallback
**Scale:**
- H1: 2rem (32px), font-semibold - Page titles
- H2: 1.5rem (24px), font-semibold - Section headers
- H3: 1.25rem (20px), font-medium - Card titles
- Body: 1rem (16px), font-normal - Default text
- Body Small: 0.875rem (14px), font-normal - Secondary info
- Caption: 0.75rem (12px), font-normal - Labels, hints

### C. Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, gap-2 (8px) - tight elements
- Standard spacing: p-4, gap-4 (16px) - most common
- Section spacing: p-6, p-8 (24-32px) - cards, containers
- Large spacing: p-12, p-16 (48-64px) - page sections

**Container Strategy:**
- Max width: max-w-7xl for main content
- Padding: px-4 on mobile, px-8 on desktop
- Grid layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for cards

### D. Component Library

**Navigation:**
- Sidebar navigation (desktop): 16rem width, fixed, icons + labels
- Top navigation bar: 64px height, logo left, user menu right
- Mobile: Bottom navigation or hamburger menu
- Active states: Primary color background with rounded corners

**Data Tables:**
- Striped rows for readability (alternate background)
- Hover states on rows (subtle surface variant color)
- Fixed header on scroll
- Action buttons: icon buttons on right side of rows
- Pagination: bottom center, showing "X-Y de Z registros"

**Forms:**
- Full-width inputs with labels above
- Required fields: asterisk (*) in label
- Error messages below fields in error color
- Success validation: subtle green border
- Floating action button for save/submit (bottom right on mobile)

**Cards:**
- Rounded corners (rounded-lg)
- Subtle shadow (shadow-sm)
- Padding: p-6
- Header with title and optional action button
- Divider between header and content

**Buttons:**
- Primary: Filled with primary color, white text
- Secondary: Outlined with primary color
- Text: No background, primary color text
- Heights: 40px standard, 36px compact
- Icons: 20px size, 8px gap from text

**Data Displays:**
- Stat cards: Large number, label below, icon optional
- List items: 56px height, avatar/icon left, text center, action right
- Empty states: Centered icon + message + action button
- Loading states: Skeleton screens matching content structure

**Dialogs/Modals:**
- Centered on screen
- Max width: max-w-md for forms, max-w-2xl for content
- Backdrop: bg-black/50
- Close button: top right corner
- Actions: bottom right, cancel left + primary right

### E. Animations

**Minimal Animation Strategy:**
- Hover transitions: 150ms duration
- Page transitions: None (instant navigation)
- Modal entrance: 200ms fade + scale from 95% to 100%
- Loading spinners: Only when necessary

---

## Page-Specific Layouts

**Dashboard/Home:**
- Summary cards in grid (3 columns desktop)
- Quick actions section
- Recent activity list

**List Pages (Turmas, Professores, etc.):**
- Search bar top left
- Add button top right
- Table with sortable columns
- Pagination footer

**Detail/Edit Pages:**
- Breadcrumb navigation
- Form in single column, max-w-2xl
- Save/Cancel buttons fixed at bottom on mobile

**Assignment Pages (Professor-Disciplina-Turma):**
- Multi-step form or tabbed interface
- Selection dropdowns with search
- Visual confirmation of selections

---

## Images

No hero images needed. This is an administrative system where efficiency trumps visual impact. Use icons from Material Icons library for:
- Navigation menu items
- Table action buttons
- Empty states
- Stat cards
- Form field prefixes

---

## Accessibility & Responsiveness

- Maintain contrast ratios: 4.5:1 for text, 3:1 for UI elements
- Focus indicators: 2px primary color outline
- All interactive elements: minimum 44x44px touch target
- Keyboard navigation: logical tab order
- Screen reader labels on icon-only buttons
- Mobile-first approach: stack columns, enlarge touch targets, simplify navigation