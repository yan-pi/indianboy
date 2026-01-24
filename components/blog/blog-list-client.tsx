'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Magnetic } from '@/components/ui/magnetic'
import {
  VARIANTS_CONTAINER,
  VARIANTS_SECTION,
  TRANSITION_SECTION,
} from '@/components/home/animations'
import { BlogPost } from '@/lib/types'

interface BlogListClientProps {
  initialPosts: BlogPost[]
  tags: string[]
}

export function BlogListClient({ initialPosts, tags }: BlogListClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(true)

  const handleTagFilter = (tag: string) => {
    let newSelectedTags: string[]

    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((t) => t !== tag)
    } else {
      newSelectedTags = [...selectedTags, tag]
    }

    setSelectedTags(newSelectedTags)

    if (newSelectedTags.length > 0) {
      const filteredPosts = initialPosts.filter((post) =>
        post.tags?.some((postTag) => newSelectedTags.includes(postTag)),
      )
      setPosts(filteredPosts)
    } else {
      setPosts(initialPosts)
    }
  }

  const clearAllTags = () => {
    setSelectedTags([])
    setPosts(initialPosts)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      className="mx-auto max-w-4xl px-4 py-8"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* <motion.header */}
      {/*   className="mb-8" */}
      {/*   variants={VARIANTS_SECTION} */}
      {/*   transition={TRANSITION_SECTION} */}
      {/* > */}
      {/*   <h1 className="theme-text-foreground mb-2 text-2xl font-medium"> */}
      {/*     Blog */}
      {/*   </h1> */}
      {/*   <p className="theme-text-muted"> */}
      {/*     {posts.length} post{posts.length !== 1 ? 's' : ''} */}
      {/*     {selectedTags.length > 0 && */}
      {/*       ` filtered by ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`} */}
      {/*   </p> */}
      {/* </motion.header> */}

      {/* Tag Filter */}
      {tags.length > 0 && (
        <motion.section
          className="mb-8"
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="theme-text-foreground text-lg font-medium">
              Filter by Tag
            </h2>
            <button
              onClick={() => setIsFilterCollapsed((prev) => !prev)}
              className="theme-text-muted hover:theme-text-foreground text-sm transition-colors"
              aria-expanded={!isFilterCollapsed}
              aria-controls="tag-filter-section"
            >
              {isFilterCollapsed ? 'Show' : 'Hide'}
            </button>
          </div>
          {!isFilterCollapsed && (
            <div id="tag-filter-section" className="flex flex-wrap gap-2">
              <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                <button
                  onClick={clearAllTags}
                  className={`theme-transition rounded-full px-3 py-1 text-sm font-medium ${
                    selectedTags.length === 0
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-card)] text-[var(--color-card-foreground)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]'
                  }`}
                >
                  All ({initialPosts.length})
                </button>
              </Magnetic>
              {tags.map((tag) => {
                const tagCount = initialPosts.filter((post) =>
                  post.tags?.includes(tag),
                ).length
                return (
                  <Magnetic key={tag} springOptions={{ bounce: 0 }} intensity={0.3}>
                    <button
                      onClick={() => handleTagFilter(tag)}
                      className={`theme-transition rounded-full px-3 py-1 text-sm font-medium ${
                        selectedTags.includes(tag)
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-card)] text-[var(--color-card-foreground)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]'
                      }`}
                    >
                      {tag} ({tagCount})
                    </button>
                  </Magnetic>
                )
              })}
            </div>
          )}
        </motion.section>
      )}

      {/* Blog Posts List */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="theme-text-muted">
              {selectedTags.length > 0
                ? `No posts found with the selected tag${selectedTags.length > 1 ? 's' : ''}`
                : 'No blog posts found'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-0">
            <AnimatedBackground
              enableHover
              className="h-full w-full theme-border-radius theme-bg-muted"
              transition={{
                type: 'spring',
                bounce: 0,
                duration: 0.2,
              }}
            >
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  className="-mx-3 theme-border-radius-xl px-3 py-3"
                  href={post.link}
                  data-id={post.slug}
                >
                  <div className="flex flex-col space-y-1">
                    <h4 className="font-medium theme-text-foreground">
                      {post.title}
                    </h4>
                    <p className="theme-text-muted">{post.description}</p>
                    <div className="theme-text-muted text-sm flex items-center gap-2">
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.readingTime && (
                        <>
                          <span>•</span>
                          <span>{post.readingTime}</span>
                        </>
                      )}
                      {post.author && (
                        <>
                          <span>•</span>
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="theme-text-muted text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </AnimatedBackground>
          </div>
        )}
      </motion.section>

      {/* Back to Home */}
      <motion.div
        className="mt-12 text-center"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <Link
          href="/"
          className="theme-text-muted hover:theme-text-foreground transition-colors"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </motion.div>
  )
}
