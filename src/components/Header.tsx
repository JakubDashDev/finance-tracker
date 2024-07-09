import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import AuthButton from "./AuthButton";

function Header() {
  return (
    <Navbar className="bg-transparent">
      <NavbarBrand>
        <p className="font-bold text-white">ExpenseT</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default Header;
