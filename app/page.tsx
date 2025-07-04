import { PersonalClient } from '@/components/personal-client'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  LATEST_BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
} from './data'

export default async function Personal() {
  // Load latest 3 blog posts on the server side
  const blogPosts = await LATEST_BLOG_POSTS(3)
  
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
