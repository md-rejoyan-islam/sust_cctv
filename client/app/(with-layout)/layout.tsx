import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import type React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background ">
      <Header />
      <main className="flex-1 px-4 md:px-6 pt-5  pb-20 md:pb-10 w-full max-w-7xl mx-auto">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
