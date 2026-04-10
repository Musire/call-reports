import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

// Extend native Link props and add our custom isActive
interface NavLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  isActive: boolean;
  activeClassName?: string;
}

export default function Navlink ({ 
  href, 
  isActive, 
  activeClassName = "surface-2 rounded-full border-border border normal-space", 
  className = "", 
  children, 
  ...props 
}: NavLinkProps) {
  return (
    <Link 
      href={href} 
      {...props} 
      className={`${className} ${isActive ? activeClassName : ""}`.trim()}
    >
      {children}
    </Link>
  );
};
