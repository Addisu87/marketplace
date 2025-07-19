export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "video"
  metadata?: {
    fileName?: string
    fileSize?: number
    fileUrl?: string
  }
  status: "sending" | "sent" | "delivered" | "read"
}

export interface ChatConversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
    online: boolean
    lastSeen?: Date
  }[]
  lastMessage?: ChatMessage
  unreadCount: number
  type: "direct" | "group"
  title?: string
  createdAt: Date
  updatedAt: Date
}

export class ChatService {
  private static instance: ChatService
  private conversations: Map<string, ChatConversation> = new Map()
  private messages: Map<string, ChatMessage[]> = new Map()
  private listeners: Map<string, ((messages: ChatMessage[]) => void)[]> = new Map()
  private conversationListeners: ((conversations: ChatConversation[]) => void)[] = []
  private ws: WebSocket | null = null

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService()
    }
    return ChatService.instance
  }

  // Initialize WebSocket connection
  connect(userId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    // In a real app, this would connect to your WebSocket server
    // For demo purposes, we'll simulate real-time updates
    this.simulateRealTimeUpdates()
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // Get all conversations
  getConversations(): ChatConversation[] {
    return Array.from(this.conversations.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Get messages for a conversation
  getMessages(conversationId: string): ChatMessage[] {
    return this.messages.get(conversationId) || []
  }

  // Send a message
  async sendMessage(
    conversationId: string,
    content: string,
    senderId: string,
    senderName: string,
    type: ChatMessage["type"] = "text",
    metadata?: ChatMessage["metadata"],
  ): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId,
      senderId,
      senderName,
      content,
      timestamp: new Date(),
      type,
      metadata,
      status: "sending",
    }

    // Add message to local storage
    const messages = this.messages.get(conversationId) || []
    messages.push(message)
    this.messages.set(conversationId, messages)

    // Update conversation
    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.lastMessage = message
      conversation.updatedAt = new Date()
    }

    // Notify listeners
    this.notifyMessageListeners(conversationId)
    this.notifyConversationListeners()

    // Simulate sending to server
    setTimeout(() => {
      message.status = "sent"
      this.notifyMessageListeners(conversationId)
    }, 500)

    return message
  }

  // Mark messages as read
  markAsRead(conversationId: string, userId: string) {
    const messages = this.messages.get(conversationId) || []
    messages.forEach((message) => {
      if (message.senderId !== userId && message.status !== "read") {
        message.status = "read"
      }
    })

    const conversation = this.conversations.get(conversationId)
    if (conversation) {
      conversation.unreadCount = 0
    }

    this.notifyMessageListeners(conversationId)
    this.notifyConversationListeners()
  }

  // Subscribe to message updates
  subscribeToMessages(conversationId: string, listener: (messages: ChatMessage[]) => void) {
    const listeners = this.listeners.get(conversationId) || []
    listeners.push(listener)
    this.listeners.set(conversationId, listeners)

    return () => {
      const updatedListeners = this.listeners.get(conversationId)?.filter((l) => l !== listener) || []
      this.listeners.set(conversationId, updatedListeners)
    }
  }

  // Subscribe to conversation updates
  subscribeToConversations(listener: (conversations: ChatConversation[]) => void) {
    this.conversationListeners.push(listener)
    return () => {
      this.conversationListeners = this.conversationListeners.filter((l) => l !== listener)
    }
  }

  private notifyMessageListeners(conversationId: string) {
    const listeners = this.listeners.get(conversationId) || []
    const messages = this.messages.get(conversationId) || []
    listeners.forEach((listener) => listener(messages))
  }

  private notifyConversationListeners() {
    const conversations = this.getConversations()
    this.conversationListeners.forEach((listener) => listener(conversations))
  }

  // Simulate real-time updates for demo
  private simulateRealTimeUpdates() {
    // Initialize with sample data
    this.initializeSampleData()

    // Simulate incoming messages
    setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 10 seconds
        this.simulateIncomingMessage()
      }
    }, 10000)
  }

  private initializeSampleData() {
    const sampleConversations: ChatConversation[] = [
      {
        id: "1",
        participants: [
          { id: "1", name: "John Smith", avatar: "/placeholder.svg?height=40&width=40", online: true },
          { id: "current", name: "You", online: true },
        ],
        unreadCount: 2,
        type: "direct",
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 120000),
      },
      {
        id: "2",
        participants: [
          {
            id: "2",
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            online: false,
            lastSeen: new Date(Date.now() - 3600000),
          },
          { id: "current", name: "You", online: true },
        ],
        unreadCount: 0,
        type: "direct",
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 3600000),
      },
    ]

    sampleConversations.forEach((conv) => this.conversations.set(conv.id, conv))

    // Sample messages
    const sampleMessages: ChatMessage[] = [
      {
        id: "1",
        conversationId: "1",
        senderId: "1",
        senderName: "John Smith",
        content: "Hi! I wanted to discuss the video project we talked about earlier.",
        timestamp: new Date(Date.now() - 7200000),
        type: "text",
        status: "read",
      },
      {
        id: "2",
        conversationId: "1",
        senderId: "current",
        senderName: "You",
        content: "Of course! I'd be happy to help. What specific type of video are you looking for?",
        timestamp: new Date(Date.now() - 7080000),
        type: "text",
        status: "read",
      },
      {
        id: "3",
        conversationId: "1",
        senderId: "1",
        senderName: "John Smith",
        content: "Thanks for the quick turnaround on the video!",
        timestamp: new Date(Date.now() - 120000),
        type: "text",
        status: "delivered",
      },
    ]

    this.messages.set(
      "1",
      sampleMessages.filter((m) => m.conversationId === "1"),
    )
    this.messages.set(
      "2",
      sampleMessages.filter((m) => m.conversationId === "2"),
    )
  }

  private simulateIncomingMessage() {
    const conversationIds = Array.from(this.conversations.keys())
    const randomConversationId = conversationIds[Math.floor(Math.random() * conversationIds.length)]
    const conversation = this.conversations.get(randomConversationId)

    if (conversation) {
      const sender = conversation.participants.find((p) => p.id !== "current")
      if (sender) {
        const messages = [
          "How's the project coming along?",
          "Can we schedule a call?",
          "I have some feedback on the latest version.",
          "The client loved the video!",
          "When can we expect the final deliverable?",
        ]

        const randomMessage = messages[Math.floor(Math.random() * messages.length)]

        this.sendMessage(randomConversationId, randomMessage, sender.id, sender.name)

        conversation.unreadCount++
      }
    }
  }
}

export const chatService = ChatService.getInstance()
