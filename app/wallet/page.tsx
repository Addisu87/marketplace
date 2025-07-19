"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wallet,
  Plus,
  Minus,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  method?: string
}

export default function WalletPage() {
  const [balance, setBalance] = useState(2450.75)
  const [loading, setLoading] = useState(false)
  const [addAmount, setAddAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading transactions
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "credit",
        amount: 500.0,
        description: "Campaign payment - Summer Launch",
        date: "2024-01-15",
        status: "completed",
        method: "Bank Transfer",
      },
      {
        id: "2",
        type: "debit",
        amount: 50.0,
        description: "Platform fee",
        date: "2024-01-14",
        status: "completed",
        method: "Auto-deduct",
      },
      {
        id: "3",
        type: "credit",
        amount: 1200.0,
        description: "Video production payment",
        date: "2024-01-12",
        status: "completed",
        method: "Stripe",
      },
      {
        id: "4",
        type: "debit",
        amount: 25.0,
        description: "Withdrawal fee",
        date: "2024-01-10",
        status: "completed",
        method: "Bank Transfer",
      },
      {
        id: "5",
        type: "credit",
        amount: 750.0,
        description: "Brand collaboration",
        date: "2024-01-08",
        status: "pending",
        method: "PayPal",
      },
    ]
    setTransactions(mockTransactions)
  }, [])

  const handleAddFunds = async () => {
    if (!addAmount || Number.parseFloat(addAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to add.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseFloat(addAmount)
      setBalance((prev) => prev + amount)

      // Add transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "credit",
        amount: amount,
        description: "Funds added to wallet",
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        method: "Credit Card",
      }
      setTransactions((prev) => [newTransaction, ...prev])

      setAddAmount("")
      toast({
        title: "Funds Added",
        description: `$${amount.toFixed(2)} has been added to your wallet.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(withdrawAmount)
    if (amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setBalance((prev) => prev - amount)

      // Add transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "debit",
        amount: amount,
        description: "Withdrawal to bank account",
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        method: "Bank Transfer",
      }
      setTransactions((prev) => [newTransaction, ...prev])

      setWithdrawAmount("")
      toast({
        title: "Withdrawal Initiated",
        description: `$${amount.toFixed(2)} withdrawal is being processed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true
    if (filter === "credit") return transaction.type === "credit"
    if (filter === "debit") return transaction.type === "debit"
    return transaction.status === filter
  })

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalIncome = transactions
    .filter((t) => t.type === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "debit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
            <p className="text-gray-600 mt-1">Manage your funds and track your transactions.</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="credit">Income Only</SelectItem>
                  <SelectItem value="debit">Expenses Only</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View all your wallet transactions and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.type === "credit" ? (
                              <ArrowUpRight className="w-4 h-4 text-green-600 mr-2" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4 text-red-600 mr-2" />
                            )}
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                            {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-funds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Funds
                </CardTitle>
                <CardDescription>Add money to your wallet using various payment methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="add-amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="add-amount"
                      type="number"
                      placeholder="0.00"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="pl-10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select defaultValue="credit-card">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Credit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddFunds}
                  disabled={loading || !addAmount}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? "Processing..." : "Add Funds"}
                </Button>

                <div className="text-sm text-gray-500">
                  <p>• Minimum amount: $10.00</p>
                  <p>• Processing fee: 2.9% + $0.30</p>
                  <p>• Funds will be available immediately</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Minus className="w-5 h-5 mr-2" />
                  Withdraw Funds
                </CardTitle>
                <CardDescription>Transfer money from your wallet to your bank account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Available Balance:</strong> ${balance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="pl-10"
                      min="0"
                      max={balance}
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Withdrawal Method</Label>
                  <Select defaultValue="bank-transfer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAmount}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {loading ? "Processing..." : "Withdraw Funds"}
                </Button>

                <div className="text-sm text-gray-500">
                  <p>• Minimum withdrawal: $25.00</p>
                  <p>• Processing time: 1-3 business days</p>
                  <p>• Withdrawal fee: $2.50 per transaction</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
