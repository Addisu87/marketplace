export interface Notification {
  id: string
  type: "payment" | "message" | "campaign" | "system" | "video_request"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

export class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()

    // Show browser notification if permission granted
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      })
    }
  }

  getNotifications(): Notification[] {
    return this.notifications
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.notifyListeners()
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.notifyListeners()
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.notifications))
  }

  // Request browser notification permission
  async requestPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
    return false
  }
}

export const notificationService = NotificationService.getInstance()
