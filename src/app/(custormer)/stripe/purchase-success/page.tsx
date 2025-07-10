import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'
import Stripe from 'stripe';

const PurchaseSuccess = async({searchParams} : {searchParams : Promise<{payment_intent : string}>}) => {
    const {payment_intent} = (await searchParams)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

    if(paymentIntent.metadata.productId == null) return notFound()

    //getting product by product id
    const product = await db.product.findUnique({
        where: {id: paymentIntent.metadata.productId}
    })

    if(product == null) return notFound()
    
    const isSuccess = paymentIntent.status === 'succeeded'
  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <h1 className='text-4xl'>{isSuccess ? 'Success' : "Error"}</h1>
        <div className="flex gap-4 items-center">
            <div className="aspect-video flex-shrink-0 relative w-1/3 ">
                <Image src={product.imagePath}
                 alt={product.name}
                 fill
                 className="object-cover rounded-lg"
                 />
            </div>
            <div className="text-lg">
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <p className="text-gray-600 line-clamp-3">{product.description}</p>
                <p className="text-xl font-bold">
                  {formatCurrency(product.priceInCents / 100)}
                </p>
            </div>
        </div>
        <Button className='mt-4' size='lg' asChild>
            {isSuccess ? <a></a> : <Link href={`/products/${product.id}/purchase`}>Try Again</Link>}
        </Button>
    </div>
  );
};

export default PurchaseSuccess