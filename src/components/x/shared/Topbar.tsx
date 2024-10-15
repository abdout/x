"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/components/auth/hooks/use-current-user";
import { UserButton } from "@/components/auth/user-button";

function Topbar() {
  const user = useCurrentUser();

  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between px-6 py-3">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/x/threads.png" alt="logo" width={25} height={25} />
        <p className="text-[16px] font-bold  max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          {user && (
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="flex cursor-pointer"
            >
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
            </button>
          )}
        </div>

        {user && <UserButton />}
      </div>
    </nav>
  );
}

export default Topbar;
