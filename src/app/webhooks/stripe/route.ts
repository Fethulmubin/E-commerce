import Orders from "@/app/admin/orders/page";
import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { Order } from "@prisma/client";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest){

let event: Stripe.Event;

try {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
} catch (err) {
  console.error("Webhook signature verification failed:", err);
  return new NextResponse("Webhook error", { status: 400 });
}


  if(event.type === 'charge.succeeded'){
    const charge = event.data.object
    const {productId} = charge.metadata
    const {email} = charge.billing_details
    const pricePaidInCents = charge.amount

    const product = await db.product.findUnique({where:{ id: productId }});
    if(!product || !email) {
     return new NextResponse('Bad Request', {status: 400});
    }

    const userFields = {
        email, 
        orders: {create: {
            productId,
            pricePaidInCents
        }}
    }

const savedUser = await db.user.upsert({
  where: { email },
  create: userFields,
  update: userFields,
});

console.log("Saved User:", savedUser);

const downloadVerification = await db.downloadVerification.create({
    data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 ), // 24 hours
    }
})

await resend.emails.send({
    from :`Support <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: 'Your purchase was successful',
    react: `<h1>Thank you for your purchase!</h1>`
})
  }
  return new NextResponse()
}