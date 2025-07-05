# Development Workflow and Best Practices

## 🚀 Getting Started

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd nim-minimalist-personal-site

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Environment
- **Node.js**: Latest LTS version recommended
- **Package Manager**: npm (lockfile: package-lock.json)
- **Editor**: VSCode recommended with TypeScript and Tailwind extensions
- **Browser**: Modern browser with React Developer Tools

## 🔄 Development Workflow

### 1. Daily Development Process
```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000

# Make changes and see live reload
# Server restarts automatically for app/ changes
```

### 2. Before Committing Changes
```bash
# Always build to check for errors
npm run build

# Fix any TypeScript errors
# Fix any build failures

# Test the built version locally
npm run start  # if available
```

### 3. Testing New Features
```bash
# Development testing
npm run dev

# Production build testing
npm run build
npm run start  # or serve the out/ directory

# Check both light and dark themes
# Test responsive design on different screen sizes
```

## 📝 Code Standards

### 1. TypeScript Guidelines
```typescript
// ✅ Always define interfaces for props
interface ComponentProps {
  data: DataType
  className?: string
}

// ✅ Use proper type imports
import type { BlogPost, Project } from '@/lib/types'

// ✅ Export types when needed
export type { ComponentProps }

// ❌ Avoid any types
const data: any = getData()  // Bad

// ✅ Use proper typing
const data: BlogPost[] = await getBlogPosts()  // Good
```

### 2. Component Standards
```typescript
// ✅ Proper component structure
interface Props {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
  return (
    <div className="proper-styling">
      {/* JSX */}
    </div>
  )
}

// ✅ Use destructuring for props
export function Component({ data, className }: Props)

// ❌ Avoid props drilling
export function Component(props: Props)  // Then props.data, props.className
```

### 3. Import Organization
```typescript
// 1. React and Next.js imports
import { useState } from 'react'
import Link from 'next/link'

// 2. Third-party libraries
import { motion } from 'motion/react'

// 3. Internal imports - absolute paths with @/
import { BlogPost } from '@/lib/types'
import { getBlogPosts } from '@/lib/blog'
import { ComponentName } from '@/components/ui/component-name'

// 4. Relative imports (avoid when possible)
import './component.css'
```

## 🏗️ Project Structure Best Practices

### 1. File Naming Conventions
```
components/
├── ui/
│   ├── button.tsx           # kebab-case for files
│   └── animated-background.tsx
├── home/
│   ├── intro-section.tsx    # descriptive, purpose-clear names
│   └── blog-section.tsx
└── personal-client.tsx      # main components

app/
├── page.tsx                 # Next.js convention
├── layout.tsx               # Next.js convention
└── blog/
    └── [slug]/
        └── page.mdx         # Next.js dynamic routes
```

### 2. Directory Organization
- **`app/`** - Next.js App Router pages and layouts
- **`components/`** - Reusable React components
- **`lib/`** - Utility functions, types, and business logic
- **`providers/`** - React context providers
- **`public/`** - Static assets
- **`docs/`** - Project documentation

### 3. Code Organization Within Files
```typescript
// 1. Imports (organized as shown above)
import ...

// 2. Types and interfaces
interface ComponentProps {
  // ...
}

// 3. Constants (if any)
const DEFAULT_CONFIG = {
  // ...
}

// 4. Component definition
export function Component({ ... }: ComponentProps) {
  // 4a. Hooks and state
  const [state, setState] = useState()
  
  // 4b. Derived values and computations
  const computedValue = useMemo(() => {
    // ...
  }, [dependencies])
  
  // 4c. Event handlers
  const handleClick = useCallback(() => {
    // ...
  }, [dependencies])
  
  // 4d. Effects
  useEffect(() => {
    // ...
  }, [dependencies])
  
  // 4e. Render
  return (
    // JSX
  )
}
```

## 🎯 Feature Development Guidelines

### 1. Adding New Blog Posts
```bash
# Create directory
mkdir app/blog/post-slug

# Create MDX file
touch app/blog/post-slug/page.mdx
```

```typescript
// Add metadata export
export const metadata = {
  title: 'Post Title',
  description: 'Post description'
}

# Post Title

Your content here...
```

**No other changes needed** - the automated system handles the rest!

### 2. Adding New Static Data
Edit `app/data.ts`:
```typescript
// Add to appropriate array
export const PROJECTS: Project[] = [
  // existing projects...
  {
    name: 'New Project',
    description: 'Project description',
    link: 'https://example.com',
    video: 'video-url-if-available',
    id: 'unique-id',
  }
]
```

### 3. Creating New Components
```typescript
// 1. Determine server vs client component needs
// 2. Create in appropriate directory
// 3. Follow established patterns

// components/ui/new-component.tsx
interface NewComponentProps {
  data: DataType
  className?: string
}

export function NewComponent({ data, className }: NewComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {/* Component content */}
    </div>
  )
}
```

### 4. Adding New Homepage Sections
```typescript
// 1. Create section component following the pattern
interface NewSectionProps {
  data: DataType[]
  variants: Variants
  transition: Transition
  className?: string
}

export function NewSection({ data, variants, transition, className }: NewSectionProps) {
  return (
    <motion.section
      className={className}
      variants={variants}
      transition={transition}
    >
      {/* Section content */}
    </motion.section>
  )
}

// 2. Add to PersonalClient component
<NewSection
  data={newData}
  variants={VARIANTS_SECTION}
  transition={TRANSITION_SECTION}
/>

// 3. Update data loading in app/page.tsx if needed
```

## 🔍 Debugging and Troubleshooting

### 1. Common Build Issues

**TypeScript Errors:**
```bash
# Check types
npx tsc --noEmit

# Common fixes:
# - Add missing type imports
# - Fix interface definitions
# - Resolve import path issues
```

**Blog System Issues:**
```bash
# Check blog post structure
ls -la app/blog/*/page.mdx

# Check metadata format in MDX files
# Ensure proper directory structure
# Look for console warnings during build
```

**Import Resolution Issues:**
```bash
# Check tsconfig.json path mappings
# Verify file exists at import path
# Use absolute imports with @/ prefix
```

### 2. Development Debugging

**Console Debugging:**
```typescript
// Use console.log for development debugging
console.log('Debug data:', { blogPosts, projects })

// Use proper error handling
try {
  const result = await riskyOperation()
} catch (error) {
  console.error('Operation failed:', error)
}
```

**React Developer Tools:**
- Install React Developer Tools browser extension
- Use Components tab to inspect component hierarchy
- Use Profiler tab to identify performance issues

### 3. Performance Debugging
```bash
# Analyze bundle size
npm run build

# Check build output for:
# - Large chunk sizes
# - Unused dependencies
# - Optimization opportunities
```

## 🧪 Testing Strategy

### 1. Manual Testing Checklist
- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **Type Safety**: No TypeScript errors
- [ ] **Visual Testing**: All sections render correctly
- [ ] **Animation Testing**: Smooth animations, no janky transitions
- [ ] **Theme Testing**: Both light and dark themes work
- [ ] **Responsive Testing**: Mobile, tablet, desktop layouts
- [ ] **Blog System**: New posts appear automatically
- [ ] **Links Testing**: All internal and external links work

### 2. Cross-Browser Testing
Test in:
- **Chrome** (primary development browser)
- **Firefox** (ensure compatibility)
- **Safari** (WebKit differences)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

### 3. Performance Testing
```bash
# Lighthouse audits
# Check for:
# - Performance score > 90
# - Accessibility score > 95
# - Best Practices score > 90
# - SEO score > 90
```

## 🚦 Git Workflow

### 1. Branch Strategy
```bash
# Main branch for production-ready code
git checkout main

# Feature branches for new development
git checkout -b feature/new-feature-name

# Bug fix branches
git checkout -b fix/bug-description
```

### 2. Commit Guidelines
```bash
# Use descriptive commit messages
git commit -m "Add automated blog post discovery system"
git commit -m "Fix animation timing in project cards"
git commit -m "Update styling for better mobile responsiveness"

# Not:
git commit -m "Fix stuff"
git commit -m "Update"
```

### 3. Pre-commit Checklist
- [ ] Code builds successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in development
- [ ] Changes tested manually
- [ ] Documentation updated if needed

## 🚀 Deployment Preparation

### 1. Pre-deployment Checklist
```bash
# Clean build
rm -rf .next out/
npm run build

# Check for:
# - Build success
# - No TypeScript errors
# - All pages generated correctly
# - No runtime errors in built version
```

### 2. Environment Considerations
- **Static Export**: Project is configured for static deployment
- **No Server Dependencies**: Can be deployed to any static host
- **CDN Ready**: Optimized for content delivery networks

### 3. Performance Optimization
```bash
# The build process automatically:
# - Optimizes images
# - Minifies CSS and JavaScript
# - Generates optimal chunks
# - Creates static HTML files
```

## 📚 Learning Resources

### Project-Specific Knowledge
- **Next.js 15 Documentation**: App Router patterns
- **Tailwind CSS**: Utility-first CSS framework
- **Motion/React**: Animation library
- **TypeScript**: Type system for JavaScript

### Best Practices
- **React Patterns**: Component composition, hooks usage
- **Performance**: Bundle optimization, lazy loading
- **Accessibility**: WCAG guidelines, semantic HTML
- **SEO**: Meta tags, structured data

## 🆘 Getting Help

### 1. Documentation Priority
1. **This docs folder** - Project-specific guidance
2. **Official documentation** - Framework and library docs
3. **Community resources** - Stack Overflow, GitHub discussions

### 2. Debugging Steps
1. **Check console** for errors and warnings
2. **Verify file structure** matches expected patterns
3. **Test minimal reproduction** of the issue
4. **Check recent changes** that might have caused issues

### 3. Common Solutions
- **Clear cache**: Delete `.next` folder and rebuild
- **Reinstall dependencies**: Delete `node_modules` and `npm install`
- **Check versions**: Ensure compatible dependency versions
- **Restart dev server**: Stop and start `npm run dev`

Remember: **Quality over speed**. Take time to write clean, maintainable code that follows the established patterns and conventions.

