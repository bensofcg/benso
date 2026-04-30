# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `PriceDisplay` component for consistent price formatting with `$` symbol
- Testimonial auto-scroll carousel with hover pause (25s cycle)
- `scripts/fix-supabase-encoding.js` for database encoding corrections
- Decorative `→` arrows in "Ver más" section links
- Responsive breakpoints at 992px, 768px, 480px, and 360px
- Admin panel styles (login, header, navigation, data tables, forms)
- Missing CSS styles: `.service-card`, `.timeline`, `.testimonial-card-carousel`, `.filter-btn`, `.icon-svg`, `.contact-section`, `.gallery-grid`
- `@keyframes testimonialScroll` for auto-scroll animation

### Changed
- Migrated from Vite + React SPA to Next.js 16 with static export
- Fixed WhatsApp brand colors from `#002c6a` to `#25D366` (green) and hover to `#1ebe5d`
- Fixed footer background from `var(--primary)` to `var(--dark)`
- Fixed bento-card sizing to match original: `h3: 1.5rem`, `padding: 2rem`, `gap: 1rem`
- Fixed card price from `1.1rem` to `1.5rem`
- Fixed brands marquee animation speed from 30s to 20s
- Fixed text-cta-link styles to match original (border-bottom hover instead of underline)
- Fixed promo-banner styles to match original (flex layout, white background, z-index)
- Restored original `.bento-grid` gap and padding values
- Removed duplicate CSS rules for `.bento-grid-center`, `.faq-item`, `.faq-question`

### Fixed
- **Database encoding**: Corrected UTF-8 corruption () in 26 productos, 5 servicios, and 3 eventos records in Supabase
- **Prices in descriptions**: Fixed missing `$` signs and digit placeholders (`,500` → `$1,500`)
- **Duplicate CSS imports**: Removed `globals.css` imports from `(main)/layout.tsx` and `admin/layout.tsx`
- **Unused import**: Removed `useCart` from `AdminPanel.tsx` (caused context errors)
- **Spanish accents** in all TSX components:
  - `Consultoría`, `Capacitación`, `Ética`, `Innovación`, `Misión`, `Visión`
  - `¿Por qué elegirnos?`, `Línea del Tiempo`, `Contraseña`, `Añadir`, `Teléfono`
  - `Pósters`, `Ampliación`, `Presentación`, `señalética`, `rígido`, `cordón`
  - `Capacitación`, `duración`, `técnicas`, `negociación`, `transformación`, `tecnología`
  - `decoración`, `vítrinas`, `imágenes`, `fotográfica`, `cromada`, `resolución`
  - `código`, `menú`, `línea`

### Removed
- `TestimonialCarousel` from HomePage (replaced with static bento-grid cards matching original)

## [1.0.0] - 2026-04-10

### Added
- Initial Next.js migration from Vite + React SPA
- Next.js 16 App Router with route groups
- Static export configuration (`output: "export"`)
- Supabase integration for products, services, events, orders, and appointments
- Shopping cart with localStorage persistence
- Admin panel at `/admin` with password protection
- WhatsApp integration for direct product/service inquiries
- Bento grid layout system for products and services
- Scroll reveal animations
- FAQ accordion
- Responsive mobile menu
- Custom font loading (Cocogoose Pro + TT Commons)

[Unreleased]: https://github.com/bensofcg/benso-nextjs/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bensofcg/benso-nextjs/releases/tag/v1.0.0
