"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useActionState, useState } from "react";
// import { useToast } from "@/hooks/use-toast";
import { addProduct } from "../../_actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { set } from "zod/v4";

const ProductForm = () => {
  const router = useRouter();
  const [error, setError] = useState<Record<string, string>>({});
  const initialState = {
    error: "",
    status: "INITIAL",
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const result = await addProduct(formData);
      // If result contains field errors, set them

      if (result.status === "SUCCESS") {
        setError({});
        toast.success("Product added successfully!");

        router.push("/admin/products");
      }
      if (result.status ==="ERROR") {
        setError(result.errors); // Assuming result.errors is an object with field errors
      }

      return result;
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error("Unexpected error happened")
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleFormSubmit,
    initialState
  );
  return (
    <form
      action={formAction}
      className="space-y-4"
      encType="multipart/form-data"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
        {error.name && <p className="text-red-400 text-[14px]">❌{error.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">PriceInCents</Label>
        <Input type="text" name="priceInCents" id="priceInCents" required />
        {error.priceInCents && (
          <p className="text-red-400 text-[14px]">❌{error.priceInCents}</p>
        )}
      </div>
      <div className="text-muted-foreground">
        {/* {formatCurrency(priceInCents || 0) / 100} */}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" required />
        {error.description && (
          <p className="text-red-400 text-[14px]">❌{error.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" name="file" id="file" required />
          {error.file && (
          <p className="text-red-400 text-[14px]">❌{error.file}</p>)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" name="image" id="image" required />
        {error.image && (
          <p className="text-red-400 text-[14px]">❌{error.image}</p>
        )}
      </div>

      <Button className="mt-2" type="submit">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default ProductForm;
