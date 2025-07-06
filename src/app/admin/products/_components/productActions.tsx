"use client";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useTransition } from "react";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_actions/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleProductAvailability(
            id,
            !isAvailableForPurchase
          );
          if (result.status === "SUCCESS") {
            toast.success("Successfully updated product availability!");
            router.refresh(); // Refresh the page to reflect changes
          } else if (result.status === "ERROR") {
            toast.error(`Error updating product availability: ${result.error}`);
          }
        })
      }
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteProduct(id);
          if (result.status === "SUCCESS") {
            toast.success("Product deleted successfully!");
            router.refresh(); // Refresh the page to reflect changes
          } else if (result.status === "ERROR") {
            toast.error(`Error deleting product: ${result.error}`);
          }
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
