"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductForm = () => {
  return (
    <form action='space-y-4'>
        <div className="space-y-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" required/>
        </div>

         <div className="space-y-4">
            <Label htmlFor="name">PriceInCents</Label>
            <Input type="text" id="name" required/>
        </div>

         <div className="space-y-4">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" required/>
        </div>
    </form>
  )
}

export default ProductForm