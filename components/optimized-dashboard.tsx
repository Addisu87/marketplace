"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TrendingUp,
  DollarSign,
  Video,
  MessageSquare,
  Star,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  activeCampaigns: number
  campaignsChange: number
  videoRequests: number
  videoChange: number
  newMessages: number
  messagesChange: number
}

interface Campaign {
  id: number
  title: string
  client: string
  status: "Active" | "In Review" | "Completed" | "Paused"
  budget: string
  progress: number
  deadline: string
}

interface Activity {
  id: number
  action: string
  client: string
  time: string
  type: "request" | "payment" | "approval" | "message"
  avatar?: string
}

export function OptimizedDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 45231.89,
    revenueChange: 20.1,
    activeCampaigns: 23,
    campaignsChange: 12,
    videoRequests: 156,
    videoChange: 8.2,
    newMessages: 42,
    messagesChange: -2.1,
  })

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: "Summer Product Launch",
      client: "TechCorp Inc.",
      status: "Active",
      budget: "$5,000",
      progress: 75,
      deadline: "2024-02-15",
    },
    {
      id: 2,
      title: "Brand Awareness Campaign",
      client: "Fashion Brand",
      status: "In Review",
      budget: "$3,200",
      progress: 45,
      deadline: "2024-02-20",
    },
    {
      id: 3,
      title: "Holiday Promotion",
      client: "E-commerce Store",
      status: "Completed",
      budget: "$2,800",
      progress: 100,
      deadline: "2023-12-31",
    },
  ])

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      action: "New video request received",
      client: "John Smith",
      time: "2 minutes ago",
      type: "request",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      action: "Payment received",
      client: "TechCorp Inc.",
      time: "1 hour ago",
      type: "payment",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      action: "Campaign approved",
      client: "Fashion Brand",
      time: "3 hours ago",
      type: "approval",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      action: "New message received",
      client: "E-commerce Store",
      time: "5 hours ago",
      type: "message",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])

  // Memoized calculations for performance
  const statsCards = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: `$${stats.totalRevenue.toLocaleString()}`,
        change: `+${stats.revenueChange}%`,
        icon: DollarSign,
        trend: "up" as const,
        color: "text-green-600",
      },
      {
        title: "Active Campaigns",
        value: stats.activeCampaigns.toString(),
        change: `+${stats.campaignsChange}%`,
        icon: TrendingUp,
        trend: "up" as const,
        color: "text-blue-600",
      },
      {
        title: "Video Requests",
        value: stats.videoRequests.toString(),
        change: `+${stats.videoChange}%`,
        icon: Video,
        trend: "up" as const,
        color: "text-purple-600",
      },
      {
        title: "New Messages",
        value: stats.newMessages.toString(),
        change: `${stats.messagesChange}%`,
        icon: MessageSquare,
        trend: stats.messagesChange > 0 ? ("up" as const) : ("down" as const),
        color: stats.messagesChange > 0 ? "text-green-600" : "text-red-600",
      },
    ],
    [stats],
  )

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Paused":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "request":
        return <Video className="h-4 w-4 text-purple-600" />
      case "payment":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "approval":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your marketplace.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className={`flex items-center text-xs ${stat.color}`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Campaigns */}
        <Card className="col-span-4 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Campaigns</CardTitle>
            <CardDescription>Your latest campaign activities and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{campaign.title}</p>
                      <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>{campaign.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{campaign.client}</p>
                    <div className="flex items-center space-x-3">
                      <Progress value={campaign.progress} className="flex-1 h-2" />
                      <span className="text-xs text-gray-500 min-w-[3rem]">{campaign.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium text-gray-900">{campaign.budget}</span>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Due {campaign.deadline}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {activity.client
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getActivityIcon(activity.type)}
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                    </div>
                    <p className="text-sm text-gray-600">{activity.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts to get things done faster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex-col bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-200"
            >
              <Video className="h-6 w-6 mb-2 text-orange-600" />
              <span className="text-gray-900">Create Video Request</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-200"
            >
              <MessageSquare className="h-6 w-6 mb-2 text-blue-600" />
              <span className="text-gray-900">Send Message</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col bg-white hover:bg-green-50 border-gray-200 hover:border-green-200"
            >
              <DollarSign className="h-6 w-6 mb-2 text-green-600" />
              <span className="text-gray-900">Process Payment</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-200"
            >
              <Star className="h-6 w-6 mb-2 text-purple-600" />
              <span className="text-gray-900">View Reviews</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
