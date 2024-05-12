import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="mb-8 text-3xl font-bold">
        Welcome to Auth
      </div>
      <div className="flex space-x-4">
        <Link href="/login">
          <button className="w-20 h-10 px-4 py-2 bg-black text-white ">Login</button>
        </Link>
        <Link href="/join">
          <button className="w-20 h-10 border border-black">Join</button>
        </Link>
      </div>
    </div>
  );
}