# Armando Picón - Portfolio Website

Personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Showcasing work as a Mobile Developer, Android Engineer, and Content Creator.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **i18n**: next-intl (ES/EN support - in progress)
- **Deployment**: GitHub Pages

## 🎨 Features

- ✨ Modern and minimalist design
- 🌗 Dark mode (default)
- 📱 Fully responsive layout
- ⚡ Optimized performance (Static Site Generation)
- 🎭 Smooth animations and transitions
- 🔤 Animated typing text effect
- 🎯 SEO optimized
- ♿ Accessibility compliant (WCAG)

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm

### Installation

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

The development server will be available at [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AnimatedText.tsx
│   │   ├── ContentCard.tsx
│   │   └── Footer.tsx
│   ├── styles/             # Global styles
│   │   └── globals.css
│   └── locales/            # i18n translations (planned)
│       ├── es/
│       └── en/
├── public/                 # Static assets
├── .github/workflows/      # GitHub Actions
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 🎯 Design System

### Colors

- **Background Dark**: `#0b0f19`
- **Text Primary**: `#e5e5e5`
- **Accent Blue**: `#3b82f6`
- **Accent Yellow**: `#facc15`

### Typography

- **Font Family**: Inter (Google Fonts)
- **Responsive scaling**: Using CSS `clamp()`

## 🚢 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

```bash
# Build the project
npm run build

# The output will be in the ./out directory
```

## 🌐 Custom Domain

Configured with custom domain: [picon.dev](https://picon.dev)

## 📝 License

© 2025 Armando Picón. All rights reserved.

## 🔗 Social Links

- [GitHub](https://github.com/devpicon)
- [LinkedIn](https://linkedin.com/in/devpicon)
- [Twitter](https://twitter.com/devpicon)
- [YouTube](https://youtube.com/@devpicon)
- [Instagram](https://instagram.com/devpicon)

---

Built with ❤️ and code
