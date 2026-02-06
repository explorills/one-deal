import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  src?: string
  alt?: string
  size?: AvatarSize
  fallback?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-lg',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({ src, alt = '', size = 'md', fallback, className, ...props }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showFallback = !src || imgError

  const initials = fallback ? getInitials(fallback) : alt ? getInitials(alt) : '?'

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full',
        sizeClasses[size],
        className,
      )}
    >
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
          {...props}
        />
      )}
    </div>
  )
}

export { Avatar, type AvatarProps, type AvatarSize }
