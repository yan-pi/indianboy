'use client'

import { useState } from 'react'
import Link from 'next/link'
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
      // Remove the tag if it's already selected
      newSelectedTags = selectedTags.filter((t) => t !== tag)
    } else {
      // Add the tag if it's not selected
      newSelectedTags = [...selectedTags, tag]
    }

    setSelectedTags(newSelectedTags)

    if (newSelectedTags.length > 0) {
      // Filter posts that have at least one of the selected tags (OR logic)
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="theme-text-foreground mb-4 text-3xl font-bold">
          All Blog Posts
        </h1>
        <p className="theme-text-muted text-lg">
          Explore all {posts.length} blog posts
          {selectedTags.length > 0 &&
            ` filtered by ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`}
        </p>
      </header>

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="theme-text-foreground text-lg font-semibold">
              Filter by Tag
            </h2>
            <button
              onClick={() => setIsFilterCollapsed((prev) => !prev)}
              className="theme-bg-muted theme-text-muted hover:theme-bg-hover mt-4 ml-2 rounded px-2 py-1 text-xs transition-colors"
              aria-expanded={!isFilterCollapsed}
              aria-controls="tag-filter-section"
            >
              {isFilterCollapsed ? 'Show' : 'Hide'}
            </button>
          </div>
          {!isFilterCollapsed && (
            <div id="tag-filter-section" className="flex flex-wrap gap-2">
              <button
                onClick={clearAllTags}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedTags.length === 0
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'theme-bg-muted theme-text-muted hover:theme-bg-hover'
                }`}
              >
                All ({initialPosts.length})
              </button>
              {tags.map((tag) => {
                const tagCount = initialPosts.filter((post) =>
                  post.tags?.includes(tag),
                ).length
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'theme-bg-muted theme-text-muted hover:theme-bg-hover'
                    }`}
                  >
                    {tag} ({tagCount})
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Blog Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="theme-text-muted text-lg">
              {selectedTags.length > 0
                ? `No posts found with the selected tag${selectedTags.length > 1 ? 's' : ''}`
                : 'No blog posts found'}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="theme-bg-card theme-border rounded-lg border p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="theme-text-foreground mb-2 text-xl font-semibold">
                    <Link
                      href={post.link}
                      className="transition-colors hover:text-[var(--color-primary)]"
                    >
                      {post.title}
                    </Link>
                  </h1>
                  <p className="theme-text-muted mb-3 text-sm">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="theme-text-muted flex items-center gap-4 text-sm">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
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
                      <span>by {post.author}</span>
                    </>
                  )}
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className="theme-bg-muted theme-text-muted hover:theme-bg-hover rounded px-2 py-1 text-xs transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Back to Home */}
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="theme-text-muted hover:theme-text-foreground transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
