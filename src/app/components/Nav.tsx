"use client"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentProps, ReactNode } from "react";

export const Nav = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4">
      {children}
    </nav>
  );
};

export const NavLink = (
  props: Omit<ComponentProps<typeof Link>, "className">
) => {
  const path = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground  ",
        path === props.href && "bg-background text-foreground"
      )}
      
    />
    
  );
};
