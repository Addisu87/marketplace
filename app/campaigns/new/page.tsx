"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, DollarSign, Target, Users, Video, ArrowLeft, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function NewCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    client: "",
    type: "",
    budget: "",
    objectives: [] as string[],
    targetAudience: "",
    deliverables: [] as string[],
    requirements: "",
  })

  const [newObjective, setNewObjective] = useState("")
  const [newDeliverable, setNewDeliverable] = useState("")

  const campaignTypes = [
    "Video Marketing",
    "Social Media",
    "Influencer",
    "Educational",
    "Product Demo",
    "Brand Awareness",
    "Event Promotion",
  ]

  const handleInputChange = (field: string, value: string) => {
    setCampaign((prev) => ({ ...prev, [field]: value }))
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setCampaign((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }))
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setCampaign((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }))
  }

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setCampaign((prev) => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()],
      }))
      setNewDeliverable("")
    }
  }

  const removeDeliverable = (index: number) => {
    setCampaign((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!campaign.title || !campaign.client || !campaign.type || !campaign.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Campaign Created",
        description: "Your campaign has been successfully created.",
      })

      router.push("/campaigns")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
            <p className="text-gray-600 mt-1">Set up a new marketing campaign with detailed requirements.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the essential details for your campaign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    value={campaign.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter campaign title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    value={campaign.client}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Campaign Type *</Label>
                  <Select value={campaign.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="budget"
                      type="number"
                      value={campaign.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={campaign.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your campaign goals and vision..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
              <CardDescription>Set the start and end dates for your campaign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Campaign Objectives
              </CardTitle>
              <CardDescription>Define the key objectives for this campaign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add an objective..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                />
                <Button type="button" onClick={addObjective}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {campaign.objectives.map((objective, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    {objective}
                    <button type="button" onClick={() => removeObjective(index)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Target Audience
              </CardTitle>
              <CardDescription>Describe your target audience and demographics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  value={campaign.targetAudience}
                  onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  placeholder="Describe your target audience (age, interests, demographics, etc.)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Deliverables
              </CardTitle>
              <CardDescription>Specify what deliverables are expected from this campaign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  placeholder="Add a deliverable..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDeliverable())}
                />
                <Button type="button" onClick={addDeliverable}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {campaign.deliverables.map((deliverable, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    {deliverable}
                    <button type="button" onClick={() => removeDeliverable(index)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Requirements</CardTitle>
              <CardDescription>Any specific requirements or notes for the campaign.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements & Notes</Label>
                <Textarea
                  id="requirements"
                  value={campaign.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  placeholder="Any specific requirements, technical specifications, or additional notes..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
