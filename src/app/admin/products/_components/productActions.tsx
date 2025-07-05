"use client";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useTransition } from "react";
import { deleteProduct, toggleProductAvailability } from "../../_actions/products";

const [isPending, startTransition] = useTransition();
export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  
  return (
    <DropdownMenuItem
    disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase);
        })
      }
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({id, disabled}: {id:string, disabled: boolean}) {
    return <DropdownMenuItem
     disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteProduct(id);
        })
      }
    >
     Delete
    </DropdownMenuItem>

}
