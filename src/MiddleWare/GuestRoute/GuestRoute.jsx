
import { Navigate } from 'react-router-dom' ;
import Swal from 'sweetalert2' ;
import isTokenValid from '../../Utilities/checkToken.js' ;





   export default function GuestRoute({ children }) {
      const token = localStorage.getItem('token');

      //& ==== Token Not Exist - التحقق من وجود التوكن ==== :
      if (token && isTokenValid(token)) {
         return <Navigate to="/home" />;
      }else{
         if (token) {
            Swal.fire({
               icon: 'warning',
               title: 'انتهت صلاحية الجلسة',
               text: 'تم تسجيل خروجك تلقائيًا، الرجاء تسجيل الدخول مرة أخرى',
               confirmButtonText: 'حسناً',
            });
            localStorage.removeItem('token');
         }
         return children;
      }
   }







// ProtectedRoute.js

// ✅ التحقق من وجود التوكن
// ✅ التأكد من إن التوكن لسه ساري
// ✅ التحقق من الدور (role)
// ✅ رسائل تنبيه للمستخدم
// ✅ توجيه لصفحات مناسبة حسب الحالة


// خلي التوكن قصير المدة (مثلاً 1 ساعة).

// لو انتهى التوكن، اعمل refresh تلقائي باستخدام refresh token (أمان أكتر).

// استخدم HTTPS دايمًا عشان التوكن ميتسرقش.

// حفظ التوكن في httpOnly cookie هو الأأمن، بس محتاج شغل backend كمان.















































// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';
// import Swal from 'sweetalert2';

// /**
//  * Check if token is valid and not expired.
//  * @param {string} token 
//  * @returns {boolean}
//  */
// function isTokenValid(token) {
//   try {
//     const decoded = jwtDecode(token);
//     const now = Date.now() / 1000;
//     return decoded.exp > now;
//   } catch (err) {
//     return false;
//   }
// }

// /**
//  * Protected Route that checks authentication and optionally role.
//  * @param {ReactNode} children - The component to render
//  * @param {string} role - Optional role required (e.g., 'admin', 'user')
//  */
// export default function ProtectedRoute({ children, role = null }) {
//   const token = localStorage.getItem('token');

//   if (token && isTokenValid(token)) {
//     const decoded = jwtDecode(token);

//     // Check role if provided
//     if (role && decoded.role !== role) {
//       Swal.fire({
//         title: 'Unauthorized',
//         text: 'You do not have permission to access this page.',
//         icon: 'warning',
//         confirmButtonText: 'Back to Home'
//       });
//       return <Navigate to="/home" />;
//     }

//     return children;
//   } else {
//     Swal.fire({
//       title: 'Access Denied',
//       text: 'Please login to access this page.',
//       icon: 'error',
//       confirmButtonText: 'Login Now'
//     });
//     return <Navigate to="/" />;
//   }
// }




// <Route path="dashBoard" element={<ProtectedRoute role="admin"><DashBoard /></ProtectedRoute>} />
// <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
