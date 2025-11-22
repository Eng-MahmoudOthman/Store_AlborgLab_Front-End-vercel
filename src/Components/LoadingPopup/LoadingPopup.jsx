import {useEffect} from "react";

export default function LoadingPopup({ show , onClose }) {

   useEffect(() => {
      if (show) {
         const timer = setTimeout(() => {
         onClose();
         }, 5000); // 5 ثواني
         return () => clearTimeout(timer);
      }
   }, [show, onClose]);

   if (!show) return null;

   return (
      <div className="position-fixed top-25 end-0 d-flex justify-content-center align-items-center"style={{ zIndex: 99999 }}>
         <div className="bg-white p-4 rounded shadow-lg text-center">
            <h5 className="fw-bold"> ...PDF  جاري تجهيز ملف الـ 🧪</h5>
            <p className="text-muted mb-0"> إنشاء التقرير قد يستغرق ثوانٍ قليلة الرجاء الانتظار</p>
         </div>
      </div>
   );
}
