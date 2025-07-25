import {Nav, NavLink} from "../components/Nav";
import { Toaster } from "sonner";


export const dynamic = 'force-dynamic'; // This will disable caching for this layout
export default function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <>
        <Nav>
            <NavLink href='/admin'>Dashboard</NavLink>
            <NavLink href='/admin/products'>Products</NavLink>
            <NavLink href='/admin/users'>Customers</NavLink>
            <NavLink href='/admin/orders'>Sales</NavLink>
        </Nav>
        <div className="container my-6 mx-auto">
            <Toaster />
            {children}
        </div>
        </>

    )
}