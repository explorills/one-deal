import { type ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileBottomBar } from './MobileBottomBar'
import { Breadcrumbs } from './Breadcrumbs'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main content — offset for fixed header + mobile bottom bar */}
      <main className="flex-1 pt-14 pb-16 md:pt-16 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Breadcrumbs className="py-3" />
          {children}
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  )
}
