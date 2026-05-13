# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Armando Picón (devpicon) built with Next.js 14, TypeScript, and Tailwind CSS. The project showcases Android development expertise, content creation (YouTube, podcasts, blog), and social media presence.

**Current State**: The complete redesign from Jekyll to Next.js is COMPLETE and deployed. The site is live at **https://picon.dev** (custom domain configured) with automated content fetching from YouTube, Dev.to, and Medium via GitHub Actions.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with SSG/hybrid rendering
- **Language**: TypeScript
- **Styling**: Tailwind CSS (centralized configuration in `tailwind.config.ts`)
- **Animations**:
  - Framer Motion (for typing animation effects)
  - Lucide React (iconography)
- **Theme Management**: next-themes (dark/light mode toggle)
- **Internationalization**: next-intl (Spanish and English support - in progress)
- **Content Automation**: GitHub Actions with YouTube Data API v3, Dev.to API, Medium RSS

## Architecture & Design Guidelines

### Visual Design System
- **Color Palette** (centralized in Tailwind config):
  - Background: `#0b0f19`
  - Text: `#e5e5e5`
  - Primary accent: Blue `#3b82f6`
  - Secondary accent: Yellow `#facc15`
- **Typography**: Sans-serif (Inter, Manrope, or Poppins)
- **Dark mode**: Default theme (with light mode toggle in topbar)
- **Max 3 main colors, max 2 typefaces**

### Component Structure
Expected component organization under `/components` or `/src/components`:
- `Navbar` - Sticky topbar with responsive hamburger menu for mobile
- `HeroSection` - Landing section with avatar and animated typing text
- `AnimatedText` - Typing animation cycling through professional roles
- `ContentCard` - Reusable card for displaying latest content (YouTube, podcast, blog)
- `Footer` - Social media links and copyright

### Key Features
1. **Hero Section**: Avatar with animated typing text cycling through: "Mobile Developer", "Android Engineer", "Technical Leader", "Speaker", "Designer", "Content Creator"
2. **Latest Content Section**: Three content cards displaying:
   - Latest YouTube video (via RSS/API v3)
   - Latest podcast episode (Spotify/RSS feed)
   - Latest blog post (Dev.to API: `https://dev.to/api/articles?username=devpicon`)
3. **Responsive Design**: Desktop (3-column grid) → Tablet (2-column) → Mobile (1-column)

### i18n Implementation (COMPLETE - 2025-10-31)
- **Framework**: next-intl (fully integrated)
- **Languages**: Spanish (default), English
- **Translation Files**:
  - `/messages/es.json` - Complete Spanish translations
  - `/messages/en.json` - Complete English translations
- **Features**:
  - Browser language auto-detection
  - Language switcher in Navbar with flag icons
  - Locale-aware routing (`/es/*`, `/en/*`)
  - SEO metadata translated for both languages
  - All static text fully translatable
  - Special note in English version about Spanish content availability

### Performance Requirements
- Lighthouse score > 90
- Initial load < 1s (desktop), < 2s (mobile)
- Use `clamp()` for dynamic text scaling
- Optimize images, use web fonts efficiently

## Deployment & Automation

- **Host**: GitHub Pages
- **Repository**: `devpicon.github.io`
- **Domain**: `picon.dev` (configured via CNAME)
- **CI/CD**: Two GitHub Actions workflows:
  1. **Deploy workflow** (`.github/workflows/deploy.yml`): Builds and deploys to GitHub Pages on push to `master`
  2. **Update Content workflow** (`.github/workflows/update-content.yml`): Fetches latest content from YouTube, Dev.to, and Medium
     - Trigger: Manual only (workflow_dispatch)
     - Security: Uses GitHub Secrets for API keys (YOUTUBE_API_KEY)
     - Process: Creates a PR for review instead of direct push to master
- **Branch Strategy**: Work on feature branches, merge to `master` for deployment
- **Live Site**: https://devpicon.github.io

## GitHub Secrets Configuration

The following secrets must be configured in repository settings:
- `YOUTUBE_API_KEY`: YouTube Data API v3 key for fetching channel videos
- `SPOTIFY_CLIENT_ID`: Spotify API Client ID for fetching podcast episodes
- `SPOTIFY_CLIENT_SECRET`: Spotify API Client Secret for OAuth authentication
- Configure via: Repository Settings > Secrets and variables > Actions > New repository secret

See `GITHUB_SECRETS_SETUP.md` and `YOUTUBE_QUICKSTART.md` for detailed setup instructions.

## Accessibility

- Use `aria-labels` on all interactive elements
- Provide descriptive `alt` text for images
- Follow WCAG guidelines
- Ensure keyboard navigation works properly

## Important Files & Assets

- Logo assets in `public/`:
  - `devpicon-logo-blanco.webp` (optimized, light version for dark backgrounds)
  - `devpicon-logo-negro.webp` (optimized, dark version for light backgrounds)
  - `avatar.webp` (optimized profile avatar)
- All images have been optimized using Sharp (96% size reduction):
  - Original: 10.5 MB
  - Optimized: 459 KB
  - Format: WebP with 80% quality
- Content data stored in `public/latest-content.json` (auto-updated by GitHub Actions)
- Helper script: `scripts/optimize-images.js` for batch image optimization
- See `IMAGE_OPTIMIZATION.md` for details on optimization process

## Navigation Links

- Acerca de (About)
- Podcast
- Mis Redes (My Networks/Social Media)
- Contacto (Contact)

## Footer Social Links

Include icons for: GitHub, LinkedIn, Instagram, Twitter (X), YouTube

## Design Principles

- **Minimalist and professional**: Clean interface, limited color palette, proper use of whitespace
- **Smooth transitions**: 150-300ms for hover/focus states
- **Consistent visual identity**: Maintain cohesive branding throughout
- **Component reusability**: Build modular, DRY components
- **Responsive-first**: Mobile-first approach with fluid adaptability

## Recent Updates (2025-10-31)

### Complete Redesign from Jekyll to Next.js
- Migrated entire site from Jekyll static site generator to Next.js 14 with TypeScript
- Implemented modern component architecture with Tailwind CSS
- Added dark/light theme toggle with smooth transitions
- Created responsive navigation with mobile hamburger menu

### Image Optimization
- Batch optimized all images using Sharp library
- Converted PNG images to WebP format
- Reduced total image size by 96% (10.5 MB to 459 KB)
- Improved page load performance significantly

### Automated Content Fetching System
- Implemented GitHub Actions workflow to fetch latest content from:
  - YouTube Data API v3 (personal channel videos)
  - Dev.to API (latest blog posts)
  - Medium RSS feed (latest articles)
- Configured secure API key management via GitHub Secrets
- Changed workflow to create PRs instead of direct push for better security
- Set to manual trigger only (removed daily schedule)

### YouTube API Configuration
- Fixed YouTube Channel ID to fetch from correct personal channel
- Channel ID: UCX9NJ471o7Wie1DQe94RVIg
- Successfully tested and verified video fetching
- Created comprehensive setup documentation (YOUTUBE_QUICKSTART.md)

### Deployment & CI/CD
- Configured GitHub Pages deployment via GitHub Actions
- Automated build and deploy on push to master branch
- Site successfully deployed and live at https://devpicon.github.io
- Custom domain picon.dev configured

### Spotify API Integration (Latest - 2025-10-31)
- Implemented complete Spotify API integration using Client Credentials OAuth flow
- Added automatic token management and authentication
- Configured SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in GitHub Secrets
- Successfully fetches latest podcast episode with title, description, URL, date, and cover image
- Tested and verified working correctly with show ID: 1iyrRtXu0hrOQJyA7vdGiX
- All 4 content sources now fully automated:
  - YouTube (video) - YouTube Data API v3
  - Spotify (podcast) - Spotify Web API with OAuth
  - Dev.to (blog) - Dev.to REST API
  - Medium (blog) - Medium RSS feed

### Documentation Created
- `API_SETUP.md`: Comprehensive API configuration guide
- `GITHUB_SECRETS_SETUP.md`: GitHub Secrets setup instructions
- `YOUTUBE_QUICKSTART.md`: Quick YouTube API setup guide with helper script
- `IMAGE_OPTIMIZATION.md`: Image optimization process documentation
- `CONTENT_GUIDE.md`: Content fetching and management guide

### Latest Session Work (2025-11-01)

#### Custom Domain Configuration - COMPLETE
- Configured custom domain **picon.dev** with Namecheap DNS
- Updated DNS records:
  - A records pointing to GitHub Pages IPs
  - CNAME www subdomain pointing to devpicon.github.io
- Created CNAME file in repository root
- Verified domain propagation and SSL certificate
- Updated all documentation to reflect new domain
- Site now accessible at https://picon.dev and https://www.picon.dev

#### Google Analytics 4 Implementation - COMPLETE ✅
- Integrated Google Analytics 4 (Measurement ID: G-WRZ0G12DGD)
- **PROPERLY IMPLEMENTED** Google Consent Mode v2 following official Google Tag Platform documentation
- Removed @next/third-parties package (insufficient consent mode control)
- Direct gtag.js implementation with proper script loading order:
  1. Default consent state (beforeInteractive strategy) - all denied by default
  2. gtag.js script from Google CDN (afterInteractive strategy)
  3. gtag initialization with measurement ID (afterInteractive strategy)
- Consent mode defaults:
  - `analytics_storage: 'denied'`
  - `ad_storage: 'denied'`
  - `ad_user_data: 'denied'`
  - `ad_personalization: 'denied'`
- Consent updates dynamically when user accepts/rejects via cookie banner
- Properly configured page view tracking
- Newsletter subscription tracked as custom event 'newsletter_signup'
- **VERIFIED** with Google Tag Assistant - all checks passing ✅

#### GDPR Cookie Consent Banner - COMPLETE ✅
- Created CookieConsent component with bilingual support (ES/EN)
- Features:
  - Non-intrusive bottom banner
  - "Accept All" and "Reject All" buttons
  - Preference saved to localStorage
  - 365-day consent persistence
  - Automatic dismissal after choice
  - Fully translated in both languages
- **PROPERLY INTEGRATED** with Google Analytics Consent Mode v2:
  - Ensures gtag is initialized before sending consent updates
  - Sends proper consent update commands to dataLayer
  - Accept: Updates all consent types to 'granted'
  - Reject: Keeps all consent types as 'denied'
  - Console debugging for verification
- Complies with GDPR requirements for EU visitors

#### Privacy Policy Implementation - COMPLETE
- Created comprehensive Privacy Policy page (`/[locale]/privacy-policy/page.tsx`)
- Bilingual content (Spanish and English)
- Sections included:
  - Information collection details
  - Cookie usage explanation
  - Google Analytics tracking notice
  - User rights (access, rectification, deletion)
  - Contact information for privacy requests
  - Last updated date
- Added Privacy Policy link to Footer component
- Fully responsive and accessible design
- GDPR compliant with clear explanations

#### Consent Mode v2 Fix (Continuation Session) - COMPLETE ✅
**Problem**: Initial implementation did not properly update consent when users interacted with cookie banner
**Solution**: Complete rewrite following official Google documentation
- Removed @next/third-parties/google package
- Implemented direct gtag.js approach per Google Tag Platform docs
- Fixed script loading order (critical for consent mode)
- Added proper dataLayer initialization
- Ensured consent updates sent correctly from CookieConsent component
- Verified with Google Tag Assistant
- Tested consent flow: default deny → user accepts → consent granted → analytics tracks

#### All Features Tested and Working
- ✅ Custom domain resolving correctly
- ✅ SSL certificate active
- ✅ Google Analytics tracking page views (with consent)
- ✅ Cookie consent banner appearing for new visitors
- ✅ Consent preferences persisting correctly
- ✅ Consent Mode v2 properly updating on user action
- ✅ Tag Assistant verification passing
- ✅ Newsletter signup event tracking
- ✅ Privacy Policy accessible in both languages
- ✅ Footer links working properly
- ✅ All builds passing successfully
- ✅ Site deployed and live at https://picon.dev
- ✅ GDPR fully compliant

#### Commits Made This Session
- `8625839` - docs: update documentation with custom domain picon.dev
- `3c3281e` - feat: add Google Analytics 4 with GDPR cookie consent
- `d7625a9` - feat: add Privacy Policy page with GDPR compliance
- `2bf7fc5` - fix: implement proper Google Consent Mode v2 with gtag.js
- `0686316` - fix: ensure gtag is properly initialized in CookieConsent

### Previous Session Work (2025-10-31)

#### Full Internationalization Implementation
- Integrated next-intl for complete Spanish/English support
- Created comprehensive translation files:
  - `/messages/es.json` - 150+ translation keys
  - `/messages/en.json` - 150+ translation keys
- Implemented language switcher with flag icons (ES/EN)
- Added browser language detection on first visit
- Configured locale-aware routing with middleware
- Translated all components:
  - Home page (hero, sections, content cards)
  - Contact page (form, validation messages)
  - Navigation (navbar links, footer)
  - SEO metadata (titles, descriptions)
- Integrated Mailchimp newsletter subscription:
  - Simplified form (email only, removed name/phone)
  - Working form submission with correct URL
  - Translated success/error messages
  - Embedded form with proper styling
- Fixed navigation links to include locale prefix
- Added special note in English version about Spanish content

#### Commits Made (2025-10-31)
- `056db57` - Complete internationalization implementation with next-intl

### Key Technical Decisions
- Manual workflow trigger: Changed from daily automated runs to manual dispatch for better control
- PR-based updates: Content updates now create PRs for review before merging
- WebP format: Standardized on WebP for all images for optimal performance
- Master branch deployment: Simplified from feature branch workflow to direct master deployment
- next-intl for i18n: Chosen for its App Router compatibility and middleware-based routing
- Spanish as default: Primary audience is Spanish-speaking, English as secondary
- Mailchimp for newsletter: Established platform with good API and reliability
