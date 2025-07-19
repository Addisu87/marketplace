"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  MessageSquare,
  DollarSign,
  Briefcase,
  Video,
  User,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "message" | "payment" | "campaign" | "video-request" | "system"
  title: string
  description: string
  timestamp: string
  read: boolean
  actionUrl?: string
  avatar?: string
  metadata?: Record<string, any>
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "message",
          title: "New message from Sarah Johnson",
          description: "Hi! I'd like to discuss the video project requirements...",
          timestamp: "2024-01-15T10:30:00Z",
          read: false,
          actionUrl: "/messages/1",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "2",
          type: "payment",
          title: "Payment received",
          description: "You received $500.00 for Summer Product Launch campaign",
          timestamp: "2024-01-15T09:15:00Z",
          read: false,
          actionUrl: "/wallet",
          metadata: { amount: 500, campaign: "Summer Product Launch" },
        },
        {
          id: "3",
          type: "campaign",
          title: "Campaign status updated",
          description: "Brand Awareness Campaign has been approved and is now active",
          timestamp: "2024-01-14T16:45:00Z",
          read: true,
          actionUrl: "/campaigns/2",
          metadata: { status: "Active", campaign: "Brand Awareness Campaign" },
        },
        {
          id: "4",
          type: "video-request",
          title: "New video request",
          description: "TechCorp Inc. submitted a new video request for product demo",
          timestamp: "2024-01-14T14:20:00Z",
          read: true,
          actionUrl: "/video-requests/3",
          metadata: { client: "TechCorp Inc.", type: "Product Demo" },
        },
        {
          id: "5",
          type: "system",
          title: "Profile verification complete",
          description: "Your profile has been successfully verified. You can now access all features.",
          timestamp: "2024-01-13T11:00:00Z",
          read: true,
          actionUrl: "/profile",
        },
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read",
    })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    toast({
      title: "Notification deleted",
      description: "Notification has been removed",
    })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />
      case "campaign":
        return <Briefcase className="w-5 h-5 text-purple-600" />
      case "video-request":
        return <Video className="w-5 h-5 text-orange-600" />
      case "system":
        return <Bell className="w-5 h-5 text-gray-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "campaign":
        return "bg-purple-100 text-purple-800"
      case "video-request":
        return "bg-orange-100 text-orange-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your latest activities and messages.
              {unreadCount > 0 && <span className="ml-2 text-orange-600 font-medium">({unreadCount} unread)</span>}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="campaign">Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md cursor-pointer ${
                    !notification.read ? "border-l-4 border-l-orange-500 bg-orange-50/30" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Icon or Avatar */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={notification.avatar || "/placeholder.svg"} alt="User" />
                            <AvatarFallback>
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3
                                className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                              >
                                {notification.title}
                              </h3>
                              <Badge className={getTypeColor(notification.type)} variant="secondary">
                                {notification.type}
                              </Badge>
                              {!notification.read && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.metadata && (
                                <div className="flex space-x-2">
                                  {Object.entries(notification.metadata).map(([key, value]) => (
                                    <span key={key}>
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">
                  {activeTab === "unread"
                    ? "All caught up! No unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
