import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Topbar from "@/components/x/shared/Topbar";
import LeftSidebar from "@/components/x/shared/LeftSidebar";
import RightSidebar from "@/components/x/shared/RightSidebar";
import Bottombar from "@/components/x/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Topbar />

          <main className='flex flex-row'>
            <LeftSidebar />
            <section className='flex min-h-screen flex-1 flex-col items-center  px-6 pb-10 pt-28 max-md:pb-32 sm:px-10'>
              <div className='w-full max-w-4xl '>{children}</div>
            </section>
            {/* @ts-ignore */}
            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </SessionProvider>
  );
}