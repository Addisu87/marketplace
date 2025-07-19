const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshToken()
        // Retry the request
        return this.request(endpoint, options)
      }

      const data = await response.json()

      return {
        data,
        status: response.status,
        message: data.message,
      }
    } catch (error) {
      throw new Error(`API request failed: ${error}`)
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null

    if (!refreshToken) {
      this.clearToken()
      throw new Error("No refresh token available")
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        this.setToken(data.access)
        if (typeof window !== "undefined") {
          localStorage.setItem("refresh_token", data.refresh)
        }
      } else {
        this.clearToken()
        throw new Error("Token refresh failed")
      }
    } catch (error) {
      this.clearToken()
      throw error
    }
  }

  // Authentication
  async login(username: string, password: string) {
    const response = await this.request<{ access: string; refresh: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    if (response.status === 200) {
      this.setToken(response.data.access)
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.data.refresh)
      }
    }

    return response
  }

  async logout() {
    this.clearToken()
  }

  // Campaigns
  async getCampaigns(params?: Record<string, any>) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return this.request(`/campaigns/${queryString}`)
  }

  async getCampaign(id: number) {
    return this.request(`/campaigns/${id}/`)
  }

  async createCampaign(data: any) {
    return this.request("/campaigns/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCampaign(id: number, data: any) {
    return this.request(`/campaigns/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async getCampaignStats() {
    return this.request("/campaigns/stats/")
  }

  // Messages
  async getConversations() {
    return this.request("/conversations/")
  }

  async getMessages(conversationId: number) {
    return this.request(`/conversations/${conversationId}/messages/`)
  }

  async sendMessage(conversationId: number, content: string, messageType = "text") {
    return this.request(`/conversations/${conversationId}/send_message/`, {
      method: "POST",
      body: JSON.stringify({
        content,
        message_type: messageType,
      }),
    })
  }

  async markAsRead(conversationId: number) {
    return this.request(`/conversations/${conversationId}/mark_as_read/`, {
      method: "POST",
    })
  }

  // Wallet
  async getWalletBalance() {
    return this.request("/wallet/balance/")
  }

  async addFunds(amount: number) {
    return this.request("/wallet/add_funds/", {
      method: "POST",
      body: JSON.stringify({ amount }),
    })
  }

  async withdrawFunds(amount: number, paymentMethodId: number) {
    return this.request("/wallet/withdraw_funds/", {
      method: "POST",
      body: JSON.stringify({
        amount,
        payment_method_id: paymentMethodId,
      }),
    })
  }

  async getTransactions(params?: Record<string, any>) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return this.request(`/transactions/${queryString}`)
  }

  async getPaymentMethods() {
    return this.request("/payment-methods/")
  }

  async addPaymentMethod(data: any) {
    return this.request("/payment-methods/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
