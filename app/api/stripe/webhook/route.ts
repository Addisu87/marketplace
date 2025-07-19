import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object
      console.log("Payment succeeded:", paymentIntent.id)
      // Update database with successful payment
      break
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object
      console.log("Payment failed:", failedPayment.id)
      // Handle failed payment
      break
    case "transfer.created":
      const transfer = event.data.object
      console.log("Transfer created:", transfer.id)
      // Update payout status
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
