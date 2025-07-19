"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Video, MessageSquare, Plus, ArrowUpRight, Clock, Users, Target } from "lucide-react"

interface DashboardData {
  stats: {
    totalRevenue: number
    revenueChange: number
    activeCampaigns: number
    campaignsChange: number
    videoRequests: number
    videoChange: number
    newMessages: number
    messagesChange: number
  }
  recentCampaigns: Array<{
    id: number
    title: string
    client: string
    status: string
    budget: string
    progress: number
    deadline: string
  }>
  recentActivity: Array<{
    id: number
    action: string
    client: string
    time: string
    type: string
    avatar?: string
  }>
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In real app, this would be: const response = await apiClient.getDashboardStats()
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData: DashboardData = {
          stats: {
            totalRevenue: 45231.89,
            revenueChange: 20.1,
            activeCampaigns: 23,
            campaignsChange: 12,
            videoRequests: 156,
            videoChange: 8.2,
            newMessages: 42,
            messagesChange: -2.1,
          },
          recentCampaigns: [
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
          ],
          recentActivity: [
            {
              id: 1,
              action: "New video request received",
              client: "John Smith",
              time: "2 minutes ago",
              type: "request",
            },
            {
              id: 2,
              action: "Payment received",
              client: "TechCorp Inc.",
              time: "1 hour ago",
              type: "payment",
            },
            {
              id: 3,
              action: "Campaign approved",
              client: "Fashion Brand",
              time: "3 hours ago",
              type: "approval",
            },
          ],
        }

        setData(mockData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${data.stats.totalRevenue.toLocaleString()}`,
      change: `+${data.stats.revenueChange}%`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Campaigns",
      value: data.stats.activeCampaigns.toString(),
      change: `+${data.stats.campaignsChange}%`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Video Requests",
      value: data.stats.videoRequests.toString(),
      change: `+${data.stats.videoChange}%`,
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "New Messages",
      value: data.stats.newMessages.toString(),
      change: `${data.stats.messagesChange}%`,
      icon: MessageSquare,
      color: data.stats.messagesChange > 0 ? "text-green-600" : "text-red-600",
      bgColor: data.stats.messagesChange > 0 ? "bg-green-100" : "bg-red-100",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your marketplace.</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className={`flex items-center text-xs ${stat.color} mt-1`}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Campaigns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest campaign activities and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                        <Badge
                          variant={
                            campaign.status === "Active"
                              ? "default"
                              : campaign.status === "Completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{campaign.client}</p>
                      <div className="flex items-center space-x-3">
                        <Progress value={campaign.progress} className="flex-1" />
                        <span className="text-sm text-gray-500">{campaign.progress}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">{campaign.budget}</span>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
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
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="text-xs">
                        {activity.client
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-orange-50 bg-transparent">
                <Video className="h-6 w-6 text-orange-600" />
                <span>Create Video Request</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-blue-50 bg-transparent">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <span>Send Message</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-green-50 bg-transparent">
                <DollarSign className="h-6 w-6 text-green-600" />
                <span>Process Payment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-purple-50 bg-transparent">
                <Users className="h-6 w-6 text-purple-600" />
                <span>Manage Clients</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
