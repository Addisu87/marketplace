import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "usd", destination } = await req.json()

    // Create a transfer to the connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency,
      destination,
    })

    return NextResponse.json({
      transferId: transfer.id,
      status: transfer.object,
    })
  } catch (error) {
    console.error("Error creating payout:", error)
    return NextResponse.json({ error: "Failed to create payout" }, { status: 500 })
  }
}
