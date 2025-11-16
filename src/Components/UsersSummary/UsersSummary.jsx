import { useQueryClient } from "@tanstack/react-query" ;



export default function UsersSummary() {
   const queryClient = useQueryClient();
   const cachedUsers = queryClient.getQueryData(["users"]) ;

   return (
      <div>
         <h2>Users Summary</h2>
         <p>Number of users in cache: {cachedUsers?.length || 0}</p>
      </div>
   );
}
