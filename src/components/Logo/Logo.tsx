import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      className={clsx(
        'text-primary font-semibold text-xl tracking-tight whitespace-nowrap',
        className,
      )}
    >
      Ethan Tyler
    </span>
  )
}
