'use client'
import React, { createContext, useContext, ReactNode } from 'react'

interface ThemeConfig {
  colors: {
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
    card: string
    cardForeground: string
    primary: string
    primaryForeground: string
  }
  spacing: {
    section: string
    card: string
    element: string
  }
  borderRadius: {
    default: string
    lg: string
    xl: string
  }
  transitions: {
    fast: string
    normal: string
    slow: string
  }
  animations: {
    springBounce: number
    springStiffness: number
    springDamping: number
    springMass: number
  }
}

const defaultThemeConfig: ThemeConfig = {
  colors: {
    background: 'var(--color-background)',
    foreground: 'var(--color-foreground)',
    muted: 'var(--color-muted)',
    mutedForeground: 'var(--color-muted-foreground)',
    border: 'var(--color-border)',
    card: 'var(--color-card)',
    cardForeground: 'var(--color-card-foreground)',
    primary: 'var(--color-primary)',
    primaryForeground: 'var(--color-primary-foreground)',
  },
  spacing: {
    section: 'var(--spacing-section)',
    card: 'var(--spacing-card)',
    element: 'var(--spacing-element)',
  },
  borderRadius: {
    default: 'var(--border-radius)',
    lg: 'var(--border-radius-lg)',
    xl: 'var(--border-radius-xl)',
  },
  transitions: {
    fast: 'var(--transition-fast)',
    normal: 'var(--transition-normal)',
    slow: 'var(--transition-slow)',
  },
  animations: {
    springBounce: Number('var(--animation-spring-bounce)') || 0.2,
    springStiffness: Number('var(--animation-spring-stiffness)') || 26.7,
    springDamping: Number('var(--animation-spring-damping)') || 4.1,
    springMass: Number('var(--animation-spring-mass)') || 0.2,
  },
}

const ThemeContext = createContext<ThemeConfig>(defaultThemeConfig)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
  config?: Partial<ThemeConfig>
}

export function CustomThemeProvider({ children, config }: ThemeProviderProps) {
  const themeConfig = { ...defaultThemeConfig, ...config }
  
  return (
    <ThemeContext.Provider value={themeConfig}>
      {children}
    </ThemeContext.Provider>
  )
}

