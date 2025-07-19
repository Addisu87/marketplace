"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard } from "lucide-react"

interface PayoutFormProps {
  availableBalance: number
  onSuccess?: () => void
}

export function PayoutForm({ availableBalance, onSuccess }: PayoutFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payoutAmount = Number.parseFloat(amount)
    if (payoutAmount > availableBalance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate payout processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Withdrawal initiated",
        description: `Successfully initiated withdrawal of $${payoutAmount.toFixed(2)}.`,
      })
      setAmount("")
      onSuccess?.()
    } catch (err) {
      toast({
        title: "Withdrawal failed",
        description: "Unable to process your withdrawal request.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Withdraw Funds
        </CardTitle>
        <CardDescription>Available balance: ${availableBalance.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="1"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_account_1">Bank Account ****1234</SelectItem>
                <SelectItem value="paypal_1">PayPal - john@example.com</SelectItem>
                <SelectItem value="card_1">Visa ****5678</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading || !amount || !paymentMethod} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Withdraw Funds"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
