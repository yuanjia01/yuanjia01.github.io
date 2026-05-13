# GEMINI.md

Context file for Google Gemini when working with this repository.

## Project Summary

Personal portfolio website for Armando Picón (devpicon) - Mobile Developer, Android Engineer, and Content Creator. Built with Next.js 14, TypeScript, and Tailwind CSS. Successfully redesigned from Jekyll to modern Next.js architecture.

## Current Status (2025-11-01)

The project is **COMPLETE and DEPLOYED**:
- Live at: **https://picon.dev** (custom domain configured and verified)
- All features implemented and working
- Automated content fetching configured
- GitHub Actions CI/CD fully operational
- Bilingual support (Spanish/English) active
- Google Analytics 4 integrated with GDPR compliance
- Cookie consent banner implemented
- Privacy Policy page complete

## Technology Stack

```
Framework:     Next.js 14 (App Router with SSG)
Language:      TypeScript
Styling:       Tailwind CSS
Theme:         next-themes (dark/light mode)
Animations:    Framer Motion, Lucide React
i18n:          next-intl (ES/EN - COMPLETE)
Newsletter:    Mailchimp integration
Deployment:    GitHub Pages
Automation:    GitHub Actions
```

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Key Features Implemented

1. **Responsive Design**
   - Mobile-first approach
   - Hamburger menu for mobile
   - Grid layout: 3-col (desktop) → 2-col (tablet) → 1-col (mobile)

2. **Theme Management**
   - Dark mode (default)
   - Light mode toggle
   - Smooth transitions using next-themes

3. **Animated Hero Section**
   - Typing animation effect
   - Cycles through professional roles
   - Uses Framer Motion

4. **Content Cards**
   - Latest YouTube video
   - Latest podcast episode
   - Latest blog posts (Dev.to and Medium)
   - Auto-fetched via GitHub Actions

5. **Image Optimization**
   - All images converted to WebP
   - 96% size reduction (10.5 MB → 459 KB)
   - Sharp library for processing

## GitHub Actions Workflows

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)
- **Trigger**: Push to master branch
- **Purpose**: Build and deploy site to GitHub Pages
- **Process**: npm install → build → deploy to gh-pages branch

### 2. Update Content Workflow (`.github/workflows/update-content.yml`)
- **Trigger**: Manual only (workflow_dispatch)
- **Purpose**: Fetch latest content from external sources
- **Security**: Uses YOUTUBE_API_KEY from GitHub Secrets
- **Process**:
  1. Fetch YouTube videos via API
  2. Fetch Dev.to articles via API
  3. Fetch Medium articles via RSS
  4. Update `public/latest-content.json`
  5. Create PR for review (not direct push)

## API Integrations

### YouTube Data API v3
- **Channel ID**: UCX9NJ471o7Wie1DQe94RVIg
- **Endpoint**: `https://www.googleapis.com/youtube/v3/search`
- **Authentication**: API key stored in GitHub Secrets
- **Fetches**: Most recent video from personal channel

### Spotify Web API
- **Show ID**: 1iyrRtXu0hrOQJyA7vdGiX
- **Endpoint**: `https://api.spotify.com/v1/shows/{id}/episodes`
- **Authentication**: Client Credentials OAuth flow (SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET)
- **Token Endpoint**: `https://accounts.spotify.com/api/token`
- **Fetches**: Latest podcast episode with metadata and cover art

### Dev.to API
- **Endpoint**: `https://dev.to/api/articles?username=devpicon`
- **Authentication**: Public API (no key required)
- **Fetches**: Latest published articles

### Medium RSS
- **Endpoint**: `https://medium.com/feed/@devpicon`
- **Format**: RSS/XML parsed to JSON
- **Fetches**: Latest published articles

## Project Structure

```
devpicon.github.io/
├── .github/workflows/       # GitHub Actions
│   ├── deploy.yml          # Deployment workflow
│   └── update-content.yml  # Content fetching workflow
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AnimatedText.tsx
│   │   ├── ContentCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── Footer.tsx
│   └── styles/
│       └── globals.css
├── public/                 # Static assets
│   ├── avatar.webp
│   ├── devpicon-logo-blanco.webp
│   ├── devpicon-logo-negro.webp
│   └── latest-content.json # Auto-updated content
├── scripts/
│   └── optimize-images.js  # Image optimization script
├── API_SETUP.md           # API configuration guide
├── GITHUB_SECRETS_SETUP.md
├── YOUTUBE_QUICKSTART.md
├── IMAGE_OPTIMIZATION.md
└── CONTENT_GUIDE.md
```

## Design System

### Colors
```css
Background Dark:  #0b0f19
Text Primary:     #e5e5e5
Accent Blue:      #3b82f6
Accent Yellow:    #facc15
```

### Typography
- Font: Inter (Google Fonts)
- Responsive: CSS clamp() for fluid scaling

### Animations
- Transitions: 150-300ms duration
- Typing effect: Framer Motion
- Theme toggle: Smooth fade transitions

## Important Configuration Files

### `tailwind.config.ts`
Centralized color palette, typography, and responsive breakpoints.

### `next.config.js`
```javascript
output: 'export'          // Static site generation
images: { unoptimized }   // For GitHub Pages compatibility
basePath: ''              // Custom domain configured
```

### `package.json` - Key Dependencies
- next: 14.2.21
- react: 18.3.1
- typescript: 5.7.2
- tailwindcss: 3.4.17
- framer-motion: 11.15.0
- next-themes: 0.4.4
- lucide-react: 0.469.0

## Security Notes

1. **API Keys**: Store in GitHub Secrets, never commit to repository
2. **Workflow Permissions**: Update Content workflow creates PRs (not direct push)
3. **Manual Trigger**: Content updates require manual approval
4. **Environment Variables**:
   - `process.env.YOUTUBE_API_KEY` - YouTube Data API
   - `process.env.SPOTIFY_CLIENT_ID` - Spotify Client ID
   - `process.env.SPOTIFY_CLIENT_SECRET` - Spotify Client Secret
5. **OAuth Flow**: Spotify uses Client Credentials flow with automatic token management

## Performance Metrics

- **Image Optimization**: 96% reduction in size
- **Build Time**: ~20-30 seconds
- **Deploy Time**: ~1-2 minutes
- **Target Lighthouse Score**: > 90

## Navigation Structure

- Home (/)
- Acerca de (About)
- Podcast
- Mis Redes (Social Media)
- Contacto (Contact)

## Social Links

- GitHub: https://github.com/devpicon
- LinkedIn: https://linkedin.com/in/devpicon
- Twitter: https://twitter.com/devpicon
- YouTube: https://youtube.com/@devpicon
- Instagram: https://instagram.com/devpicon

## Deployment Information

- **Hosting**: GitHub Pages
- **Branch**: gh-pages (auto-generated)
- **Source Branch**: master
- **Custom Domain**: picon.dev (via CNAME)
- **SSL**: Enforced by GitHub Pages

## Latest Update (2025-11-01)

### Custom Domain Configuration - COMPLETE
- Custom domain **picon.dev** fully configured
- Namecheap DNS records set up:
  - A records to GitHub Pages IPs (185.199.108.153, etc.)
  - CNAME for www subdomain
- CNAME file in repository root
- SSL certificate active and verified
- Site accessible at https://picon.dev and https://www.picon.dev

### Google Analytics 4 Implementation - COMPLETE ✅
- GA4 tracking code integrated (G-WRZ0G12DGD)
- **PROPERLY IMPLEMENTED** Google Consent Mode v2 following official Google Tag Platform documentation
- Removed @next/third-parties package (insufficient control for consent mode)
- Direct gtag.js implementation with correct script loading order:
  1. Default consent (beforeInteractive) - all denied
  2. gtag.js library (afterInteractive)
  3. gtag initialization (afterInteractive)
- GDPR-compliant consent mode v2:
  - All storage types denied by default
  - Consent updates properly when user accepts/rejects
  - dataLayer initialized correctly
  - Consent update commands sent properly
- Page view tracking configured
- Custom event tracking for newsletter signup
- **VERIFIED** with Google Tag Assistant - all checks passing ✅

### GDPR Cookie Consent - COMPLETE ✅
- CookieConsent component with bilingual support
- Bottom banner, non-intrusive design
- Accept/Reject buttons with clear actions
- Preference stored in localStorage (365 days)
- **PROPERLY INTEGRATED** with Google Analytics Consent Mode v2:
  - Ensures gtag initialized before updates
  - Sends correct consent update commands
  - Console debugging for verification
  - Tested and working correctly
- Fully translated in Spanish and English
- GDPR compliant for EU visitors

### Privacy Policy Page - COMPLETE
- Comprehensive Privacy Policy at `/[locale]/privacy-policy`
- Bilingual content (Spanish/English)
- Covers: data collection, cookies, analytics, user rights
- Contact information for privacy requests
- Added to Footer navigation
- Fully responsive design
- GDPR compliant with clear explanations

### Consent Mode v2 Fix (Continuation Session) - COMPLETE ✅
**Issue**: Initial implementation didn't properly update consent on user interaction
**Solution**: Rewrote following official Google documentation
- Removed abstraction library (@next/third-parties)
- Direct gtag.js implementation
- Fixed script loading order
- Proper dataLayer initialization
- Verified with Tag Assistant
- All consent flows working correctly

### Previous Update (2025-10-31)

#### Internationalization Complete
- Full Spanish/English support with next-intl
- Browser language auto-detection
- Language switcher in navbar (ES/EN flags)
- Translation files: `/messages/es.json`, `/messages/en.json`
- Locale routing: `/es/*` and `/en/*`
- SEO metadata translated
- All pages and components fully translated

#### Mailchimp Newsletter Integration
- Email subscription form on Contact page
- Simplified to email-only (removed name/phone)
- Working form submission to Mailchimp
- Translated success/error messages
- Embedded form styling

#### Navigation Improvements
- Fixed links to include locale prefix
- Special note in English about Spanish content
- Improved mobile menu translations

## Next Steps / Future Enhancements

1. ~~Complete i18n implementation (Spanish/English)~~ ✅ DONE
2. ~~Implement contact form~~ ✅ DONE (with newsletter)
3. Add more sections (About, Portfolio)
4. Implement podcast feed integration (RSS/Spotify)
5. Add blog section with MDX support
6. Enhance SEO with dynamic metadata
7. Add analytics tracking (Google Analytics or privacy-focused)

## Troubleshooting

### Content Not Updating
- Check GitHub Secrets for YOUTUBE_API_KEY
- Verify workflow runs in Actions tab
- Review PR created by workflow

### Build Failures
- Check Node.js version (requires 20+)
- Verify all dependencies installed
- Review build logs in GitHub Actions

### Images Not Loading
- Ensure images are in `public/` directory
- Check WebP format compatibility
- Verify paths are absolute (start with `/`)

## Documentation Reference

For detailed information on specific topics, refer to:
- `API_SETUP.md` - API configuration and setup
- `GITHUB_SECRETS_SETUP.md` - GitHub Secrets configuration
- `YOUTUBE_QUICKSTART.md` - YouTube API quick start
- `IMAGE_OPTIMIZATION.md` - Image optimization process
- `CONTENT_GUIDE.md` - Content management guide
- `CLAUDE.md` - Claude-specific context and guidelines

---

Last Updated: 2025-11-01
Status: Production - Fully Deployed with Custom Domain, Analytics, and GDPR Compliance
Latest Commits:
- 0686316 (fix: ensure gtag properly initialized in CookieConsent)
- 2bf7fc5 (fix: implement proper Google Consent Mode v2 with gtag.js)
- d7625a9 (feat: Privacy Policy with GDPR compliance)
- 3c3281e (feat: Google Analytics 4 with GDPR consent)
- 8625839 (docs: custom domain documentation)
