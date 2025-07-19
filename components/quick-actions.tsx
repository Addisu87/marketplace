"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Briefcase, Video, MessageSquare, DollarSign, Users, BarChart3, Zap, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  color: string
}

export function QuickActions() {
  const router = useRouter()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)

  const quickActions: QuickAction[] = [
    {
      id: "new-campaign",
      title: "Create Campaign",
      description: "Start a new marketing campaign",
      icon: Briefcase,
      action: () => {
        router.push("/campaigns/new")
        toast({
          title: "Creating Campaign",
          description: "Redirecting to campaign creation form...",
        })
      },
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "new-video-request",
      title: "Video Request",
      description: "Submit a new video production request",
      icon: Video,
      action: () => {
        router.push("/video-requests/new")
        toast({
          title: "Creating Video Request",
          description: "Redirecting to video request form...",
        })
      },
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "send-message",
      title: "Send Message",
      description: "Start a conversation with a client or creator",
      icon: MessageSquare,
      action: () => {
        router.push("/messages")
        toast({
          title: "Opening Messages",
          description: "Redirecting to messages...",
        })
      },
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "add-funds",
      title: "Add Funds",
      description: "Add money to your wallet",
      icon: DollarSign,
      action: () => {
        router.push("/wallet?tab=add-funds")
        toast({
          title: "Add Funds",
          description: "Opening wallet to add funds...",
        })
      },
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "find-creators",
      title: "Find Creators",
      description: "Browse and connect with content creators",
      icon: Users,
      action: () => {
        router.push("/search?type=creators")
        toast({
          title: "Finding Creators",
          description: "Searching for available creators...",
        })
      },
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      id: "view-analytics",
      title: "View Analytics",
      description: "Check your performance metrics",
      icon: BarChart3,
      action: () => {
        router.push("/analytics")
        toast({
          title: "Analytics",
          description: "Opening analytics dashboard...",
        })
      },
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ]

  const handleQuickAction = (action: QuickAction) => {
    setDialogOpen(false)
    action.action()
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-14 h-14 bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {quickActions.slice(0, 4).map((action) => (
              <DropdownMenuItem key={action.id} onClick={() => handleQuickAction(action)}>
                <action.icon className="mr-2 h-4 w-4" />
                {action.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              <Zap className="mr-2 h-4 w-4" />
              More Actions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Actions Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Actions
            </DialogTitle>
            <DialogDescription>Choose an action to get started quickly</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleQuickAction(action)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{action.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs">{action.description}</CardDescription>
                  <div className="flex items-center justify-end mt-3">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
