"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className=" flex justify-center items-center px-4 py-7 ">
        <div className="flex gap-x-4">
          <Button
            asChild
            variant={pathname === "/server" ? "default" : "outline"}
          >
            <Link href="/server">
              Server
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/client" ? "default" : "outline"}
          >
            <Link href="/client">
              Client
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">
              Admin
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/settings" ? "default" : "outline"}
          >
            <Link href="/settings">
              Settings
            </Link>
          </Button>
        </div>

      </nav>
      <div className="absolute top-7 right-10">
        <UserButton />
      </div>
    </>
  );
};
