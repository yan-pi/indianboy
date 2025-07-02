'use client'
import { motion } from 'motion/react'
import { Spotlight } from '@/components/ui/spotlight'
import { WorkExperienceSectionProps } from '@/lib/types'

export function WorkExperienceSection({ workExperience, variants, transition, className }: WorkExperienceSectionProps) {
  return (
    <motion.section
      className={className}
      variants={variants}
      transition={transition}
    >
      <h3 className="mb-5 text-lg font-medium theme-text-foreground">Work Experience</h3>
      <div className="flex flex-col space-y-2">
        {workExperience.map((job) => (
          <a
            className="relative overflow-hidden theme-border-radius-lg bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            key={job.id}
          >
            <Spotlight
              className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
              size={64}
            />
            <div className="relative h-full w-full rounded-[15px] theme-bg-card p-4">
              <div className="relative flex w-full flex-row justify-between">
                <div>
                  <h4 className="font-normal theme-text-foreground">
                    {job.title}
                  </h4>
                  <p className="theme-text-muted">
                    {job.company}
                  </p>
                </div>
                <p className="theme-text-muted">
                  {job.start} - {job.end}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  )
}

