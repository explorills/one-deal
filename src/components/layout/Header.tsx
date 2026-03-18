import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { OneIdAuth } from '@explorills/one-id-auth'
import { EcosystemDropdown } from './EcosystemDropdown'
import { PoweredByExplNodes } from './PoweredByExplNodes'
import logo from '/logo.png'

export function Header() {
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const badgeRef = useRef<HTMLAnchorElement & HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [hideTitle, setHideTitle] = useState(false)
  const [hideBadge, setHideBadge] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const THRESHOLD = 8
    const BUFFER = 30

    const check = () => {
      const right = rightRef.current
      if (!right) return

      const rightRect = right.getBoundingClientRect()

      if (badgeRef.current && !hideBadge) {
        const gap = rightRect.left - badgeRef.current.getBoundingClientRect().right
        if (gap < THRESHOLD) { setHideBadge(true); return }
      }

      if (hideBadge && titleRef.current && !hideTitle) {
        const gap = rightRect.left - titleRef.current.getBoundingClientRect().right
        if (gap < THRESHOLD) { setHideTitle(true); return }
      }

      if (hideTitle && logoRef.current) {
        const space = rightRect.left - logoRef.current.getBoundingClientRect().right
        if (space >= 160 + THRESHOLD + BUFFER) { setHideTitle(false); return }
      }

      if (hideBadge && !hideTitle && titleRef.current) {
        const space = rightRect.left - titleRef.current.getBoundingClientRect().right
        if (space >= 220 + THRESHOLD + BUFFER) { setHideBadge(false); return }
      }
    }

    const t = setTimeout(check, 50)
    const ro = new ResizeObserver(() => requestAnimationFrame(check))
    if (headerRef.current) ro.observe(headerRef.current)
    return () => { clearTimeout(t); ro.disconnect() }
  }, [hideBadge, hideTitle])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-border transition-all duration-200 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-lg'
          : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      }`}
    >
      <div ref={headerRef} className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-[11px] shrink-0">
          <Link to="/">
            <img
              ref={logoRef}
              src={logo}
              alt="ONE deal"
              className="w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] object-contain"
              width="66"
              height="66"
              loading="eager"
            />
          </Link>
          {!hideTitle && (
            <div className="flex flex-col gap-2">
              <Link to="/">
                <p
                  ref={titleRef}
                  role="heading"
                  aria-level={2}
                  className="text-[24px] sm:text-[26px] font-bold tracking-tight leading-none whitespace-nowrap"
                >
                  ONE <span className="text-primary drop-shadow-[0_0_8px_oklch(0.72_0.17_195/0.8)]">deal</span>
                </p>
              </Link>
              {!hideBadge && (
                <div ref={badgeRef}>
                  <PoweredByExplNodes size="sm" />
                </div>
              )}
            </div>
          )}
        </div>

        <div ref={rightRef} className="flex items-center gap-2 shrink-0">
          <OneIdAuth />
          <EcosystemDropdown />
        </div>
      </div>

      {(hideTitle || hideBadge) && (
        <div className="w-full bg-background/80 backdrop-blur border-b border-border py-2">
          <div className="container mx-auto px-4 sm:px-6 flex items-center justify-center gap-4">
            {hideTitle && (
              <span className="text-[20px] font-semibold whitespace-nowrap">
                ONE <span className="text-primary drop-shadow-[0_0_8px_oklch(0.72_0.17_195/0.8)]">deal</span>
              </span>
            )}
            {hideBadge && <PoweredByExplNodes size="sm" />}
          </div>
        </div>
      )}
    </header>
  )
}
