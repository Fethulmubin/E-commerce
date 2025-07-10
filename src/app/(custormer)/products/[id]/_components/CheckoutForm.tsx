"use client";
import { Product } from '@prisma/client'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
type CheckoutFormProps = {
    product : Product;
    clientSecret : string;
}
const stripePromise =  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutForm = ({product, clientSecret} : CheckoutFormProps) => {
    console.log("client secret", clientSecret)
    console.log("stripekey", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  return (
   <Elements options={{clientSecret}} stripe={stripePromise}>
        <Form/>
   </Elements>
  )
}

export default CheckoutForm

function Form ( ){
    const stripe = useStripe();
    const elements = useElements()
    return <form className='min-h-[500px]'><PaymentElement/></form>
}