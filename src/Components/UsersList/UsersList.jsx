
import { useState } from "react";
import { useUsers } from "../../Hooks/useUsers.js";

export default function UsersList() {
   const { 
      usersQuery: { data: users, isPending, isError },
      addMutation,
      updateMutation,
      deleteMutation
   } = useUsers();

   const [deletingId, setDeletingId] = useState(null);
   const [updatingId, setUpdatingId] = useState(null);

   if (isPending) return <p>⏳Get DataGet Data Loading...</p>;
   if (isError) return <p>❌ Error!</p>;

   const handleAdd = () => {
      addMutation.mutate({
         name: "New User " + Date.now(),
         email: "new@user.com",
      });
   };

   const handleUpdate = (id) => {
      setUpdatingId(id);
      updateMutation.mutate(
         { id, updateUser: { name: "Zahraa Zein" } },
         { 
            onSuccess: () => console.log("نجح التحديث في الحالة دي فقط ✅"),
            onError: () => console.log("فشل التحديث ❌"),
            onSettled: () => setUpdatingId(null) ,
         }
      );
   };


   const handleDelete = (id) => {
      setDeletingId(id);
      deleteMutation.mutate(id, {
         onSettled: () => setDeletingId(null),
      });
   };

   return (
      <div>
         <h2>Users List</h2>

         <button className="btn btn-primary btn-sm mx-2" onClick={handleAdd}>
            {addMutation.isPending ? "Adding..." : "➕ Add User"}
         </button>

         <ul>
            {users?.map((user) => (
               <li key={user._id} style={{ marginBottom: "8px" }}>
                  {user.name} - {user.email}{" "}
                  
                  <button className="btn btn-success btn-sm mx-2"  onClick={() => handleUpdate(user._id)}>
                     {updatingId === user._id && updateMutation.isPending
                        ? "Updated Loading..."
                        : "✏️ Update"}
                  </button>

                  <button className="btn btn-danger btn-sm mx-2"  onClick={() => handleDelete(user._id)}>
                     {deletingId === user._id && deleteMutation.isPending
                        ? "Deleted Loading..."
                        : "❌ Delete"}
                  </button>
               </li>
            ))}
         </ul>

      </div>
   );
}
