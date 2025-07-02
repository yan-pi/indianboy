'use client'
import { motion } from 'motion/react'
import { IntroSection } from '@/components/home/intro-section'
import { ProjectsSection } from '@/components/home/projects-section'
import { WorkExperienceSection } from '@/components/home/work-experience-section'
import { BlogSection } from '@/components/home/blog-section'
import { ConnectSection } from '@/components/home/connect-section'
import { VARIANTS_CONTAINER, VARIANTS_SECTION, TRANSITION_SECTION } from '@/components/home/animations'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
} from './data'

export default function Personal() {
  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <IntroSection 
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <ProjectsSection 
        projects={PROJECTS}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <WorkExperienceSection 
        workExperience={WORK_EXPERIENCE}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <BlogSection 
        blogPosts={BLOG_POSTS}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />

      <ConnectSection 
        email={EMAIL}
        socialLinks={SOCIAL_LINKS}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      />
    </motion.main>
  )
}
