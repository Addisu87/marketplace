import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { QuickActions } from "@/components/quick-actions"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarketPlace Pro - Video Marketing Platform",
  description: "Connect with creators and manage your video marketing campaigns",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pb-20">{children}</main>
          <QuickActions />
          <Toaster />
        </div>
      </body>
    </html>
  )
}
