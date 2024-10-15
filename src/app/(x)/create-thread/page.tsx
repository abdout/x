// File: app/thread/new/page.tsx

import { currentUser } from "@/lib/auth"; // Custom authentication
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/x/forms/PostThread";

async function Page() {
  const user = await currentUser(); // Use custom authentication to get the logged-in user
  if (!user) return redirect("/login"); // Redirect to login if user is not authenticated

  // Fetch additional user information (e.g., if they are onboarded)
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    return redirect("/onboarding"); // Redirect to onboarding if the user is not onboarded
  }

  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      {/* Render PostThread component with userId */}
      <PostThread userId={userInfo._id} />
    </>
  );
}

export default Page;
