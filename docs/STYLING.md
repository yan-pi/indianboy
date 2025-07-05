# Styling System and Theme Implementation

## 🎨 Overview

The project uses a custom theme system built on top of Tailwind CSS with CSS custom properties for dynamic theming. This approach provides consistent styling across the site while supporting both light and dark themes.

## 🏗️ Theme Architecture

### CSS Custom Properties Foundation
The theme system is built using CSS custom properties (CSS variables) defined in `app/globals.css`:

```css
:root {
  /* Light theme variables */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  /* ... more theme variables */
}

.dark {
  /* Dark theme overrides */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  /* ... more theme variables */
}
```

### Tailwind Integration
Theme variables are integrated into Tailwind's color system via `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      // ... more color mappings
    }
  }
}
```

## 🎯 Theme Usage Patterns

### 1. Utility Class Pattern
Use `theme-*` prefixed classes for themed properties:

```typescript
// Background colors
className="theme-bg-background"     // Main background
className="theme-bg-muted"          // Subtle background
className="theme-bg-card"           // Card backgrounds

// Text colors
className="theme-text-foreground"   // Main text
className="theme-text-muted-foreground"  // Secondary text
className="theme-text-accent-foreground" // Accent text

// Borders
className="theme-border"            // Standard borders
className="theme-border-input"      // Input borders
```

### 2. Component Styling Examples

**Section Backgrounds:**
```typescript
<section className="theme-bg-background theme-text-foreground">
  {/* Content with theme-aware colors */}
</section>
```

**Card Components:**
```typescript
<div className="theme-bg-card theme-border theme-border-radius-lg p-6">
  <h3 className="theme-text-foreground">Card Title</h3>
  <p className="theme-text-muted-foreground">Card description</p>
</div>
```

**Interactive Elements:**
```typescript
<button className="theme-bg-primary theme-text-primary-foreground hover:theme-bg-primary/90">
  Click me
</button>
```

## 🌗 Theme Provider System

### ThemeProvider Component
Located in `providers/theme-provider.tsx`, handles theme state and switching:

```typescript
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
```

### Integration in Layout
```typescript
// app/layout.tsx
import { ThemeProvider } from '@/providers/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 🎨 Color System

### Color Categories

**Base Colors:**
- `background` - Main page background
- `foreground` - Primary text color
- `card` - Card/panel backgrounds
- `popover` - Dropdown/modal backgrounds

**Interactive Colors:**
- `primary` - Primary action color
- `secondary` - Secondary action color
- `accent` - Accent/highlight color
- `destructive` - Error/danger color

**Utility Colors:**
- `muted` - Subtle backgrounds
- `border` - Border colors
- `input` - Form input styling
- `ring` - Focus ring colors

### HSL Color Values
All colors are defined in HSL format for better manipulation:

```css
/* HSL allows for easy opacity modifications */
--primary: 240 5.9% 10%;           /* Base color */
background-color: hsl(var(--primary) / 0.8);  /* 80% opacity */
```

## 📐 Spacing and Layout

### Consistent Spacing Scale
```typescript
// Main section spacing
className="space-y-24"    // 6rem between major sections

// Content spacing
className="space-y-6"     // 1.5rem between content blocks
className="space-y-3"     // 0.75rem between related items

// Padding patterns
className="px-3 py-3"     // Standard padding
className="p-6"           // Card padding
```

### Layout Containers
```typescript
// Page container
className="container mx-auto px-4"

// Content max-width
className="max-w-4xl mx-auto"

// Section wrapper
className="w-full"
```

## 🎭 Animation Integration

### Motion Components with Theme
Animations work seamlessly with theme classes:

```typescript
<motion.div
  className="theme-bg-card theme-border"
  whileHover={{ 
    backgroundColor: "hsl(var(--muted))" 
  }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### Theme-Aware Hover Effects
```typescript
// CSS-based hover effects that respect theme
className="theme-bg-muted hover:theme-bg-muted/80 transition-colors"

// Motion-based hover effects
whileHover={{ 
  backgroundColor: "hsl(var(--accent) / 0.1)" 
}}
```

## 📱 Responsive Design

### Mobile-First Approach
```typescript
// Mobile-first responsive design
className="text-sm md:text-base lg:text-lg"
className="px-4 md:px-6 lg:px-8"
className="space-y-6 md:space-y-8"
```

### Responsive Theme Adjustments
```css
/* Responsive typography scaling */
.theme-text-lg {
  @apply text-lg md:text-xl lg:text-2xl;
}

/* Responsive spacing */
.theme-section-spacing {
  @apply space-y-16 md:space-y-20 lg:space-y-24;
}
```

## 🎯 Component Styling Patterns

### Homepage Sections
```typescript
// Standard section styling
const sectionClasses = cn(
  "w-full",
  "theme-text-foreground",
  className
)

<motion.section 
  className={sectionClasses}
  variants={variants}
  transition={transition}
>
```

### Card Components
```typescript
// Standard card styling
const cardClasses = cn(
  "theme-bg-card",
  "theme-border",
  "theme-border-radius-lg",
  "p-6",
  "shadow-sm",
  "hover:shadow-md",
  "transition-shadow"
)
```

### Interactive Elements
```typescript
// Button styling
const buttonClasses = cn(
  "theme-bg-primary",
  "theme-text-primary-foreground",
  "hover:theme-bg-primary/90",
  "theme-border-radius-md",
  "px-4 py-2",
  "transition-colors",
  "focus-visible:ring-2",
  "focus-visible:ring-primary"
)
```

## 🛠️ Customization Guidelines

### Adding New Theme Colors
1. **Add CSS custom property** in `globals.css`:
```css
:root {
  --custom-color: 120 100% 50%;
}

.dark {
  --custom-color: 120 80% 40%;
}
```

2. **Extend Tailwind config**:
```typescript
// tailwind.config.ts
colors: {
  'custom-color': "hsl(var(--custom-color))",
}
```

3. **Create utility classes**:
```css
.theme-bg-custom { background-color: hsl(var(--custom-color)); }
.theme-text-custom { color: hsl(var(--custom-color)); }
```

### Creating Custom Components
```typescript
// Follow the established pattern
interface CustomComponentProps {
  className?: string
  // other props
}

export function CustomComponent({ className, ...props }: CustomComponentProps) {
  return (
    <div 
      className={cn(
        "theme-bg-card",
        "theme-text-foreground",
        "theme-border-radius-lg",
        className
      )}
      {...props}
    />
  )
}
```

## 🔧 Development Workflow

### Theme Development Process
1. **Define colors** in CSS custom properties
2. **Add to Tailwind config** for utility generation
3. **Create utility classes** if needed
4. **Test in both themes** (light/dark)
5. **Check accessibility** (contrast ratios)

### Theme Testing Checklist
- [ ] Colors work in both light and dark themes
- [ ] Sufficient contrast for accessibility
- [ ] Hover states are visible and appropriate
- [ ] Focus states are clearly indicated
- [ ] Responsive behavior is correct
- [ ] Animation transitions are smooth

## 🎨 Best Practices

### 1. Always Use Theme Classes
```typescript
// ✅ Good - theme-aware
className="theme-bg-background theme-text-foreground"

// ❌ Bad - hardcoded colors
className="bg-white text-black"
```

### 2. Consistent Spacing
```typescript
// ✅ Good - consistent scale
className="space-y-6"  // 1.5rem
className="space-y-3"  // 0.75rem

// ❌ Bad - arbitrary values
className="space-y-[13px]"
```

### 3. Proper Color Usage
```typescript
// ✅ Good - semantic color usage
className="theme-text-muted-foreground"  // For secondary text
className="theme-bg-card"                // For card backgrounds

// ❌ Bad - inappropriate color usage
className="theme-text-destructive"       // For regular text
```

### 4. Accessibility Considerations
```typescript
// ✅ Good - proper focus handling
className="focus-visible:ring-2 focus-visible:ring-primary"

// ✅ Good - sufficient contrast
// Use theme colors that maintain proper contrast ratios
```

## 📊 Performance Considerations

### CSS Custom Properties Benefits
- **Runtime theme switching** without CSS-in-JS overhead
- **Smaller bundle size** compared to CSS-in-JS solutions
- **Better caching** with static CSS files
- **SSR compatibility** without hydration issues

### Optimization Tips
- Use CSS custom properties for theme values
- Minimize runtime style calculations
- Leverage Tailwind's utility-first approach
- Use CSS transitions instead of JavaScript animations for simple effects

## 🐛 Common Issues and Solutions

### 1. Theme Flashing on Load
**Problem**: Brief flash of wrong theme on page load

**Solution**: Use `suppressHydrationWarning` and proper SSR handling:
```typescript
<html suppressHydrationWarning>
  <ThemeProvider>
    {children}
  </ThemeProvider>
</html>
```

### 2. Custom Properties Not Working
**Problem**: CSS custom properties not resolving

**Solution**: Ensure proper HSL format and Tailwind config:
```css
/* ✅ Correct format */
--color: 240 5.9% 10%;
color: hsl(var(--color));

/* ❌ Wrong format */
--color: #123456;
```

### 3. Inconsistent Theming
**Problem**: Some components don't follow theme

**Solution**: Use theme utilities consistently:
```typescript
// Always use theme-prefixed classes
className="theme-bg-background theme-text-foreground"
```

Remember: **Consistency and accessibility are paramount**. Always test your styling changes in both light and dark themes and ensure proper contrast ratios for accessibility.

