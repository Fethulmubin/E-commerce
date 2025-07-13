"use client";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteOrder } from "../../_actions/order";
// import { deleteOrder } from "../_actions/deleteOrder";

export function DeleteDropdownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteOrder(id);

          if (result.status === "SUCCESS") {
            toast.success("Order deleted successfully!");
            router.refresh();
          } else {
            toast.error(`Error deleting order: ${result.error || "Unknown error"}`);
          }
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
