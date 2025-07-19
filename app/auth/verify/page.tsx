"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Shield, Globe } from "lucide-react"

export default function VerifyPage() {
  const [language, setLanguage] = useState("english")
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()

  const handleBegin = async () => {
    setIsVerifying(true)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to main dashboard
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* Security Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-orange-600">Let's confirm you are human</h1>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            Complete the security check before continuing. This step verifies that you are not a bot, which helps to
            protect your account and prevent spam.
          </p>

          {/* Begin Button */}
          <Button
            onClick={handleBegin}
            disabled={isVerifying}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {isVerifying ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Begin</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          {/* Language Selector */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Globe className="w-4 h-4 text-gray-500" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Español</SelectItem>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="german">Deutsch</SelectItem>
                <SelectItem value="chinese">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
