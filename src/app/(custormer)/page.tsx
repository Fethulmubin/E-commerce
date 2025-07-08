import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { Suspense } from "react";
import { wait } from "@/lib/utils";

const getNewestProducts = async () => {
  return await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
  });
};
const getPopularProducts = async () => {
    await wait(2000)
  return await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
};

export default function Home() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productFetcher={getPopularProducts}
      />
      <ProductGridSection
        title="Newest Products"
        productFetcher={getNewestProducts}
      />
    </main>
  );
}

type ProductGridSelectionProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};

const ProductGridSection = ({
  productFetcher,
  title,
}: ProductGridSelectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={<ProductCardSkeleton />}>
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </div>
  );
};
type ProductSuspenseProps = {
  productFetcher: () => Promise<Product[]>;
};

const ProductSuspense = async ({ productFetcher }: ProductSuspenseProps) => {
  return (await productFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
};
