'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

const navLinkClasses =
  'text-sm font-medium text-foreground hover:text-primary hover:no-underline transition-colors'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-5 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink className={navLinkClasses} key={i} {...link} appearance="link" />
      })}
      <Link className={navLinkClasses} href="/categories">
        Categories
      </Link>
      <Link className={navLinkClasses} href="https://www.ethantyler.dev">
        Portfolio
      </Link>
      <Link
        className="text-foreground hover:text-primary transition-colors ml-1"
        href="/search"
        aria-label="Search"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5" />
      </Link>
    </nav>
  )
}
