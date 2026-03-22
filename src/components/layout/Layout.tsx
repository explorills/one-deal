import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 pt-[84px] sm:pt-[100px] pb-14">
      {children}
    </main>
  )
}
