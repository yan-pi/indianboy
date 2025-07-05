'use client'
import { motion } from 'motion/react'
import { IntroSection } from '@/components/home/intro-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { WorkExperienceSection } from '@/components/home/work-experience-section'
import { BlogSection } from '@/components/home/blog-section'
import { ConnectSection } from '@/components/home/connect-section'
import {
  VARIANTS_CONTAINER,
  VARIANTS_SECTION,
  TRANSITION_SECTION,
} from '@/components/home/animations'
import type { Project, WorkExperience, BlogPost, SocialLink } from '@/lib/types'

interface PersonalClientProps {
  projects: Project[]
  workExperience: WorkExperience[]
  blogPosts: BlogPost[]
  email: string
  socialLinks: SocialLink[]
}

export function PersonalClient({
  projects,
  workExperience,
  blogPosts,
  email,
  socialLinks,
}: PersonalClientProps) {
  return (
    <motion.main
      className="space-y-16 pb-16"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <IntroSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <ProjectsSection
        projects={projects}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <WorkExperienceSection
        workExperience={workExperience}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <BlogSection
        blogPosts={blogPosts}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <ConnectSection
        email={email}
        socialLinks={socialLinks}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />
    </motion.main>
  )
}
