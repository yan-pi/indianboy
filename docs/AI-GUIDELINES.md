# AI Guidelines for Nim Minimalist Personal Site

## 🤖 Essential Information for AI Assistants

If you are an AI assistant working on this project, **read this document carefully**. It contains crucial information about project patterns, conventions, and best practices that will help you work effectively with this codebase.

## 🎯 Project Overview

This is a **Next.js 15 minimalist personal portfolio site** with:
- **Automated blog system** (no manual post registration required)
- **Server/Client component architecture**
- **TypeScript throughout**
- **Motion/React animations**
- **Custom theme system**
- **MDX-based blog posts**

## 🏗️ Key Architecture Principles

### 1. Server/Client Component Split
- `app/page.tsx` is a **server component** that loads blog posts
- `components/personal-client.tsx` is the **client wrapper** for animations
- **Never mix server-side code with client components**

### 2. Automated Blog System
- Blog posts are **automatically discovered** from `app/blog/[slug]/page.mdx`
- **DO NOT manually edit blog arrays** in `app/data.ts`
- Use `getBlogPosts()` function for dynamic loading
- Each post must have metadata export format

### 3. Type Safety First
- All components have proper TypeScript interfaces
- Use existing types from `lib/types.ts`
- Add new types when introducing new data structures

## 🚨 Critical Dos and Don'ts

### ✅ DO

**Blog System:**
- Use the automated `getBlogPosts()` function
- Create new posts in `app/blog/[slug]/page.mdx` format
- Include proper metadata exports in MDX files
- Test the build after blog system changes

**Components:**
- Follow existing component prop patterns
- Use server components for data fetching
- Use client components only when needed (animations, interactivity)
- Maintain the `variants` and `transition` prop pattern for animations

**Types:**
- Update `lib/types.ts` when adding new data structures
- Use existing interfaces consistently
- Add proper TypeScript annotations

**Styling:**
- Use the existing theme system with `theme-*` classes
- Follow Tailwind conventions
- Maintain consistent spacing and layout patterns

### ❌ DON'T

**Blog System:**
- ❌ Never manually edit BLOG_POSTS arrays
- ❌ Don't use `fs` module in client components
- ❌ Don't skip the metadata export in MDX files
- ❌ Don't mix server-side file operations with client code

**Architecture:**
- ❌ Don't put server-side code in client components
- ❌ Don't use 'use client' directive unnecessarily
- ❌ Don't break the server/client component separation

**Dependencies:**
- ❌ Don't add unnecessary dependencies
- ❌ Don't change core dependencies without careful consideration
- ❌ Don't ignore TypeScript errors

## 📝 Common Tasks and How to Do Them

### Adding a New Blog Post
```bash
# 1. Create directory
mkdir app/blog/my-new-post

# 2. Create MDX file
touch app/blog/my-new-post/page.mdx
```

```typescript
// 3. Add content with metadata
export const metadata = {
  title: 'My New Post',
  description: 'Description of my new post'
}

# My New Post

Your content here...
```

**No other changes needed!** The post will automatically appear.

### Adding New Static Data
Edit `app/data.ts` for:
- Projects (`PROJECTS` array)
- Work experience (`WORK_EXPERIENCE` array)  
- Social links (`SOCIAL_LINKS` array)
- Email (`EMAIL` constant)

### Creating New Components
1. **Determine if it needs to be client or server component**
2. **Create in appropriate directory** (`components/home/` for homepage sections)
3. **Follow existing prop patterns** (variants, transition, className)
4. **Add TypeScript interfaces**
5. **Export from appropriate file**

### Modifying Animations
- Animation configs are in `components/home/animations.tsx`
- Use existing `VARIANTS_SECTION` and `TRANSITION_SECTION`
- Follow Motion/React patterns consistently

## 🔧 Development Workflow

### Before Making Changes
1. **Read this document thoroughly**
2. **Understand the server/client architecture**
3. **Check existing patterns and conventions**
4. **Plan changes to avoid breaking the automated systems**

### Testing Changes
```bash
# Always run build to test
npm run build

# Check for TypeScript errors
# (Use whatever command is available)

# Test in development
npm run dev
```

### After Making Changes
1. **Verify build succeeds**
2. **Test blog system if blog-related changes**
3. **Check that animations still work**
4. **Verify TypeScript compilation**

## 🎨 Styling Guidelines

### Theme System
- Use `theme-*` prefixed classes for themed properties
- Examples: `theme-text-foreground`, `theme-bg-muted`, `theme-border-radius`
- Don't hardcode colors or theme values

### Layout Patterns
- Use `space-y-24` for main section spacing
- Use `space-y-3` for smaller element spacing
- Follow existing padding and margin patterns

### Responsive Design
- Mobile-first approach with Tailwind
- Use existing responsive patterns
- Test on multiple screen sizes

## 🚀 Build and Deployment

### Build Process Understanding
1. **TypeScript compilation** with strict checking
2. **Server-side blog post discovery** during build
3. **Static page generation** for optimal performance
4. **Asset optimization** automatically handled

### What Happens During Build
- `getBlogPosts()` runs server-side to scan filesystem
- Blog posts are discovered and metadata extracted
- Static pages generated for each blog post
- All components compiled and optimized

## 🐛 Troubleshooting Common Issues

### "Cannot resolve 'fs'" Error
- **Cause**: Using `fs` module in client component
- **Fix**: Move filesystem operations to server components only
- **Check**: Look for 'use client' directives in components using `fs`

### Blog Posts Not Appearing
- **Check**: Directory structure `app/blog/[slug]/page.mdx`
- **Check**: Metadata export format
- **Check**: Build logs for parsing errors
- **Check**: File permissions and accessibility

### TypeScript Errors
- **Check**: Import paths and file extensions
- **Check**: Type definitions in `lib/types.ts`
- **Check**: Prop interfaces match component usage

### Animation Not Working
- **Check**: Client component has 'use client' directive
- **Check**: Motion components properly imported
- **Check**: Variants and transition props passed correctly

## 💡 Advanced Tips

### Working with the Blog System
- The `extractMetadataFromMDX()` function uses regex parsing
- You can extend it to support additional metadata fields
- Consider sorting/filtering options in `getBlogPosts()`

### Performance Considerations
- Server components are faster for initial load
- Client components needed only for interactivity
- Keep bundle size minimal by avoiding unnecessary 'use client'

### Extending the Project
- Follow existing patterns when adding new sections
- Maintain TypeScript coverage for new features
- Consider server/client split for new functionality

## 📚 Key Files to Understand

### Essential Files
- `app/page.tsx` - Main server component
- `components/personal-client.tsx` - Main client wrapper
- `lib/blog.ts` - Blog system core logic
- `app/data.ts` - Static data exports
- `lib/types.ts` - TypeScript definitions

### Configuration Files
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Documentation
- `docs/ARCHITECTURE.md` - Detailed architecture overview
- `docs/BLOG-SYSTEM.md` - Blog system deep dive
- This file - AI-specific guidelines

## ⚡ Quick Reference

### Adding Blog Post
```bash
mkdir app/blog/post-slug
# Add page.mdx with metadata export
```

### Server vs Client Components
```typescript
// Server Component (default)
export default async function MyComponent() {
  const data = await getData()
  return <div>{data}</div>
}

// Client Component (for interactivity)
'use client'
export default function MyComponent() {
  const [state, setState] = useState()
  return <div onClick={() => setState()}>{state}</div>
}
```

### Animation Pattern
```typescript
<motion.section
  variants={VARIANTS_SECTION}
  transition={TRANSITION_SECTION}
>
  Content here
</motion.section>
```

Remember: **This project prioritizes simplicity, automation, and type safety**. Always think about maintaining these principles when making changes.

