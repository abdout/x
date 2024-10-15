'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/x/forms/AccountProfile";

// Define the type for userData
type UserData = {
  id: string;
  objectId?: string;
  username: string;
  name: string;
  bio: string;
  image: string;
} | null;

function Page() {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>(null); // User state

  useEffect(() => {
    async function getUserData() {
      if (session?.user) {
        const userInfo = await fetchUser(session.user.id);

        // If the user is already onboarded, redirect them to the home page.
        if (userInfo?.onboarded) {
          router.replace("/on");
        } else {
          // Otherwise, set user data for the form
          setUserData({
            id: session.user.id,
            objectId: userInfo?._id,
            username: userInfo?.username || session.user.name || "",
            name: userInfo?.name || session.user.name || "",
            bio: userInfo?.bio || "",
            image: userInfo?.image || session.user.image || "",
          });
        }
      } else if (status === "unauthenticated") {
        // Redirect unauthenticated users to the login page
        router.replace("/login");
      }
    }
    getUserData();
  }, [session, status, router]);

  // Render a loading state while session or userData are loading
  if (status === "loading" || !userData) {
    return <p>Loading...</p>;
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
