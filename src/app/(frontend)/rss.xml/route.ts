import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 600

const escapeXml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const siteURL = getServerSideURL()

  // overrideAccess: false ensures only published posts are returned (public access)
  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 50,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      meta: true,
    },
  })

  const items = posts.docs
    .map((post) => {
      const url = `${siteURL}/posts/${post.slug}`
      const description = post.meta?.description || ''
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''

      return `    <item>
      <title>${escapeXml(post.title || 'Untitled')}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>${
        pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ''
      }
      <description>${escapeXml(description)}</description>
    </item>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ethan Tyler — Blog</title>
    <link>${siteURL}</link>
    <description>Latest posts from Ethan Tyler</description>
    <language>en</language>
    <atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
