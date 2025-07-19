"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { RealTimeChat } from "@/components/real-time-chat"

export default function MessagesPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {" "}
      {/* 4rem ≈ navbar height */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">MarketPlace&nbsp;Pro</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Messages</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">Real-time communication with your clients and team.</p>
          </div>
        </div>

        <Separator />

        <RealTimeChat />
      </div>
    </div>
  )
}
