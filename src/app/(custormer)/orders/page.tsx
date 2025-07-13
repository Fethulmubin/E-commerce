"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { emailOrderHistory } from '../actions/orders';

const MyOrders = () => {
    const [ data, action ] = useFormState(emailOrderHistory, {})
  return (
    <form action={action}>
        <Card>
            <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>
                    Enter your Email and we will send your order history and download links.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <Label htmlFor='email'>Email</Label>
                    <Input type='email' required name='email' id='email'/>
                    {data.error && <p className='text-red-500'>{data.error}</p>}
                </div>
            </CardContent>
            <CardFooter>
                {data.message ? <p>{data.message}</p>: <SubmitButton/> } 
            </CardFooter>
        </Card>
    </form>
  )
}

export default MyOrders

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className='w-full' size='lg' type='submit' disabled={pending}>
            {pending ? 'Sending...' : 'Send'}
        </Button>
    )
}