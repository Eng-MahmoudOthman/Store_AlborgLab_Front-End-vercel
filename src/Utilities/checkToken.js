

import {jwtDecode} from "jwt-decode";



export default function  isTokenValid (token) {
   if (!token) return false;

   try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000 ; // بالثواني

      return decoded.exp > currentTime; // لو لسه صالح
   } catch (err) {
      return false; // لو في مشكلة في التوكن أصلاً
   }
};



