"use server"
import { z } from "zod";
import db from "@/db/db";
import { error } from "console";
import { Resend } from "resend";
import React from "react";
import OrderHistory from "@/email/OrderHistory";

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY);

export async function emailOrderHistory(prevState: unknown,
    formData: FormData) : Promise<{message?: string; error?: string}> {

        const result = emailSchema.safeParse(formData.get("email"));
        if(result.success === false) {
            return { error: "Invalid email format"};
        }
        //getting user from db with al of its orders and products
        const user = await db.user.findUnique({
            where: { email: result.data },
            select: {
                email: true,
                orders: {
                    select: {
                        pricePaidInCents: true,
                        id: true,
                        createdAt: true,
                        products : {
                            select :{
                                id: true,
                                name: true,
                                imagePath: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
        if(!user) {
            return { message: "Check your email to download your products" };
        }

     const orders = await Promise.all(
    user.orders.map(async (order) => {
      const verification = await db.downloadVerification.create({
        data: {
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 h
          productId: order.products.id,
        },
      });

      // Shape the object exactly the way <OrderHistory /> expects
      return {
        id: order.id,
        pricePaidInCents: order.pricePaidInCents,
        createdAt: order.createdAt,
        downloadVerificationId: verification.id,
        product: order.products,            // rename so it’s singular
      };
    })
  );

        const data = await resend.emails.send({
            from: `Support <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Your Order History",
            react: React.createElement(
                OrderHistory, 
                {orders}
            )
        })

        if(data.error){
            return { error: "Failed to send email" };
        }

        return { message: "Check your email to download your products" };
}
