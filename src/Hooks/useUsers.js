import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInfo , getUsers, addUser, updateUser, deleteUser } from "../Api/reactQuery/usersApi.js";






export function useUsers() {
   const queryClient = useQueryClient();

   // 🟢 جلب المستخدمين
   const usersQueryInfo = useQuery({
      queryKey: ["info"],
      queryFn: getInfo,
      refetchOnMount: false ,   // يطلب أحدث بيانات عند دخول الصفحة
      refetchOnWindowFocus: false, // ما يعيدش الفetch عند تغيير التبويبة
      staleTime: 10000, // 10 ثواني
      cacheTime: 1000 * 60 * 5,   // الداتا تفضل في الكاش 5 دقايق
   });
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

   return { usersQuery , usersQueryInfo  , addMutation, updateMutation, deleteMutation };
} ;







// تمام محمود، هاعملك جدول يوضح الفرق بين أهم خيارات تحديث البيانات في React Query:

// الخيار	القيم الممكنة	السلوك
// refetchOnMount	true / false / "always"	يتحكم إذا كانت البيانات هتتجدد عند دخول الـ component للصفحة:
// • true → لو البيانات قديمة، يعمل request.
// • false → يستخدم الكاش مهما كان.
// • "always" → يعمل request دائمًا حتى لو الكاش جديد.
// staleTime	أي وقت بالمللي ثانية	الوقت اللي تعتبر فيه البيانات fresh. خلال الوقت ده، React Query مش هتعمل refetch تلقائي. بعد انتهاء الوقت، البيانات تبقى stale، والـ query ممكن تعمل refetch عند الحاجة.
// refetchOnWindowFocus	true / false / "always"	يتحكم لو الصفحة رجعت تكون active بعد ما كانت في background:
// • true → يعمل request لو البيانات stale.
// • false → مش يعمل request.
// • "always" → يعمل request مهما كان عمر البيانات.
// refetchInterval	رقم بالمللي ثانية أو false	يعمل polling ويجدد البيانات كل المدة المحددة.
// cacheTime	رقم بالمللي ثانية	مدة الاحتفاظ بالبيانات في الكاش بعد ما ما يكون فيه active subscriber. بعد الوقت ده، البيانات تتحذف من الذاكرة.