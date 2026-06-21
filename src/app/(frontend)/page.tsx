import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [posts, categories] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 9,
      overrideAccess: false,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 50,
      overrideAccess: false,
      sort: 'title',
      select: {
        title: true,
        slug: true,
      },
    }),
  ])

  return (
    <div className="pb-24">
      {/* Intro */}
      <section className="container pt-12 md:pt-20 pb-10">
        <p className="text-primary text-sm font-medium mb-3">Ethan Tyler · Blog</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-5">
          Thoughts and Experiences
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          This is where I write about whatever I find interesting: travel, music, film and TV,
          philosophy, sport, the projects I&apos;m building, and the things I&apos;m learning along
          the way. For my work and projects, head to{' '}
          <a className="text-primary hover:underline" href="https://www.ethantyler.dev">
            my portfolio
          </a>
          .
        </p>
      </section>

      {/* Browse by category */}
      {categories.docs.length > 0 && (
        <section className="container pb-12">
          <ul className="flex flex-wrap gap-3 list-none p-0">
            {categories.docs.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Latest posts */}
      <section>
        <div className="container mb-8">
          <h2 className="text-2xl font-semibold">Latest posts</h2>
        </div>

        {posts.docs.length > 0 ? (
          <CollectionArchive posts={posts.docs} />
        ) : (
          <div className="container">
            <p className="text-muted-foreground">No posts yet — check back soon.</p>
          </div>
        )}

        {posts.totalDocs > posts.docs.length && (
          <div className="container mt-10">
            <Link
              href="/posts"
              className="inline-flex items-center rounded-md border border-primary/55 px-5 py-2 text-sm font-medium text-primary hover:bg-primary/10 hover:border-primary transition-colors"
            >
              View all posts →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Ethan Tyler — Blog',
    description:
      'Notes on software engineering, side projects, and the things I am building and learning.',
  }
}
