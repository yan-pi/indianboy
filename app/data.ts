import { Project, WorkExperience, SocialLink } from '@/lib/types'
import { getBlogPosts, getLatestBlogPosts } from '@/lib/blog'

export const PROJECTS: Project[] = [
  {
    name: 'Sats Capital',
    description:
      'A Bitcoin investment platform that uses cashback to help users invest in Bitcoin through a simple and intuitive interface.',
    link: 'https://satscapital.com.br/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project1',
  },
  {
    name: 'Motion Primitives',
    description: 'UI kit to make beautiful, animated interfaces.',
    link: 'https://motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Sats Capital',
    title: 'Lead Engineer',
    start: '2023',
    end: 'Present',
    link: 'https://satscapital.com.br',
    id: 'work1',
  },
  {
    company: 'FESF/SUS (Brazilian Gov HealthCare System)',
    title: 'Lead Front-end Engineer',
    start: '2024',
    end: '2025',
    link: 'https://www.fesfsus.ba.gov.br/',
    id: 'work2',
  },
  {
    company: 'Branef GovTech',
    title: 'Front-end Intern',
    start: '2022',
    end: '2022',
    link: 'https://branefgovtech.com.br/',
    id: 'work3',
  },
]

// Blog posts are now automatically loaded from the filesystem
// Note: getBlogPosts() is an async function that can only be used in server components
// For static usage, you'll need to await getBlogPosts() in your server components
export { getBlogPosts as BLOG_POSTS, getLatestBlogPosts as LATEST_BLOG_POSTS }

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/yan-pi',
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/yamigake',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/yanfernandes/',
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/yanfsb',
  },
]

export const EMAIL = 'yan@indianboy.sh'

// export const EMAIL = 'yan@indianboy.sh'
