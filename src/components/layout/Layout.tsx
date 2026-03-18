import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[84px] sm:pt-[100px] pb-14">
        {children}
      </main>
      <Footer />
    </div>
  )
}
