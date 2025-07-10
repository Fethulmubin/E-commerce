import { Product } from '@prisma/client'
import React from 'react'
type CheckoutFormProps = {
    product : Product;
    clientSecret : string;
}

const CheckoutForm = ({product, clientSecret} : CheckoutFormProps) => {
  return (
    <div>CheckoutForm</div>
  )
}

export default CheckoutForm