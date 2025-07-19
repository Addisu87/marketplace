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
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, DollarSign, Video, Clock, ArrowLeft, Plus, X, Upload, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function NewVideoRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deadline, setDeadline] = useState<Date>()

  const [request, setRequest] = useState({
    title: "",
    description: "",
    client: "",
    type: "",
    budget: "",
    priority: "",
    duration: "",
    style: "",
    requirements: [] as string[],
    references: "",
    voiceover: false,
    music: false,
    subtitles: false,
    revisions: "2",
  })

  const [newRequirement, setNewRequirement] = useState("")

  const videoTypes = [
    "Product Demo",
    "Explainer Video",
    "Social Media Ad",
    "Brand Story",
    "Tutorial",
    "Testimonial",
    "Event Coverage",
    "Animation",
    "Corporate Video",
  ]

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ]

  const videoStyles = [
    "Professional/Corporate",
    "Casual/Friendly",
    "Modern/Trendy",
    "Minimalist",
    "Cinematic",
    "Animated",
    "Documentary Style",
    "Creative/Artistic",
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setRequest((prev) => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequest((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setRequest((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!request.title || !request.client || !request.type || !request.budget || !request.priority) {
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
        title: "Video Request Created",
        description: "Your video request has been successfully submitted.",
      })

      router.push("/video-requests")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create video request. Please try again.",
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
            <h1 className="text-3xl font-bold text-gray-900">Create Video Request</h1>
            <p className="text-gray-600 mt-1">Submit a new video production request with detailed specifications.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the essential details for your video request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title *</Label>
                  <Input
                    id="title"
                    value={request.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    value={request.client}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Video Type *</Label>
                  <Select value={request.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select video type" />
                    </SelectTrigger>
                    <SelectContent>
                      {videoTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={request.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${priority.color.split(" ")[0]}`} />
                            {priority.label}
                          </div>
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
                      value={request.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Expected Duration</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="duration"
                      value={request.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="e.g., 2-3 minutes"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={request.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your video requirements, goals, and vision..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Deadline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Timeline & Deadline
              </CardTitle>
              <CardDescription>Set the deadline for your video project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Deadline *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : "Pick a deadline"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revisions">Number of Revisions</Label>
                  <Select value={request.revisions} onValueChange={(value) => handleInputChange("revisions", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Revision</SelectItem>
                      <SelectItem value="2">2 Revisions</SelectItem>
                      <SelectItem value="3">3 Revisions</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {deadline && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Rush orders (less than 7 days) may incur additional fees.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Video Specifications
              </CardTitle>
              <CardDescription>Define the style and technical requirements for your video.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="style">Video Style</Label>
                <Select value={request.style} onValueChange={(value) => handleInputChange("style", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select video style" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoStyles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Additional Services</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="voiceover"
                      checked={request.voiceover}
                      onCheckedChange={(checked) => handleInputChange("voiceover", checked as boolean)}
                    />
                    <Label htmlFor="voiceover">Professional Voiceover</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="music"
                      checked={request.music}
                      onCheckedChange={(checked) => handleInputChange("music", checked as boolean)}
                    />
                    <Label htmlFor="music">Background Music</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subtitles"
                      checked={request.subtitles}
                      onCheckedChange={(checked) => handleInputChange("subtitles", checked as boolean)}
                    />
                    <Label htmlFor="subtitles">Subtitles/Captions</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
              <CardDescription>Specify any technical requirements or constraints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement (e.g., 4K resolution, specific format)..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {request.requirements.map((requirement, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    {requirement}
                    <button type="button" onClick={() => removeRequirement(index)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* References */}
          <Card>
            <CardHeader>
              <CardTitle>References & Inspiration</CardTitle>
              <CardDescription>Provide reference materials or inspiration for the video style.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="references">Reference Links or Notes</Label>
                <Textarea
                  id="references"
                  value={request.references}
                  onChange={(e) => handleInputChange("references", e.target.value)}
                  placeholder="Share links to videos you like, or describe the style you're looking for..."
                  rows={3}
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  <strong>Upload Reference Files</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">Drag and drop files here or click to browse (Coming Soon)</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
