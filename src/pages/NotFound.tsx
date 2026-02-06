import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '../components/ui'
import { SearchBar } from '../components/search/SearchBar'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* 404 text illustration */}
      <div className="mb-6 select-none">
        <span className="text-8xl font-black text-zinc-200 dark:text-zinc-800 sm:text-9xl">
          404
        </span>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try searching or head back to the homepage.
      </p>

      {/* Search suggestion */}
      <div className="mb-6 w-full max-w-md">
        <SearchBar placeholder="Search NFTs, collections, users..." />
      </div>

      {/* Go home button */}
      <Link to="/">
        <Button size="lg">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </Link>
    </div>
  )
}
