import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { Product } from "@prisma/client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import ProductCard from "../components/ProductCard"
import { Suspense } from "react"

const getNewestProducts = async () => {
    return await db.product.findMany({
        where: { isAvailableForPurchase: true },    
        orderBy: { createdAt: 'desc' },
    })

}
const getPopularProducts = async () => {
    return await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: {orders : {_count: 'desc'}},
        take: 6,
    })
}
// console.log(await getPopularProducts())
export default function Home() {
    return (
    <main className="space-y-12">
        <ProductGridSection title="Most Popular" productFetcher = {getPopularProducts}/>
        <ProductGridSection title="Newest Products" productFetcher = {getNewestProducts}/>
    </main>
    )
}

type ProductGridSelectionProps = {
    title: string,
    productFetcher: () => Promise<Product[]>
}

const ProductGridSection = async({productFetcher, title} : ProductGridSelectionProps)=> {
    return(
    <div className="space-y-4">
        <div className="flex gap-4">
            <h2 className="text-3xl font-bold">{title}</h2>
            <Button variant='outline' asChild>
                <Link href="/products" className="space-x-2">
                    <span>View All</span>
                    <ArrowRight className="size-5"/>
                </Link>
            </Button>
        </div>
        <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {(await productFetcher()).map((product) => (
                
                <Suspense key={product.id} fallback={
                    <div className="h-80 w-full bg-gray-200 animate-pulse rounded-lg"></div>
                }>
                    <ProductCard
                    {...product}
                    />
                </Suspense>
            ))}
            
        </div>

    </div>
    )
}

