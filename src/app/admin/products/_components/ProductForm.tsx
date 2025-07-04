"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { error } from "console";
import { useActionState } from "react";
import { addProduct } from "../../_actions/products";
import { redirect } from "next/navigation";

const ProductForm = () => {
  const initialState = { success: false, errors: {} as Record<string, string> };
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const result = await addProduct(formData);

     if (result && typeof result === "object" && !("success" in result)) {
      return {
        success: false,
        // Flatten Zod field errors (e.g. { name: ["Required"] } → { name: "Required" })
        errors: Object.fromEntries(
          Object.entries(result).map(([key, value]) => [key, value?.[0] ?? "Invalid"])
        ),
      };
    }
   
    return { success: true, errors: {} };

    } catch (error: any) {
      console.error("Error adding product:", error);
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleFormSubmit,
    initialState
  );
  return (
    <form action={formAction} className="space-y-4" encType="multipart/form-data">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">PriceInCents</Label>
        <Input type="text" name="priceInCents" id="priceInCents" required />
      </div>
      <div className="text-muted-foreground">
        {/* {formatCurrency(priceInCents || 0) / 100} */}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" name="file" id="file" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" name="image" id="image" required />
      </div>

      <Button className="mt-2" type="submit">
        {isPending ? 'Saving...': 'Save'}
      </Button>
    </form>
  );
};

export default ProductForm;
