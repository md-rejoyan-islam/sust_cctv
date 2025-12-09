"use client"

import type React from "react"
import { Header } from "./header"
import { MobileNav } from "./mobile-nav"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-4 md:p-6">{children}</div>
      </main>
      <MobileNav />
    </div>
  )
}
