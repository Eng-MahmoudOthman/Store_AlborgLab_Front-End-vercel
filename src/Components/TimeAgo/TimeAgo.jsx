import { Fragment, useEffect, useState } from 'react';

// تحويل الوقت من ميلي ثانية إلى السنوات، الشهور، الأيام، الساعات، الدقائق، والثواني
function convertToTime(time) {
   let year, month, day, hour, minute, second;

   second = Math.floor(time / 1000);
   minute = Math.floor(second / 60);
   second = second % 60;
   hour = Math.floor(minute / 60);
   minute = minute % 60;
   day = Math.floor(hour / 24);
   hour = hour % 24;
   month = Math.floor(day / 30);
   day = day % 30;
   year = Math.floor(month / 12);
   month = month % 12;

   return { year, month, day, hour, minute, second };
}

// تنسيق الوقت لعرضه بشكل مناسب
function formatTimeAgo(duration) {
   const units = [
      { label: 'سنة', value: duration.year },
      { label: 'شهر', value: duration.month },
      { label: 'يوم', value: duration.day },
      { label: 'ساعة', value: duration.hour },
      { label: 'دقيقة', value: duration.minute },
      { label: 'ثانية', value: duration.second },
   ];

   // فلترة الوحدات التي تحتوي على قيمة أكبر من 0 فقط
   const nonZero = units.filter(unit => unit.value > 0);

   if (nonZero.length === 0) return "منذ لحظات من الأن";  // إذا كانت كل القيم 0

   // عرض الوحدة الأولى فقط التي تحتوي على قيمة
   const show = `${nonZero[0].value} ${nonZero[0].label}`;
   return `منذ ${show}`;
}

export default function TimeAgo({ createdAt  , showTimeOnly , style}) {
   const [timeAgo, setTimeAgo] = useState('');

   // التحديث عند تحميل الصفحة أو تغيير createdAt
   useEffect(() => {
      const diff = Date.now() - new Date(createdAt).getTime();
      const duration = convertToTime(diff);
      setTimeAgo(formatTimeAgo(duration));
   }, [createdAt]);  // سيتم التحديث فقط عند تغيير "createdAt"

   return (
      <Fragment>
         {showTimeOnly?
            <div className="text-end">
               <span className="badge text-dark">
                  {timeAgo}
               </span>
            </div>
            :
            <div className="my-1">
               <span>
                  Created Ago:
                  <i className="fa-solid fa-clock-rotate-left mx-1"></i>
                  <span className="badge bg-light text-dark  p-2">
                     {timeAgo}
                  </span>
               </span>
            </div>
         }
      </Fragment>

   );
}





















// import React, { useEffect, useState } from 'react';

// function convertToTime(time) {
//    let year, month, day, hour, minute, second;

//    second = Math.floor(time / 1000);
//    minute = Math.floor(second / 60);
//    second = second % 60;
//    hour = Math.floor(minute / 60);
//    minute = minute % 60;
//    day = Math.floor(hour / 24);
//    hour = hour % 24;
//    month = Math.floor(day / 30);
//    day = day % 30;
//    year = Math.floor(month / 12);
//    month = month % 12;

//    return { year, month, day, hour, minute, second };
// }

// function formatTimeAgo(duration) {
//    const parts = [
//       { label: 'year', value: duration.year },
//       { label: 'month', value: duration.month },
//       { label: 'day', value: duration.day },
//       { label: 'hour', value: duration.hour },
//       { label: 'minute', value: duration.minute },
//       { label: 'second', value: duration.second },
//    ];

//    const nonZero = parts.filter(p => p.value > 0);

//    if (nonZero.length === 0) return "0 seconds";

//    const lastTwo = nonZero.slice(-2);
//    return lastTwo.map(p => `${p.value} ${p.label}${p.value > 1 ? 's' : ''}`).join(" : ");
// }

// export default function TimeAgo({ createdAt }) {
//    const [timeAgo, setTimeAgo] = useState(() => {
//       const diff = Date.now() - new Date(createdAt).getTime();
//       return formatTimeAgo(convertToTime(diff));
//    });

//    useEffect(() => {
//       const interval = setInterval(() => {
//          const diff = Date.now() - new Date(createdAt).getTime();
//          setTimeAgo(formatTimeAgo(convertToTime(diff)));
//       }, 10000); // كل 10 ثواني

//       return () => clearInterval(interval); // Cleanup
//    }, [createdAt]);

//    return (
//       <span className="alert alert-secondary text-danger mx-2">
//          {timeAgo}
//       </span>
//    );
// }

























// import React from 'react';

// function convertToTime(time) {
//    let year, month, day, hour, minute, second;

//    second = Math.floor(time / 1000);
//    minute = Math.floor(second / 60);
//    second = second % 60;
//    hour = Math.floor(minute / 60);
//    minute = minute % 60;
//    day = Math.floor(hour / 24);
//    hour = hour % 24;
//    month = Math.floor(day / 30);
//    day = day % 30;
//    year = Math.floor(month / 12);
//    month = month % 12;

//    return { year, month, day, hour, minute, second };
// }

// function formatTimeAgo(duration) {
//    const parts = [
//       { label: 'year', value: duration.year },
//       { label: 'month', value: duration.month },
//       { label: 'day', value: duration.day },
//       { label: 'hour', value: duration.hour },
//       { label: 'minute', value: duration.minute },
//       { label: 'second', value: duration.second },
//    ];

//    const nonZero = parts.filter(p => p.value > 0);

//    if (nonZero.length === 0) return "0 seconds";

//    const lastTwo = nonZero.slice(-2);
//    return lastTwo.map(p => `${p.value} ${p.label}${p.value > 1 ? 's' : ''}`).join(" : ");
// }

// export default function TimeAgo({ createdAt }) {
//    const diff = Date.now() - new Date(createdAt).getTime();
//    const duration = convertToTime(diff);

//    return (
//       <span className="alert alert-secondary text-danger mx-2">
//          {formatTimeAgo(duration)}
//       </span>
//    );
// }
