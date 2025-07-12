import db from "@/db/db";
import React from "react";
import PageHeader from "../_components/PageHeader";
import { MoreVertical, Table } from "lucide-react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DeleteDropdownItem } from "./_components/UserActions";
// import { DeleteDropdownItem } from "../products/_components/productActions";

async function getUsers() {
  return await db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

const UserPage = () => {
  return (
    <>
      <PageHeader>Customers</PageHeader>
    </>
  );
};

export default UserPage;

async function UserTable() {
  const users = await getUsers();
  if (users.length === 0) {
    return <p className="text-center">No users found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                user.orders.reduce(
                  (sum, order) => order.pricePaidInCents + sum,
                  0
                ) / 100
              )}
            </TableCell>
             <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical/>
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DeleteDropdownItem id={user.id}/>
                  </DropdownMenuContent>
                </DropdownMenu>
             </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
