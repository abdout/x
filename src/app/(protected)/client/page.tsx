"use client";

import { useCurrentUser } from "@/components/auth/hooks/use-current-user";
import { UserInfo } from "@/components/auth/user-info";



const ClientPage = () => {
  const user = useCurrentUser();

  return ( 
    <UserInfo
      label="📱 Client component"
      user={user}
    />
   );
}
 
export default ClientPage;