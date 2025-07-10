"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Product } from "@prisma/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { error } from "console";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
type CheckoutFormProps = {
  product: {
    name: string;
    imagePath: string;
    priceInCents: number;
    description : string;
    
  }
  clientSecret: string;
};
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutForm = ({ product, clientSecret }: CheckoutFormProps) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
                  ${product.priceInCents / 100}
                </p>
            </div>
        </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents}/>
      </Elements>
    </div>
  );
};

export default CheckoutForm;

function Form({priceInCents} : {priceInCents : number}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] =  useState<string>()

  const handleSubmit = async(e : FormEvent) =>{
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    stripe.confirmPayment({
      elements,
      confirmParams : {
        return_url : `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
      },
    }).then(({error}) => {
      if(error.type == 'card_error' ||  error.type == 'validation_error'){
        setError(error.message)
      }
      else{
        setError("Unknown error happened")
      }
    }).finally(()=> setIsLoading(false))

  }
  const stripe = useStripe();
  const elements = useElements();
  return <form onSubmit={handleSubmit}>
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        {error &&  <CardDescription className="text-destructive">{error}</CardDescription>}
      </CardHeader>
      <CardContent>
        <PaymentElement />
        <div className="mt-4"> <LinkAuthenticationElement/></div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size='lg' disabled={stripe == null || elements == null || isLoading}>
          {isLoading ? 'Purchasing...' : 'Purchase'} = {formatCurrency(priceInCents / 100)}
        </Button>
      </CardFooter>
    </Card>
    </form>
}
