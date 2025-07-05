# Project Architecture

## 🏗️ Overview

This is a Next.js 15 minimalist personal portfolio site built with modern web technologies. The architecture follows a clean, component-based approach with server-side rendering and automated content management.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **Animation**: Motion/React (Framer Motion)
- **Content**: MDX for blog posts
- **Package Manager**: npm

## 📁 Project Structure

```
nim-minimalist-personal-site/
├── app/                          # Next.js App Router
│   ├── blog/                     # Blog posts (MDX files)
│   │   ├── [slug]/               # Dynamic blog routes
│   │   │   └── page.mdx          # Individual blog posts
│   │   └── page.tsx              # Blog listing page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage (server component)
│   ├── data.ts                   # Static data exports
│   ├── header.tsx                # Site header
│   └── footer.tsx                # Site footer
├── components/                   # React components
│   ├── home/                     # Homepage sections
│   │   ├── intro-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── work-experience-section.tsx
│   │   ├── blog-section.tsx
│   │   ├── connect-section.tsx
│   │   └── animations.tsx
│   ├── ui/                       # Reusable UI components
│   │   ├── animated-background.tsx
│   │   └── ...
│   └── personal-client.tsx       # Client wrapper component
├── lib/                          # Utility functions and types
│   ├── types.ts                  # TypeScript type definitions
│   ├── blog.ts                   # Blog post utilities
│   ├── utils.ts                  # General utilities
│   └── constants.ts              # App constants
├── providers/                    # React context providers
│   └── theme-provider.tsx        # Theme management
├── docs/                         # Documentation
└── public/                       # Static assets
```

## 🔄 Data Flow

### Static Data
- **Projects, Work Experience, Social Links**: Defined in `app/data.ts`
- **Theme Settings**: Managed through CSS custom properties and Tailwind

### Dynamic Data (Blog Posts)
1. **Server-side Loading**: `app/page.tsx` (server component) calls `getBlogPosts()`
2. **File System Scanning**: `lib/blog.ts` scans `app/blog/` directory
3. **Metadata Extraction**: Parses MDX files for metadata
4. **Client Hydration**: Passes data to `PersonalClient` component

## 🎨 Component Architecture

### Server Components
- `app/page.tsx` - Main page (loads blog posts server-side)
- `app/layout.tsx` - Root layout
- Blog post pages (`app/blog/[slug]/page.mdx`)

### Client Components
- `components/personal-client.tsx` - Main client wrapper
- All animation components (use Framer Motion)
- Interactive UI components

### Component Props Pattern
```typescript
interface SectionProps {
  variants: Variants      // Animation variants
  transition: Transition  // Animation transition
  className?: string      // Optional styling
  // + specific data props
}
```

## 🎯 Key Design Patterns

### 1. Server/Client Split
- Server components handle data fetching
- Client components handle interactivity and animations
- Clear separation of concerns

### 2. Automated Content Management
- Blog posts auto-discovered from file system
- Metadata extracted from MDX files
- No manual content registration required

### 3. Type Safety
- Comprehensive TypeScript definitions
- Strict type checking for all data structures
- Props interfaces for all components

### 4. Theme System
- CSS custom properties for theming
- Tailwind utility classes with theme prefixes
- Dark/light mode support through provider

### 5. Animation Architecture
- Consistent animation variants and transitions
- Centralized animation configuration
- Performance-optimized motion components

## 🔧 Build Process

1. **TypeScript Compilation**: Strict type checking
2. **Blog Post Discovery**: Server-side file system scanning
3. **Static Generation**: Pre-rendered pages for optimal performance
4. **Asset Optimization**: Automatic image and code optimization
5. **Bundle Analysis**: Optimized chunks and code splitting

## 🚀 Deployment Architecture

- **Static Export**: Fully static site generation
- **CDN Ready**: Optimized for content delivery networks
- **Zero Server Dependencies**: Can be deployed anywhere
- **Fast Loading**: Pre-rendered pages with optimized assets

## 🔍 Data Sources

### Content Sources
- **Blog Posts**: MDX files in `app/blog/[slug]/page.mdx`
- **Projects**: Static array in `app/data.ts`
- **Work Experience**: Static array in `app/data.ts`
- **Social Links**: Static array in `app/data.ts`

### Configuration Sources
- **Theme**: CSS custom properties + Tailwind config
- **Site Metadata**: `app/layout.tsx`
- **Build Config**: `next.config.mjs`

## 🛡️ Error Handling

### Blog System
- Graceful fallbacks for missing metadata
- Console warnings for problematic posts
- Empty array fallback for read errors

### Component Level
- Optional props with sensible defaults
- Error boundaries for client components
- TypeScript compile-time error prevention

