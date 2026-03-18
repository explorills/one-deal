import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="font-mono text-6xl sm:text-8xl font-bold text-primary/20 mb-4">404</p>
      <p className="text-sm text-muted-foreground mb-6">Page not found</p>
      <Link to="/" className="text-sm text-primary hover:underline">Back to home</Link>
    </div>
  )
}
