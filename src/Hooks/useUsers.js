import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, addUser, updateUser, deleteUser } from "../Api/reactQuery/usersApi.js";






export function useUsers() {
   const queryClient = useQueryClient();

   // 🟢 جلب المستخدمين
   const usersQuery = useQuery({
      queryKey: ["users"],
      queryFn: getUsers,
      // staleTime: 1000 * 60 * 5, // الكاش صالح 5 دقائق
   });

   // 🔵 إضافة مستخدم
   const addMutation = useMutation({
      mutationFn: addUser,
      onSuccess: (newUser) => {
         queryClient.setQueryData(["users"], (old = []) => [...old, newUser]);
         // لو عايز تعمل Fetch جديد بدل الكاش: 
         // queryClient.invalidateQueries(["users"]);
      },
   });

   // 🟠 تعديل مستخدم
   const updateMutation = useMutation({
      mutationFn: updateUser,
      onSuccess: (updatedUser) => {
         queryClient.setQueryData(["users"], (old = []) =>
            old?.map((u) => (u._id?.toString() === updatedUser?._id?.toString() ? updatedUser : u))
         );
         // لو حبيت تأكد البيانات من السيرفر: 
         // queryClient.invalidateQueries(["users"]);
      },
   });

   // 🔴 حذف مستخدم
   const deleteMutation = useMutation({
      mutationFn: deleteUser,
      onSuccess: (deletedId) => {
         queryClient.setQueryData(["users"], (old = []) =>
         old.filter((u) => u._id !== deletedId)
         );
         // لو محتاج تأكد البيانات من السيرفر:
         // queryClient.invalidateQueries(["users"]);
      },
   });

   return { usersQuery, addMutation, updateMutation, deleteMutation };
} ;
