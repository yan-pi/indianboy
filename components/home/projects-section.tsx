'use client'
import { motion } from 'motion/react'
import { ProjectVideo } from './project-video'
import { ProjectsSectionProps } from '@/lib/types'

export function ProjectsSection({ projects, variants, transition, className }: ProjectsSectionProps) {
  return (
    <motion.section
      className={className}
      variants={variants}
      transition={transition}
    >
      <h3 className="mb-5 text-lg font-medium theme-text-foreground">Selected Projects</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <div key={project.name} className="space-y-2">
            <div className="relative theme-border-radius-lg theme-bg-muted p-1">
              <ProjectVideo src={project.video} />
            </div>
            <div className="px-1">
              <a
                className="font-base group relative inline-block font-[450] theme-text-foreground"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.name}
                <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 theme-transition group-hover:max-w-full"></span>
              </a>
              <p className="text-base theme-text-muted">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

