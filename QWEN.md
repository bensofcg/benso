# QWEN.md - BENSO Next.js Project

## Project Overview

**BENSO** is a static e-commerce website built with Next.js 16, serving as a business consulting and printing services platform. The project is a migration from an original Vite + React SPA (located in `C:\Users\USUARIO\benso`) to Next.js 16 with static export. The site is configured for `output: "export"` and deployed as a static site.

### Core Features
- **Product Catalog**: 25 printing products (stickers, posters, business cards, banners, etc.) with category filtering
- **Services**: 8 consulting and training services with category filtering
- **Events**: Upcoming training sessions and workshops with status tracking (En Curso / Próximamente)
- **Shopping Cart**: Client-side cart with localStorage persistence, quantity controls, and checkout modal
- **Order System**: Orders saved to Supabase `pedidos` table
- **Admin Panel**: Full CRUD admin dashboard at `/admin` with tabs for products, services, events, orders, and appointments
- **WhatsApp Integration**: Direct ordering via WhatsApp links (phone: +53 55609099)
- **Responsive UI**: Modern bento-grid layout with scroll-reveal animations

### Architecture
```
src/
├── app/                      # Next.js App Router
│   ├── (main)/               # Main site routes with route group
│   │   ├── contacto/
│   │   ├── eventos/
│   │   ├── nosotros/
│   │   ├── productos/
│   │   ├── servicios/
│   │   ├── layout.tsx        # CartProvider + global layout
│   │   ├── page.tsx          # HomePage
│   │   └── not-found.tsx
│   ├── admin/                # Admin panel (password-protected)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx            # Root layout (imports globals.css ONCE)
│   └── globals.css           # Global styles (~3200 lines)
├── components/               # Reusable UI components
│   ├── pages/                # Page-level components
│   │   ├── HomePage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── NotFound.tsx
│   ├── AdminPanel.tsx        # Admin dashboard UI
│   ├── Background.tsx        # Parallax blur circles
│   ├── BentoCard.tsx         # Primary card component
│   ├── Cart.tsx              # Shopping cart FAB + panel
│   ├── CheckoutModal.tsx     # Order checkout form
│   ├── FAQAccordion.tsx      # FAQ accordion component
│   ├── Footer.tsx            # Site footer
│   ├── Header.tsx            # Site header with mobile menu
│   ├── Icon.tsx              # SVG icon system (18 icons)
│   ├── index.ts              # Barrel exports
│   ├── PriceDisplay.tsx      # Price formatting component
│   ├── PromoBanner.tsx       # Auto-scrolling promo banner
│   ├── ScrollReveal.tsx      # IntersectionObserver reveal animation
│   ├── StatusIcon.tsx        # Status indicator (play/clock)
│   ├── CalendarIcon.tsx      # Calendar icon SVG
│   ├── Carousel.tsx          # Horizontal scroll carousel
│   └── TestimonialCarousel.tsx # Auto-scroll testimonial carousel
├── context/
│   └── CartContext.tsx       # Global cart state with localStorage
├── data/                     # Static JSON reference data
│   ├── products.json         # 25 products with prices
│   ├── services.json         # 8 services with prices
│   ├── events.json           # Events (current + upcoming)
│   ├── faqs.json             # FAQ items
│   ├── testimonials.json     # Testimonial quotes
│   └── categories.json       # Filter categories
├── hooks/
│   ├── useCart.ts            # Cart context hook
│   ├── useData.ts            # Supabase data hooks
│   └── useSupabase.ts        # Supabase utilities
├── lib/
│   ├── supabase.ts           # Supabase client (anon key)
│   └── priceUtils.ts         # Price formatting utilities
└── scripts/
    ├── fix-supabase-encoding.js  # DB encoding fix script
    ├── supabase-setup.ts
    └── supabase-schema.sql

supabase/
├── functions/                # Supabase Edge Functions
│   └── migrate-prices/
├── migrations/               # DB migration scripts (SQL + PS1)
└── .temp/

public/                       # Static assets
├── assets/logos/             # SVG logos
├── *.ttf                     # Cocogoose Pro font files
└── *.otf                     # TT Commons font files
```

## Technologies

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.2.3 |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Build | Turbopack |
| Styling | Custom CSS with CSS variables (no CSS framework) |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Linting | ESLint with next/core-web-vitals |

## Building and Running

### Development
```bash
npm run dev      # Start dev server on localhost:3000
```

### Production
```bash
npm run build    # Build static site (outputs to out/)
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Static Export
Configured in `next.config.ts`:
- `output: "export"` - Generates static HTML
- `trailingSlash: true` - Adds trailing slashes to URLs
- `images.unoptimized: true` - Disables Next.js image optimization

## Database Schema (Supabase)

### Tables
| Table | Description | Key Fields |
|-------|-------------|------------|
| `productos` | 25 printing products | id, title, description, price (string), price_num (number), category, icon, popular, whatsapp_link, is_active |
| `servicios` | 8 consulting services | id, title, description, price (string), price_num (number), category, icon, popular, whatsapp_link, is_active, price_type |
| `eventos` | Events/workshops | id, title, description, date, status, whatsapp_link, is_active |
| `pedidos` | Customer orders | id, customer_name, customer_email, items (JSON), total_price, status, created_at |
| `citas` | Appointment requests | id, nombre, email, telefono, mensaje, fecha_creacion |

### Access Keys
- **Anon key** (client-side, read-only for public tables): Used in `src/lib/supabase.ts`
- **Service role key** (server-side, full access): Used in `scripts/fix-supabase-encoding.js` for data corrections

### Custom Hooks (`src/hooks/useData.ts`)
- `useProductos()` - Fetches active products ordered by popularity
- `useServicios()` - Fetches active services
- `useEventos()` - Fetches active events ordered by creation date

## CSS Architecture (`src/app/globals.css`)

### Design System
```css
--primary: #002c6a;    /* Dark blue */
--secondary: #00419d;  /* Medium blue */
--accent: #0056d0;     /* Bright blue */
--white: #ffffff;
--light-gray: #e6e6e6;
--dark: #001737;       /* Very dark blue */
--whatsapp: #25D366;   /* WhatsApp green */
--whatsapp-hover: #1ebe5d;
```

### Font Stack
- **Cocogoose Pro** (trial) - Headings (weights: 300, 350, 400, 700)
- **TT Commons Pro** - Body text and fallback for accented characters (weights: 400, 500, 700)
- **Important**: Cocogoose trial does NOT include accented Latin characters. The `unicode-range` fallback maps digits/currency symbols to TT Commons. Accented characters naturally fall back to TT Commons via the browser's font cascade.

### Key Sections in globals.css
1. Font face declarations (@font-face)
2. Reset & base styles
3. Header & navigation (including mobile menu toggle)
4. Hero section with gradient background
5. Carousel component styles
6. Bento grid system (`.bento-grid`, `.bento-grid-center`, `.bento-card`)
7. Section styles (blur effects, alternating backgrounds)
8. Service catalog (`.service-card`, `.product-image-container`, `.category-tag`)
9. Testimonials (`.testimonial-card`, `.testimonial-card-carousel`)
10. Contact form (`.contact-section`, `.form-group`)
11. Gallery grid
12. Footer
13. Horizontal card layout
14. Responsive breakpoints (992px, 768px, 480px, 360px)
15. FAQ accordion
16. Card price display
17. SVG icon styles
18. Text CTA links (`.text-cta-link` with border-bottom hover)
19. Brands marquee
20. Vertical timeline (`.timeline`, `.timeline-item`, `.timeline-dot`)
21. Utility classes
22. Scroll reveal animations (`.reveal-section`, `.is-visible`)
23. Promotional banner (auto-scroll with pause on hover)
24. Shopping cart (FAB, overlay, panel)
25. Admin panel styles (login, header, nav, tables, forms)

### Important CSS Notes
- **Only the root `layout.tsx` should import `globals.css`**. Do NOT import it in `(main)/layout.tsx` or `admin/layout.tsx` (causes duplicate stylesheet injection).
- No duplicate `.bento-grid-center`, `.faq-item`, or `.faq-question` rules (previously caused conflicts).
- Card sizing: `h3: 1.5rem`, `padding: 2rem`, `gap: 1rem`, `.card-price: 1.5rem`

## Price Display System

### `src/lib/priceUtils.ts`
```typescript
formatPrice(num)     // 0 → "Gratis", 5000 → "$5,000", 465.50 → "$465.50"
extractNumberFromPrice(str)  // "Desde $5,000" → 5000
```

### `src/components/PriceDisplay.tsx`
- Detects "Desde" in price string → shows "Desde $X,XXX"
- If price is 0 → shows "Gratis" (not "Desde Gratis")
- For numeric prices → shows "$X,XXX" without unnecessary decimals
- Used in HomePage, ProductsPage, and ServicesPage

## Data Flow

1. **Products/Services/Events**: Fetched from Supabase at runtime via custom hooks
2. **Static JSON files** in `src/data/`: Reference data (not used at runtime for dynamic content)
3. **Cart**: Managed via `CartContext` with localStorage persistence
4. **Orders**: Submitted to Supabase `pedidos` table via `saveOrder()` in cart context

## Conventions

- **Path Aliases**: `@/*` maps to `./src/*`
- **Strict TypeScript**: `strict: true` enabled
- **React Server Components**: Default; use `'use client'` for interactive components
- **CSS**: Single `globals.css` file, no CSS modules or styled-components
- **ESLint**: Configured with `eslint-config-next`

## Supabase Configuration

- **Project URL**: `https://irhbkkfvcawklbahivii.supabase.co`
- **Client**: Initialized in `src/lib/supabase.ts` with anon key
- **Service role key**: Used in `scripts/fix-supabase-encoding.js` for database corrections

## Known Issues & Maintenance

### Database Encoding
The Supabase database had widespread UTF-8 encoding corruption () affecting titles, descriptions, and WhatsApp links in `servicios`, `productos`, and `eventos` tables. A fix script exists at `scripts/fix-supabase-encoding.js` that can be re-run with the service role key if needed:
```bash
node scripts/fix-supabase-encoding.js
```

### Font Accents
Cocogoose Pro trial font does not include accented Latin characters (á, é, í, ó, ú, ñ, etc.). The browser naturally falls back to TT Commons for these characters. This is the same behavior as the original Vite site — **no encoding issues in the CSS itself**.

### Text Content
All Spanish text in TSX components uses proper accents. Any new content added should include proper Spanish characters (Consultoría, Capacitación, Línea, Contraseña, Añadir, etc.).

## Changelog

### Migration Fixes (April 2026)
- Fixed duplicate `globals.css` imports in `(main)/layout.tsx` and `admin/layout.tsx`
- Restored complete CSS from original Vite project (2423 lines)
- Added missing styles: `.service-card`, `.timeline`, `.testimonial-card-carousel`, `.filter-btn`, `.icon-svg`, `.contact-section`, admin panel styles
- Fixed footer background from `var(--primary)` to `var(--dark)`
- Fixed WhatsApp colors to `#25D366` / `#1ebe5d`
- Fixed responsive breakpoints (992px, 768px, 480px, 360px)
- Removed unused `useCart` import from `AdminPanel.tsx`
- Fixed all Spanish accents in TSX components
- Created `PriceDisplay` component for consistent price formatting
- Fixed Supabase DB encoding corruption (26 productos, 5 servicios, 3 eventos records)
- Fixed prices in DB descriptions (missing `$` signs and digit placeholders)
- Fixed brands marquee speed from 30s to 20s
- Fixed text-cta-link styles to match original
- Fixed bento-card sizing to match original (h3: 1.5rem, padding: 2rem, gap: 1rem)
- Added testimonial auto-scroll carousel with hover pause
- Restored decorative arrows → in "Ver más" links
