"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Campaign {
  id: number
  title: string
  client: string
  status: "Active" | "In Review" | "Completed" | "Draft" | "Paused"
  budget: string
  spent: string
  progress: number
  startDate: string
  endDate: string
  type: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockCampaigns: Campaign[] = [
          {
            id: 1,
            title: "Summer Product Launch",
            client: "TechCorp Inc.",
            status: "Active",
            budget: "$5,000",
            spent: "$3,750",
            progress: 75,
            startDate: "2024-01-15",
            endDate: "2024-02-15",
            type: "Video Marketing",
          },
          {
            id: 2,
            title: "Brand Awareness Campaign",
            client: "Fashion Brand",
            status: "In Review",
            budget: "$3,200",
            spent: "$1,440",
            progress: 45,
            startDate: "2024-01-20",
            endDate: "2024-02-20",
            type: "Social Media",
          },
          {
            id: 3,
            title: "Holiday Promotion",
            client: "E-commerce Store",
            status: "Completed",
            budget: "$2,800",
            spent: "$2,800",
            progress: 100,
            startDate: "2023-12-01",
            endDate: "2023-12-31",
            type: "Influencer",
          },
          {
            id: 4,
            title: "App Launch Campaign",
            client: "StartupXYZ",
            status: "Draft",
            budget: "$4,500",
            spent: "$0",
            progress: 0,
            startDate: "2024-02-01",
            endDate: "2024-03-01",
            type: "Video Marketing",
          },
        ]

        setCampaigns(mockCampaigns)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load campaigns",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [toast])

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.client.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "In Review":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      case "Paused":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateCampaign = () => {
    toast({
      title: "Create Campaign",
      description: "Campaign creation form would open here",
    })
  }

  const handleViewCampaign = (id: number) => {
    toast({
      title: "View Campaign",
      description: `Opening campaign ${id} details`,
    })
  }

  const handleEditCampaign = (id: number) => {
    toast({
      title: "Edit Campaign",
      description: `Opening campaign ${id} for editing`,
    })
  }

  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter((c) => c.id !== id))
    toast({
      title: "Campaign Deleted",
      description: "Campaign has been successfully deleted",
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
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage your marketing campaigns and track their performance.</p>
          </div>
          <Button onClick={handleCreateCampaign} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,200</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search campaigns..."
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

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>A comprehensive list of all your marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.title}</TableCell>
                    <TableCell>{campaign.client}</TableCell>
                    <TableCell>{campaign.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{campaign.budget}</div>
                        <div className="text-xs text-muted-foreground">Spent: {campaign.spent}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={campaign.progress} className="w-16" />
                        <span className="text-xs text-muted-foreground">{campaign.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.endDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCampaign(campaign.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCampaign(campaign.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCampaign(campaign.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
