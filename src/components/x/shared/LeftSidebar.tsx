// File: components/LeftSidebar/LeftSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/components/auth/hooks/use-current-user";
import { Icon } from "@iconify/react";
import { sidebarLinks } from "./costant";

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 pb-5  max-md:hidden">
      <div className="w-20 h-20 items-center justify-center">
        {/* <UserButton /> */}
      </div>

      <div className="flex w-full flex-1 flex-col gap-2 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          // Use a local variable to avoid mutating the original link object
          const linkRoute =
            link.route === "/profile" && user
              ? `${link.route}/${user.id}`
              : link.route;

          return (
            <Link
              href={linkRoute}
              key={link.label}
              className={`relative flex items-center gap-2 rounded-lg p-4  transition-opacity duration-200 ${isActive
                  ? "opacity-100"
                  : "opacity-65 hover:opacity-100 focus:opacity-100"
                }`}
            >
              <Icon icon={link.icon} width={24} height={24} color="black" />
              <p className="font-medium max-lg:hidden">{link.label}</p>
            </Link>

          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
