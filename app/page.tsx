import { PersonalClient } from '@/components/personal-client'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
} from './data'

export default async function Personal() {
  // Load blog posts on the server side
  const blogPosts = await BLOG_POSTS()
  
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
