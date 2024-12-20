"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import AuthButton from "./AuthButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ["dashboard", "transactions", "statistics", "categories"];

  return (
    <Navbar className="bg-transparent" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
        <NavbarBrand>
          <p className="font-bold text-white">ExpenseT</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 " justify="center">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            className="w-full capitalize"
            href={item === "dashboard" ? `/dashboard/${new Date().toISOString().split("T")[0]}` : `/${item}`}
            style={currentPath === item ? { color: "#006fee", fontWeight: "bold" } : undefined}
          >
            {item}
          </Link>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-black/10 text-white">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full capitalize"
              href={item === "dashboard" ? `/dashboard/${new Date().toISOString().split("T")[0]}` : `/${item}`}
              style={currentPath === item ? { color: "#006fee", fontWeight: "bold" } : undefined}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;
