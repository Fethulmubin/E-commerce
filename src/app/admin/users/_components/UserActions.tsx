"use client";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteDropdownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteUser(id);
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
