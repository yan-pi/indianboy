'use client'
import { useMemo } from 'react'
import { Variants, Transition } from 'motion/react'
import { useTheme } from '@/providers/theme-provider'

interface UseAnimationConfigProps {
  stagger?: number
  delay?: number
  duration?: number
  type?: 'spring' | 'tween'
  customVariants?: Variants
}

export function useAnimationConfig({
  stagger = 0.15,
  delay = 0,
  duration = 0.3,
  type = 'spring',
  customVariants,
}: UseAnimationConfigProps = {}) {
  const theme = useTheme()

  const containerVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
          delayChildren: delay,
        },
      },
    }),
    [stagger, delay],
  )

  const itemVariants = useMemo<Variants>(
    () =>
      customVariants || {
        hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      },
    [customVariants],
  )

  const transition = useMemo<Transition>(
    () => ({
      duration,
      type,
      ...(type === 'spring' && {
        bounce: theme.animations.springBounce,
        stiffness: theme.animations.springStiffness,
        damping: theme.animations.springDamping,
        mass: theme.animations.springMass,
      }),
    }),
    [duration, type, theme.animations],
  )

  return {
    containerVariants,
    itemVariants,
    transition,
  }
}

export function useSpringConfig() {
  const theme = useTheme()

  return useMemo(
    () => ({
      bounce: theme.animations.springBounce,
      stiffness: theme.animations.springStiffness,
      damping: theme.animations.springDamping,
      mass: theme.animations.springMass,
    }),
    [theme.animations],
  )
}
