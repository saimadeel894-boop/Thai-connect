# ThaiConnect

ThaiConnect er en dual-webapp platform bestående af:
- **User Site**: Mobile-first webapp (PWA-klar)
- **Admin Platform**: Desktop-first kontrol- og data-platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (anbefalet) eller npm

### Installation

```bash
# Clone repository
git clone https://github.com/johnkorsgaaard-beep/thaiconnect.git
cd thaiconnect

# Install dependencies
pnpm install
# eller: npm install

# Setup environment variables
# Opret .env.local fil manuelt (se ENV-SETUP.md for detaljer)
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here" >> .env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
# Rediger .env.local med dine faktiske Supabase credentials

# Start development server
pnpm dev
# eller: npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) i din browser.

## 📁 Projekt Struktur

```
/app
  /user           # User-site (mobile-first)
  /admin          # Admin platform (desktop-first)
  /api            # API routes
/components
  /user           # User-specific komponenter
  /admin          # Admin-specific komponenter
  /shared         # Delte komponenter
/lib
  /supabase       # Supabase client & utilities
  /utils          # Generelle utilities
/types            # TypeScript type definitions
/public           # Static assets
```

## 🔐 Authentication

Projektet bruger Supabase Auth med rolle-baseret adgang:
- **User**: Adgang til user-site
- **Admin**: Adgang til admin-platform

**Første gang setup**: Se [ENV-SETUP.md](ENV-SETUP.md) for detaljeret guide til Supabase konfiguration.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase
- **Package Manager**: pnpm

## 📝 Development Workflow

Se MASTER PROMPT for detaljeret workflow og branch-håndtering.

### Branch Naming
- `feature/<navn>` - Nye features
- `fix/<navn>` - Bug fixes
- `refactor/<navn>` - Code refactoring
- `hotfix/<navn>` - Kritiske fixes

## 🧪 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

## 🌐 Deployment

Projektet er sat op til deployment på Vercel eller lignende Next.js hosting.

## 📄 License

Private project.
