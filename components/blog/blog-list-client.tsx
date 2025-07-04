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
      const filteredPosts = initialPosts.filter(post => 
        post.tags?.includes(newTag)
      )
      setPosts(filteredPosts)
    } else {
      setPosts(initialPosts)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="theme-text-foreground text-3xl font-bold mb-4">
          All Blog Posts
        </h1>
        <p className="theme-text-muted text-lg">
          Explore all {posts.length} blog posts{selectedTag && ` tagged with "${selectedTag}"`}
        </p>
      </header>

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div className="mb-8">
          <h2 className="theme-text-foreground text-lg font-semibold mb-4">
            Filter by Tag
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTagFilter('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !selectedTag
                  ? 'bg-blue-500 text-white'
                  : 'theme-bg-muted theme-text-muted hover:theme-bg-hover'
              }`}
            >
              All ({initialPosts.length})
            </button>
            {tags.map((tag) => {
              const tagCount = initialPosts.filter(post => post.tags?.includes(tag)).length
              return (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-500 text-white'
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
          <div className="text-center py-12">
            <p className="theme-text-muted text-lg">
              {selectedTag ? `No posts found with tag "${selectedTag}"` : 'No blog posts found'}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="theme-bg-card theme-border border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="theme-text-foreground text-xl font-semibold mb-2">
                    <Link
                      href={post.link}
                      className="hover:text-blue-500 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="theme-text-muted text-sm mb-3">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm theme-text-muted">
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
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className="theme-bg-muted theme-text-muted hover:theme-bg-hover px-2 py-1 rounded text-xs transition-colors"
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

