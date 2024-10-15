"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  id?: string;
  name?: string;
  username?: string;
  imgUrl?: string | null; // Handle possible null values
  personType?: string;
}

function UserCard({ id, name, username, imgUrl, personType }: Props) {
  const router = useRouter();
  const isCommunity = personType === "Community";

  // Handle view profile logic based on the personType
  const handleViewProfile = () => {
    const path = isCommunity ? `/communities/${id}` : `/profile/${id}`;
    router.push(path);
  };

  // Fallback image if imgUrl is invalid
  const validImageUrl = imgUrl && (imgUrl.startsWith("http") || imgUrl.startsWith("/"))
    ? imgUrl
    : "/img/avatar.png"; // Fallback image path

  return (
    <article className="flex flex-col justify-between gap-4 max-xs:rounded-xl max-xs:bg-dark-3 max-xs:p-4 xs:flex-row xs:items-center">
      <div className="flex flex-1 items-start justify-start gap-3 xs:items-center">
        <div className="relative h-12 w-12">
          <Image
            src={validImageUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button
        className="h-auto min-w-[74px] rounded-lg bg-primary-500 text-[12px] text-light-1"
        onClick={handleViewProfile}
      >
        View
      </Button>
    </article>
  );
}

export default UserCard;
