import React from 'react'
import Link from 'next/link'

interface CardProps {
  title: string
  description: string
  icon?: React.ReactNode
  href?: string
  variant?: 'tool' | 'category'
  onClick?: () => void
}

export function Card({
  title,
  description,
  icon,
  href,
  variant = 'tool',
  onClick,
}: CardProps) {
  const cardClass = variant === 'category' ? 'category-card' : 'tool-card'

  const content = (
    <>
      {icon && (
        <div className="mb-4 text-cyan-star">
          {icon}
        </div>
      )}
      <h3 className={`font-bold mb-2 ${variant === 'category' ? 'text-xl text-cyan-star' : 'text-lg text-white'}`}>
        {title}
      </h3>
      <p className="text-sm text-slate-text">
        {description}
      </p>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`${cardClass} block`}>
        {content}
      </Link>
    )
  }

  return (
    <div onClick={onClick} className={cardClass}>
      {content}
    </div>
  )
}
