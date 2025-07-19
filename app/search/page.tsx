"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, User, Briefcase, Video, MessageSquare } from "lucide-react"

interface SearchResult {
  id: string
  type: "campaign" | "user" | "video-request" | "message"
  title: string
  description: string
  metadata: Record<string, any>
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "campaign",
          title: "Summer Product Launch",
          description: "Marketing campaign for new product line targeting millennials",
          metadata: { client: "TechCorp Inc.", budget: "$5,000", status: "Active" },
        },
        {
          id: "2",
          type: "user",
          title: "Sarah Johnson",
          description: "Video producer specializing in corporate content",
          metadata: { rating: 4.9, completedProjects: 45, location: "New York" },
        },
        {
          id: "3",
          type: "video-request",
          title: "Product Demo Video",
          description: "2-minute demonstration video for mobile app",
          metadata: { budget: "$2,500", deadline: "2024-02-15", priority: "High" },
        },
        {
          id: "4",
          type: "campaign",
          title: "Brand Awareness Campaign",
          description: "Multi-platform brand awareness initiative",
          metadata: { client: "Fashion Brand", budget: "$3,200", status: "In Review" },
        },
      ]

      // Filter results based on search query
      const filteredResults = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setResults(filteredResults)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "campaign":
        return <Briefcase className="w-5 h-5 text-blue-600" />
      case "user":
        return <User className="w-5 h-5 text-green-600" />
      case "video-request":
        return <Video className="w-5 h-5 text-purple-600" />
      case "message":
        return <MessageSquare className="w-5 h-5 text-orange-600" />
      default:
        return <Search className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "campaign":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-green-100 text-green-800"
      case "video-request":
        return "bg-purple-100 text-purple-800"
      case "message":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredResults = results.filter((result) => {
    if (activeTab === "all") return true
    return result.type === activeTab
  })

  const getResultCounts = () => {
    const counts = results.reduce(
      (acc, result) => {
        acc[result.type] = (acc[result.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return counts
  }

  const counts = getResultCounts()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-600 mt-1">Find campaigns, users, and content across the platform.</p>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for campaigns, users, video requests..."
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button type="button" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found {results.length} result{results.length !== 1 ? "s" : ""} for "{initialQuery || query}"
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({results.length})</TabsTrigger>
                <TabsTrigger value="campaign">Campaigns ({counts.campaign || 0})</TabsTrigger>
                <TabsTrigger value="user">Users ({counts.user || 0})</TabsTrigger>
                <TabsTrigger value="video-request">Videos ({counts["video-request"] || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4 mt-6">
                {filteredResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getResultIcon(result.type)}
                          <div>
                            <CardTitle className="text-lg">{result.title}</CardTitle>
                            <CardDescription className="mt-1">{result.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getTypeColor(result.type)}>{result.type.replace("-", " ")}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(result.metadata).map(([key, value]) => (
                          <div key={key} className="text-sm text-gray-600">
                            <span className="font-medium capitalize">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredResults.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      {activeTab === "all"
                        ? "Try adjusting your search terms or filters"
                        : `No ${activeTab.replace("-", " ")} results found for this search`}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* No initial results */}
        {results.length === 0 && !loading && initialQuery && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try different keywords or check your spelling</p>
          </div>
        )}

        {/* Empty state */}
        {results.length === 0 && !loading && !initialQuery && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">Enter keywords to find campaigns, users, and content</p>
          </div>
        )}
      </div>
    </div>
  )
}
