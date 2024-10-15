"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import ThreadsTab from "@/components/x/shared/ThreadsTab";
import ProfileHeader from "@/components/x/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser } from "@/lib/actions/user.actions";
import { profileTabs } from "@/components/x";

function Page({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSession() {
      const session = await getSession();
      if (!session?.user) {
        router.push("/login");
      } else {
        setUser(session.user);
        const fetchedUserInfo = await fetchUser(params.id);
        if (!fetchedUserInfo?.onboarded) {
          router.push("/onboarding");
        } else {
          setUserInfo(fetchedUserInfo);
        }
      }
    }
    loadSession();
  }, [params.id, router]);

  if (!user || !userInfo) return null;

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username || ""}
        imgUrl={userInfo.image || ""}
        bio={userInfo.bio || ""}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
