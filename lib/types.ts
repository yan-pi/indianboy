import { Variants, Transition } from 'motion/react'

export interface AnimationProps {
  variants: Variants
  transition: Transition
}

export interface Project {
  name: string
  description: string
  link: string
  video: string
  id: string
}

export interface WorkExperience {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

export interface BlogPost {
  title: string
  description: string
  link: string
  uid: string
  slug: string
  publishedAt: string
  summary?: string
  tags?: string[]
  author?: string
  image?: string
  readingTime?: string
  content?: string // Raw MDX content bundled at build time
}

export interface SocialLink {
  label: string
  link: string
}

export interface SectionProps extends AnimationProps {
  className?: string
}

export interface ProjectsSectionProps extends SectionProps {
  projects: Project[]
}

export interface WorkExperienceSectionProps extends SectionProps {
  workExperience: WorkExperience[]
}

export interface BlogSectionProps extends SectionProps {
  blogPosts: BlogPost[]
}

export interface ConnectSectionProps extends SectionProps {
  email: string
  socialLinks: SocialLink[]
}
