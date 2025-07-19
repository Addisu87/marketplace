"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Play, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VideoRequest {
  id: number
  title: string
  client: string
  status: "Pending" | "In Progress" | "Review" | "Completed" | "Revision Requested"
  priority: "Low" | "Medium" | "High" | "Urgent"
  budget: string
  deadline: string
  description: string
  requirements: string[]
}

export default function VideoRequestsPage() {
  const [videoRequests, setVideoRequests] = useState<VideoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchVideoRequests = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockRequests: VideoRequest[] = [
          {
            id: 1,
            title: "Product Demo Video",
            client: "TechCorp Inc.",
            status: "In Progress",
            priority: "High",
            budget: "$2,500",
            deadline: "2024-02-10",
            description: "Create a 2-minute product demonstration video",
            requirements: ["4K Resolution", "Professional Voiceover", "Motion Graphics"],
          },
          {
            id: 2,
            title: "Brand Story Video",
            client: "Fashion Brand",
            status: "Pending",
            priority: "Medium",
            budget: "$1,800",
            deadline: "2024-02-15",
            description: "Tell our brand story in an engaging video format",
            requirements: ["Cinematic Style", "Background Music", "Subtitles"],
          },
          {
            id: 3,
            title: "Social Media Ads",
            client: "E-commerce Store",
            status: "Review",
            priority: "Urgent",
            budget: "$3,200",
            deadline: "2024-02-05",
            description: "Create multiple short videos for social media advertising",
            requirements: ["Multiple Formats", "Quick Turnaround", "A/B Testing Versions"],
          },
          {
            id: 4,
            title: "Training Video Series",
            client: "StartupXYZ",
            status: "Completed",
            priority: "Low",
            budget: "$4,000",
            deadline: "2024-01-30",
            description: "Educational video series for employee training",
            requirements: ["Screen Recording", "Interactive Elements", "Quiz Integration"],
          },
        ]

        setVideoRequests(mockRequests)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load video requests",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVideoRequests()
  }, [toast])

  const filteredRequests = videoRequests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: VideoRequest["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Review":
        return "bg-purple-100 text-purple-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Revision Requested":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: VideoRequest["priority"]) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-800"
      case "Medium":
        return "bg-blue-100 text-blue-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateRequest = () => {
    toast({
      title: "Create Video Request",
      description: "Video request creation form would open here",
    })
  }

  const handleViewRequest = (id: number) => {
    toast({
      title: "View Request",
      description: `Opening video request ${id} details`,
    })
  }

  const handleStartWork = (id: number) => {
    setVideoRequests(videoRequests.map((req) => (req.id === id ? { ...req, status: "In Progress" as const } : req)))
    toast({
      title: "Work Started",
      description: "Video request status updated to In Progress",
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Requests</h1>
            <p className="text-gray-600 mt-1">Manage video requests and track production progress.</p>
          </div>
          <Button onClick={handleCreateRequest} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoRequests.length}</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoRequests.filter((r) => r.status === "In Progress").length}</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoRequests.filter((r) => r.status === "Review").length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoRequests.filter((r) => r.priority === "Urgent").length}</div>
              <p className="text-xs text-muted-foreground">High priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search video requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">Export</Button>
        </div>

        {/* Video Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Video Requests</CardTitle>
            <CardDescription>Manage and track all video production requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{request.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.client}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{request.budget}</TableCell>
                    <TableCell>{request.deadline}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewRequest(request.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {request.status === "Pending" && (
                            <DropdownMenuItem onClick={() => handleStartWork(request.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Start Work
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
