import ProductCard, { ProductCardSkeleton } from '@/app/components/ProductCard'
import db from '@/db/db'
import React, { Suspense } from 'react'

export const revalidate = 60 * 60 * 6 // 6 hours

const getProducts = async () => {
    return await db.product.findMany({
        where: { isAvailableForPurchase: true },
    })
}

const ProductsPage = () => {
  return (
     <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense fallback={<ProductCardSkeleton />}>
              <ProductSuspense />
            </Suspense>
          </div>
  )
}

export default ProductsPage

async function ProductSuspense() {
    const products = await getProducts()
    return products.map((product) => (
        <ProductCard key={product.id} {...product} />
    ))
}