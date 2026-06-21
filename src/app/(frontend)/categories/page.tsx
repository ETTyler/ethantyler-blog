import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function CategoriesPage() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 200,
    overrideAccess: false,
    sort: 'title',
    select: {
      title: true,
      slug: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Categories</h1>
        </div>
      </div>

      <div className="container">
        {categories.docs.length > 0 ? (
          <ul className="flex flex-wrap gap-3 list-none p-0">
            {categories.docs.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center rounded-full border border-border px-4 py-2 text-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No categories yet.</p>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Categories — Ethan Tyler',
  }
}
