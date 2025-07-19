"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

export function useApi<T>(
  endpoint: string,
  options?: {
    params?: Record<string, any>
    dependencies?: any[]
    enabled?: boolean
  },
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { params, dependencies = [], enabled = true } = options || {}

  useEffect(() => {
    if (!enabled) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.request(endpoint, {
          method: "GET",
        })

        if (response.status === 200) {
          setData(response.data)
        } else {
          setError(response.message || "An error occurred")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, enabled, ...dependencies])

  const refetch = () => {
    if (enabled) {
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)

          const response = await apiClient.request(endpoint, {
            method: "GET",
          })

          if (response.status === 200) {
            setData(response.data)
          } else {
            setError(response.message || "An error occurred")
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }

  return { data, loading, error, refetch }
}

export function useCampaigns(params?: Record<string, any>) {
  return useApi("/campaigns/", { params })
}

export function useWalletBalance() {
  return useApi("/wallet/balance/")
}

export function useTransactions(params?: Record<string, any>) {
  return useApi("/transactions/", { params })
}

export function useConversations() {
  return useApi("/conversations/")
}
