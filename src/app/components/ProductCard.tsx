"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({id, name, priceInCents, description, imagePath}: Product) => {
  return (
    <Card className='flex overflow-hidden flex-col'>
        <div className='relative w-full h-auto aspect-video'>
            <Image src={imagePath} fill alt={name}/>
        </div>
        <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
        </CardHeader>
        <CardContent className='flex-grow'>
            <p className='line-clamp-4'>{description}</p>
        </CardContent>
        <CardFooter>
            <Button asChild size='lg' className='w-full'>
                <Link href={`/products/${id}/purchase`}>Purchase</Link>
            </Button>
        </CardFooter>
    </Card>
  )
}

export default ProductCard

export const ProductCardSkeleton = () => {
    return (
        <>
            {[...Array(6)].map((_, i) => (
                <Card key={i} className='flex overflow-hidden flex-col mb-4'>
                    <div className='relative w-full h-auto aspect-video bg-gray-200 animate-pulse rounded-lg'></div>
                    <CardHeader>
                        <CardTitle className='bg-gray-200 animate-pulse h-6 w-3/4'></CardTitle>
                        <CardDescription className='bg-gray-200 animate-pulse h-4 w-1/2'></CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                        <p className='line-clamp-4 bg-gray-200 animate-pulse h-16'></p>
                    </CardContent>
                    <CardFooter>
                        <Button size='lg' className='w-full bg-gray-200 animate-pulse h-10'></Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}