import { Link } from 'react-router-dom'
import { Send, Twitter, Github, MessageCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ROUTES } from '../../lib/constants'

const FOOTER_SECTIONS = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Explore', to: ROUTES.explore },
      { label: 'Rankings', to: ROUTES.rankings },
      { label: 'Create NFT', to: ROUTES.create },
      { label: 'Create Collection', to: ROUTES.createCollection },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', to: '#' },
      { label: 'Platform Status', to: '#' },
      { label: 'Partners', to: '#' },
      { label: 'Blog', to: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Privacy Policy', to: '#' },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: 'Twitter', icon: Twitter, href: '#' },
  { label: 'Discord', icon: MessageCircle, href: '#' },
  { label: 'GitHub', icon: Github, href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* Top section */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Newsletter */}
          <div className="sm:col-span-2">
            <Link to={ROUTES.home} className="inline-flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">
                O
              </div>
              ONE Deal
            </Link>
            <p className="mt-3 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              The premier NFT marketplace. Discover, collect, and sell extraordinary digital assets.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Stay in the loop
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex max-w-sm gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    'h-10 flex-1 rounded-lg border px-3 text-sm',
                    'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400',
                    'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500',
                    'transition-colors duration-150 focus-ring',
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    'bg-brand-600 text-white transition-colors hover:bg-brand-700',
                  )}
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} ONE Deal. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
