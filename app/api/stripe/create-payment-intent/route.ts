import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Parse & validate body
    // ─────────────────────────────────────────────────────────────────────────────
    const { amount, currency = "usd", metadata = {} } = await req.json()

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe secret key not configured." }, { status: 500 })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount. Must be a positive number." }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. Create the PaymentIntent
    // ─────────────────────────────────────────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert dollars → cents
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err: any) {
    // ─────────────────────────────────────────────────────────────────────────────
    // 3.  Surface useful information instead of a generic “Unknown error”
    // ─────────────────────────────────────────────────────────────────────────────
    console.error("Stripe PaymentIntent error:", err)

    const message =
      err?.type === "StripeInvalidRequestError"
        ? err.message // e.g. “Invalid currency”
        : "Unable to create payment intent"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
