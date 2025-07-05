# Component Structure and Usage Patterns

## 🧩 Component Architecture Overview

The project follows a clear component hierarchy with consistent patterns for props, styling, and animations. All components are built with TypeScript and follow strict type safety principles.

## 📁 Component Organization

```
components/
├── home/                         # Homepage-specific sections
│   ├── intro-section.tsx         # Hero/introduction section
│   ├── projects-section.tsx      # Projects showcase
│   ├── work-experience-section.tsx # Work history
│   ├── blog-section.tsx          # Blog posts listing
│   ├── connect-section.tsx       # Contact and social links
│   └── animations.tsx            # Animation configurations
├── ui/                           # Reusable UI components
│   ├── animated-background.tsx   # Hover animation backgrounds
│   └── [other ui components]
└── personal-client.tsx           # Main client wrapper component
```

## 🎯 Component Types

### 1. Server Components
**Purpose**: Data fetching, static rendering, SEO optimization

```typescript
// app/page.tsx - Main server component
export default async function Personal() {
  const blogPosts = await getBlogPosts() // Server-side data loading
  
  return (
    <PersonalClient
      projects={PROJECTS}
      workExperience={WORK_EXPERIENCE}
      blogPosts={blogPosts}
      email={EMAIL}
      socialLinks={SOCIAL_LINKS}
    />
  )
}
```

**Characteristics**:
- No 'use client' directive
- Can use async/await
- Can access filesystem, databases, etc.
- Rendered on server/build time
- Better for SEO and initial performance

### 2. Client Components
**Purpose**: Interactivity, animations, state management

```typescript
// components/personal-client.tsx - Main client wrapper
'use client'
export function PersonalClient({ projects, workExperience, blogPosts, email, socialLinks }) {
  return (
    <motion.main variants={VARIANTS_CONTAINER} initial="hidden" animate="visible">
      {/* Animated sections */}
    </motion.main>
  )
}
```

**Characteristics**:
- Starts with 'use client' directive
- Can use hooks (useState, useEffect, etc.)
- Can handle user interactions
- Supports animations with Motion/React
- Rendered in browser

## 🎨 Homepage Section Components

### Common Section Pattern
All homepage sections follow this consistent pattern:

```typescript
interface SectionProps {
  variants: Variants        // Animation variants from animations.tsx
  transition: Transition    // Animation transition configuration
  className?: string        // Optional additional CSS classes
  // + section-specific data props
}

export function SomeSection({ variants, transition, className, ...data }: SectionProps) {
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
```

### 1. IntroSection
**Purpose**: Hero section with personal introduction

```typescript
interface IntroSectionProps {
  variants: Variants
  transition: Transition
  className?: string
}
```

**Features**:
- Personal introduction text
- Animated entrance
- Responsive typography

### 2. ProjectsSection
**Purpose**: Showcase featured projects

```typescript
interface ProjectsSectionProps {
  projects: Project[]
  variants: Variants
  transition: Transition
  className?: string
}
```

**Features**:
- Project cards with video previews
- Hover animations
- External links to live projects

### 3. WorkExperienceSection
**Purpose**: Display work history

```typescript
interface WorkExperienceSectionProps {
  workExperience: WorkExperience[]
  variants: Variants
  transition: Transition
  className?: string
}
```

**Features**:
- Chronological work listing
- Company links
- Role and date information

### 4. BlogSection
**Purpose**: Display recent blog posts

```typescript
interface BlogSectionProps {
  blogPosts: BlogPost[]
  variants: Variants
  transition: Transition
  className?: string
}
```

**Features**:
- Automated blog post listing
- Animated hover effects
- Internal routing to blog posts

### 5. ConnectSection
**Purpose**: Contact information and social links

```typescript
interface ConnectSectionProps {
  email: string
  socialLinks: SocialLink[]
  variants: Variants
  transition: Transition
  className?: string
}
```

**Features**:
- Email contact link
- Social media links
- Hover animations

## 🎭 Animation System

### Animation Configuration
Central animation configs in `components/home/animations.tsx`:

```typescript
// Container animation for staggered children
export const VARIANTS_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Individual section animations
export const VARIANTS_SECTION: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Consistent timing for all sections
export const TRANSITION_SECTION: Transition = {
  duration: 0.5,
  ease: 'easeOut',
}
```

### Usage Pattern
Every animated component follows this pattern:

```typescript
<motion.element
  variants={variants}     // Passed from parent
  transition={transition} // Passed from parent
  // other props
>
  Content
</motion.element>
```

## 🎨 UI Components

### AnimatedBackground
**Purpose**: Provides hover-activated background animations

```typescript
interface AnimatedBackgroundProps {
  children: React.ReactNode
  className?: string
  enableHover?: boolean
  transition?: Transition
}
```

**Usage**:
```typescript
<AnimatedBackground enableHover className="theme-bg-muted">
  {items.map(item => (
    <div key={item.id} data-id={item.id}>
      {item.content}
    </div>
  ))}
</AnimatedBackground>
```

**Features**:
- Smooth hover transitions
- Automatic item detection via data-id
- Customizable animation timing

## 🏗️ Component Creation Guidelines

### 1. Determine Component Type
**Server Component** if:
- Fetches data from external sources
- Performs file system operations
- Needs SEO optimization
- No user interactivity required

**Client Component** if:
- Uses animations (Motion/React)
- Handles user interactions
- Manages local state
- Uses browser APIs

### 2. Follow Naming Conventions
- **PascalCase** for component names
- **kebab-case** for file names
- **Descriptive names** that indicate purpose
- **Section suffix** for homepage sections

### 3. TypeScript Interface Pattern
```typescript
// Define props interface
interface ComponentNameProps {
  // Required props first
  data: DataType
  
  // Animation props (for sections)
  variants: Variants
  transition: Transition
  
  // Optional props last
  className?: string
  isVisible?: boolean
}

// Export component with proper typing
export function ComponentName({ 
  data, 
  variants, 
  transition, 
  className,
  isVisible = true 
}: ComponentNameProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      transition={transition}
    >
      {/* Component content */}
    </motion.div>
  )
}
```

### 4. Styling Conventions
```typescript
// Use theme-prefixed classes
className="theme-text-foreground theme-bg-muted"

// Combine with standard Tailwind
className="px-3 py-3 theme-border-radius-xl"

// Optional className prop
className={cn("base-classes", className)}
```

## 🔄 Data Flow Patterns

### 1. Server → Client Data Flow
```
app/page.tsx (Server)
  ↓ await getBlogPosts()
  ↓ pass as props
components/personal-client.tsx (Client)
  ↓ distribute data
components/home/*-section.tsx (Client)
  ↓ render with animations
```

### 2. Static Data Import
```typescript
// app/data.ts
export const PROJECTS: Project[] = [...]

// app/page.tsx
import { PROJECTS } from './data'
```

### 3. Props Drilling Prevention
- Keep data at appropriate levels
- Don't over-drill props through unnecessary layers
- Use composition over deep prop chains

## 🛠️ Common Component Patterns

### 1. Conditional Rendering
```typescript
{blogPosts.length > 0 && (
  <BlogSection 
    blogPosts={blogPosts}
    variants={variants}
    transition={transition}
  />
)}
```

### 2. List Rendering with Keys
```typescript
{projects.map((project) => (
  <ProjectCard
    key={project.id}  // Always use unique, stable keys
    project={project}
    data-id={project.id}  // For AnimatedBackground
  />
))}
```

### 3. Link Handling
```typescript
// Internal links (Next.js)
<Link href="/blog/post-slug">

// External links
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
```

## 🧪 Testing Component Integration

### Build Test
```bash
npm run build
```
Should complete without errors and generate all static pages.

### Development Test
```bash
npm run dev
```
Check that:
- Animations work smoothly
- Data displays correctly
- Links function properly
- No console errors

### Type Check
Ensure TypeScript compilation succeeds:
```bash
npx tsc --noEmit
```

## 🚨 Common Pitfalls and Solutions

### 1. Server/Client Boundary Issues
**Problem**: Using server-side code in client components
```typescript
// ❌ Wrong - fs in client component
'use client'
import fs from 'fs'
```

**Solution**: Keep server operations in server components
```typescript
// ✅ Correct - server component
export default async function Page() {
  const data = await serverSideFunction()
  return <ClientComponent data={data} />
}
```

### 2. Animation Prop Drilling
**Problem**: Forgetting to pass animation props
```typescript
// ❌ Missing variants/transition
<Section className="..." />
```

**Solution**: Always pass animation props to sections
```typescript
// ✅ Complete props
<Section 
  variants={VARIANTS_SECTION}
  transition={TRANSITION_SECTION}
  className="..."
/>
```

### 3. Key Prop Issues
**Problem**: Using array indices as keys
```typescript
// ❌ Unstable keys
{items.map((item, index) => <div key={index}>)}
```

**Solution**: Use stable, unique identifiers
```typescript
// ✅ Stable keys
{items.map((item) => <div key={item.id}>)}
```

## 🔧 Extending Components

### Adding New Sections
1. **Create component** in `components/home/`
2. **Follow section pattern** (variants, transition props)
3. **Add to PersonalClient** component
4. **Update types** if needed
5. **Test animations** and data flow

### Adding New Props
1. **Update interface** with new prop
2. **Handle default values** appropriately
3. **Update all usages** of the component
4. **Consider backwards compatibility**

Remember: **Consistency is key**. Follow existing patterns and conventions to maintain code quality and predictability.

