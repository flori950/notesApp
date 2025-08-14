# Notes App - Copilot Instructions

## Architecture Overview

This is a **React 19 + TypeScript + Vite 7** notes application with session-based storage, advanced theming, and security features. The app uses a **single-page architecture** with component-based design patterns and glass morphism UI.

### Key Components & Data Flow
- **App.tsx**: Root component with ErrorBoundary → SEOHead → Index page
- **pages/Index.tsx**: Main layout with security initialization, header, and notes app
- **components/notes/NotesApp.tsx**: Core notes logic with session storage persistence
- **components/ThemeControl.tsx**: Theme/accent color management using custom CSS properties
- **hooks/use-session-storage.ts**: TypeScript-safe session storage hook with error handling

## Critical Development Patterns

### 1. Session Storage Strategy
- All data persists via `useSessionStorage<T>()` hook, not localStorage
- Notes are stored as `Note[]` array with full CRUD operations
- Theme settings persist: `theme: 'light'|'dark'` and `accent: AccentColor`

### 2. Security & Rate Limiting
- **Always import**: `import { securityManager } from '../utils/security'`
- **Rate limit user actions**: `securityManager.checkRateLimit('action_name')` before operations
- Security manager auto-initializes CSP, honeypots, and bot detection in Index.tsx

### 3. React 19 Head Management
- **Never** put SEO meta tags in `index.html` - use `SEOHead.tsx` component
- All head content managed via `react-helmet-async` with `HelmetProvider` in main.tsx
- Minimal index.html keeps React 19 compatibility

### 4. Theming System
- CSS custom properties in `:root` and `[data-theme="dark"]` selectors
- Dynamic accent colors via `[data-accent="blue|purple|emerald|orange|pink|mint"]`
- Glass morphism with `backdrop-filter: blur()` and rgba backgrounds

## Development Workflow

### Essential Commands
```bash
npm run dev          # Vite dev server (requires Node 20.19.0+)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint with React 19 rules
npm install --legacy-peer-deps  # Required for react-helmet-async
```

### Build Optimization
- Manual chunks in vite.config.ts: `react-vendor`, `pdf-vendor`, `canvas-vendor`
- Chunk size limit increased to 1MB for PDF/canvas libraries
- TypeScript strict mode with `tsc -b` before Vite build

## Component Conventions

### State Management
- Use `useSessionStorage<T>()` for persistent state, `useState()` for ephemeral
- Rate limiting pattern: check `securityManager.checkRateLimit()` before actions
- Toast notifications via callback pattern in NotesApp

### Styling Patterns
- Tailwind utility classes + custom CSS properties for theming
- Glass effect classes: `glass-nav`, `card`, `ambient-header`
- Responsive design with mobile-first sidebar toggling

### TypeScript Patterns
- Strict interface definitions for all data structures (`Note`, `Theme`, `AccentColor`)
- Custom hook return types: `[T, setter, remover]` for session storage
- Error boundary wrapping with proper TypeScript error typing

## External Dependencies

### Core Stack
- **React 19.1.1** with strict mode and new head management rules
- **Vite 7.1.2** with React plugin and manual chunking
- **Tailwind CSS 4.1.11** with PostCSS integration
- **react-helmet-async 2.0.5** for dynamic head management (requires --legacy-peer-deps)

### Feature Libraries
- **jsPDF 3.0.1** for note export functionality
- TypeScript 5.9.2 with strict compilation settings

## Known Issues & Workarounds

1. **React Helmet Peer Deps**: Install with `--legacy-peer-deps` flag for React 19 compatibility
2. **Node Version**: Requires Node 20.19.0+ or 22.12.0+ for Vite 7 support
3. **SEO Migration**: All meta tags must be in React components, not HTML head
4. **Session vs Local Storage**: Intentionally uses sessionStorage for privacy/security
