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
  const [selectedTag, setSelectedTag] = useState<string>('')

  const handleTagFilter = (tag: string) => {
    const newTag = tag === selectedTag ? '' : tag
    setSelectedTag(newTag)

    if (newTag) {
      const filteredPosts = initialPosts.filter((post) =>
        post.tags?.includes(newTag),
      )
      setPosts(filteredPosts)
    } else {
      setPosts(initialPosts)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="theme-text-foreground mb-4 text-3xl font-bold">
          All Blog Posts
        </h1>
        <p className="theme-text-muted text-lg">
          Explore all {posts.length} blog posts
          {selectedTag && ` tagged with "${selectedTag}"`}
        </p>
      </header>

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div className="mb-8">
          <h2 className="theme-text-foreground mb-4 text-lg font-semibold">
            Filter by Tag
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTagFilter('')}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                !selectedTag
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
                    selectedTag === tag
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'theme-bg-muted theme-text-muted hover:theme-bg-hover'
                  }`}
                >
                  {tag} ({tagCount})
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Blog Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="theme-text-muted text-lg">
              {selectedTag
                ? `No posts found with tag "${selectedTag}"`
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
                  <h2 className="theme-text-foreground text-xl font-semibold">
                    <Link
                      href={post.link}
                      className="transition-colors hover:text-[var(--color-primary)]"
                    >
                      {post.title}
                    </Link>
                  </h2>
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
