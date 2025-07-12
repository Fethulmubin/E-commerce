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
    const event = stripe.webhooks.
    constructEvent(await req.text(),
 req.headers.get('stripe-signature') as string,
  process.env.STRIPE_WEBHOOK_SECRET as string)

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
        Orders: {create: {
            productId,
            pricePaidInCents
        }}
    }

   db.user.upsert({
    where: { email },
    create: userFields,
    update: userFields,
    select: {orders : {orderBy: {createdAt: 'desc'}, take: 1}}
})
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