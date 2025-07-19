"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Phone, Video, MoreVertical, Search } from "lucide-react"
import { chatService, type ChatConversation, type ChatMessage } from "@/lib/chat"
import { formatDistanceToNow } from "@/lib/time"

export function RealTimeChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize chat service
    chatService.connect("current")

    // Subscribe to conversations
    const unsubscribeConversations = chatService.subscribeToConversations(setConversations)
    setConversations(chatService.getConversations())

    return () => {
      unsubscribeConversations()
      chatService.disconnect()
    }
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      // Subscribe to messages for selected conversation
      const unsubscribeMessages = chatService.subscribeToMessages(selectedConversation.id, setMessages)

      setMessages(chatService.getMessages(selectedConversation.id))

      // Mark messages as read
      chatService.markAsRead(selectedConversation.id, "current")

      return unsubscribeMessages
    }
  }, [selectedConversation])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    await chatService.sendMessage(selectedConversation.id, newMessage, "current", "You")

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getOtherParticipant = (conversation: ChatConversation) => {
    return conversation.participants.find((p) => p.id !== "current")
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation)
              return (
                <div
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-muted/50 border-b ${
                    selectedConversation?.id === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {otherParticipant?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    {otherParticipant?.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{otherParticipant?.name || "Unknown"}</p>
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessage &&
                          formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              )
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-3 flex-1">
                <Avatar>
                  <AvatarImage src={getOtherParticipant(selectedConversation)?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {getOtherParticipant(selectedConversation)
                      ?.name.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{getOtherParticipant(selectedConversation)?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {getOtherParticipant(selectedConversation)?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "current" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === "current" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-xs ${
                              message.senderId === "current" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                          </p>
                          {message.senderId === "current" && (
                            <span
                              className={`text-xs ${
                                message.status === "read"
                                  ? "text-blue-400"
                                  : message.status === "delivered"
                                    ? "text-gray-400"
                                    : message.status === "sent"
                                      ? "text-gray-300"
                                      : "text-gray-200"
                              }`}
                            >
                              {message.status === "read"
                                ? "✓✓"
                                : message.status === "delivered"
                                  ? "✓✓"
                                  : message.status === "sent"
                                    ? "✓"
                                    : "⏳"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                />
                <Button onClick={handleSendMessage} size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
