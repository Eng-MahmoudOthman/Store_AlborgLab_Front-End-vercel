
import React from 'react' ;
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {jwtDecode} from "jwt-decode";
import isTokenValid from '../../Utilities/checkToken.js';



   export default function ProtectedRoute({ children , allowedRoles = [] }) {
      const token = localStorage.getItem('token');

      //& ==== Token Not Exist - التحقق من وجود التوكن ==== :
      if (!token) {
         Swal.fire({
            title: 'Unauthorized',
            text: 'Please log in first.',
            icon: 'error',
         });
         return <Navigate to="/" />;
      }

      //& ==== Check Token Expired Time - التأكد من ان التوكين لسة سارى  :
      try {
         const decoded = jwtDecode(token);
         
         if (token && !isTokenValid(token)) {
            localStorage.removeItem('token');
            Swal.fire({
               title: 'Session Expired',
               text: 'Expired token removed from localStorage. Please log in again.',
               icon: 'warning',
            });
            return <Navigate to="/" />;
         }

      //& ==== Check Token User Role  ==== :
         if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
            Swal.fire({
            title: 'Access Denied',
            text: 'You are not authorized to view this page.',
            icon: 'error',
            });
            return <Navigate to="/" />;
         }

         return children;


      //& ==== Check Invalid Token ==== :
      } catch (error) {
         localStorage.removeItem('token');
         Swal.fire({
            title: 'Invalid Token',
            text: 'Something went wrong. Please log in again.',
            icon: 'error',
         });
         return <Navigate to="/" />;
      }
   }






// خلي التوكن قصير المدة (مثلاً 1 ساعة).

// لو انتهى التوكن، اعمل refresh تلقائي باستخدام refresh token (أمان أكتر).

// استخدم HTTPS دايمًا عشان التوكن ميتسرقش.

// حفظ التوكن في httpOnly cookie هو الأأمن، بس محتاج شغل backend كمان.
