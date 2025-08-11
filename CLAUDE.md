# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

This is a Next.js 15 personal portfolio site using the App Router with TypeScript, Tailwind CSS v4, and Motion/Framer Motion for animations. It features an automated blog system that discovers MDX files from the filesystem.

### Key Architecture Patterns

**Server/Client Component Split:**
- Server components handle data fetching (e.g., `app/page.tsx` loads blog posts)
- Client components handle interactivity and animations (e.g., `components/personal-client.tsx`)
- Blog posts are server-side rendered from MDX files

**Automated Blog System:**
- Blog posts are MDX files in `app/blog/[slug]/page.mdx` format
- `getBlogPosts()` function automatically discovers and processes blog posts
- Metadata extracted from `export const metadata = { title, description }` in MDX files
- No manual registration required - just add files and they appear

**Animation Architecture:**
- Consistent animation variants and transitions defined in `components/home/animations.ts`
- All sections use Motion with `VARIANTS_SECTION` and `TRANSITION_SECTION`
- Performance-optimized motion components throughout

### Core File Structure

```
app/
├── page.tsx                    # Homepage server component
├── layout.tsx                  # Root layout
├── data.ts                     # Static data (projects, work experience, social links)
├── blog/[slug]/page.mdx        # Individual blog posts
└── blog/page.tsx               # Blog listing page

components/
├── personal-client.tsx         # Main client wrapper
├── home/                       # Homepage sections
│   ├── intro-section.tsx
│   ├── projects-section.tsx
│   ├── work-experience-section.tsx
│   ├── blog-section.tsx
│   ├── connect-section.tsx
│   └── animations.ts           # Animation constants
└── ui/                         # Reusable UI components

lib/
├── blog.ts                     # Blog post discovery and processing
├── types.ts                    # TypeScript type definitions
├── utils.ts                    # General utilities
└── constants.ts                # App constants
```

## Adding New Content

**Blog Posts:**
1. Create directory: `app/blog/your-slug/`
2. Add file: `app/blog/your-slug/page.mdx`
3. Include metadata export:
```typescript
export const metadata = {
  title: 'Your Post Title',
  description: 'Post description'
}
```

**Static Data:**
Edit `app/data.ts` to add projects, work experience, or social links.

## Development Patterns

**Component Structure:**
- Use TypeScript interfaces for all props
- Follow existing animation patterns with variants and transitions
- Use absolute imports with `@/` prefix
- Server components for data, client components for interactivity

**Import Organization:**
1. React/Next.js imports
2. Third-party libraries (Motion, etc.)
3. Internal imports with `@/` prefix
4. Relative imports (minimize)

**Styling:**
- Tailwind CSS with custom theme system
- Dark/light mode support via `next-themes`
- Responsive design patterns established

## Build Process

The project builds to static files suitable for any hosting platform. The build automatically:
- Discovers and processes all blog posts
- Optimizes images and assets
- Generates static HTML with proper metadata
- Creates optimized JavaScript bundles

## Important Notes

- Blog posts use MDX with support for React components, KaTeX math, Mermaid diagrams, and code highlighting
- Animation performance is optimized using Motion/Framer Motion best practices
- The site is fully responsive and accessible
- TypeScript is configured with strict mode and path aliases
- ESLint includes Next.js, TypeScript, and Prettier configurations