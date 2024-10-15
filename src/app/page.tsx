import { currentUser } from "@/lib/auth"; // Use custom auth
import { redirect } from "next/navigation";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import ThreadCard from "@/components/x/cards/ThreadCard";
import Pagination from "@/components/x/shared/Pagination";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser(); // Use custom auth
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;
