import {Nav, NavLink} from "../components/Nav";
import { Toaster } from "sonner";


export const dynamic = 'force-dynamic'; // This will disable caching for this layout
export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <>
        <Nav>
            <NavLink href='/'>Home</NavLink>
            <NavLink href='/products'>Products</NavLink>
            <NavLink href='/orders'>My Orders</NavLink>
        </Nav>
        <div className="container my-6 mx-auto">
            <Toaster />
            {children}
        </div>
        </>

    )
}