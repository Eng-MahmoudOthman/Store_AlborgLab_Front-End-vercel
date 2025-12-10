
import { Fragment, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext.js';
import notification from '../../Utilities/notification.js';
import { OrderContext } from '../../Context/OrderContext.js';
import Loading from '../Loading/Loading.jsx';

export default function UploadOrderFile({orderId}) {

   const [file, setFile] = useState(null);
   const [error, setError] = useState('');
   const [loading , setLoading] = useState(false);
   const {userToken } = useContext(UserContext);
   const {getLoggedOrders} = useContext(OrderContext);

   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      
      // السماح فقط بـ PDF
      if (selectedFile.type !== "application/pdf") {
         setError("❌ لازم ترفع ملف PDF فقط");
         return;
      }

      // حجم الملف
      if (selectedFile.size > 5 * 1024 * 1024) {
         setError("❌ The file size is too large, only 5MB is allowed.");
         return;
      }

      setFile(selectedFile);
      setError('');
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!file) return setError('❌Choose the file first');

      const formData = new FormData();
      formData.append('file', file); 

      try {
         setLoading(true);

         const {data} = await axios.post(
         `${process.env.REACT_APP_BASE_URL}/api/v1/order/uploadFileOrder/${orderId}`, formData ,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
                  token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
               },
            }
         );

         if(data.message === "success"){
            notification("success" , "📄 Upload File Successfully.");
            setFile(null);
            setLoading(false);
            getLoggedOrders("");
         } else {
            notification("error" , '❌ حصل خطأ أثناء رفع الملف');
         }

      } catch (error) {
         setLoading(false);
         notification("error" , error?.response?.data?.message || "❌ حصل خطأ أثناء الرفع");
         setError('❌ حصل خطأ أثناء الرفع');
      }
   };

   return (
      <Fragment>
         <div className='container'>
            <form onSubmit={handleSubmit}>

               <input type="file" accept="application/pdf" onChange={handleFileChange} className='form-control'/>
               {error && <p className='alert alert-danger p-1 my-1'>{error}</p>}
               {file && (<p className="alert alert-info p-1 my-1"> 📄 تم اختيار الملف: {file.name}</p>)}

               {loading ? 
                  (
                     <button className="btn bg-main my-2 w-50 p-1">
                        <Loading type="oval" color="white" width={25} height={25} strokeWidth="6" />
                     </button>
                  ) : (
                     <button type="submit" className='btn bg-main my-2 w-50'>
                        رفع ملف PDF
                     </button>
                     )
               }

            </form>
         </div>
      </Fragment>
   );
};


































// import { Fragment, useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { UserContext } from '../../Context/UserContext.js';
// import notification from '../../Utilities/notification.js';
// import { OrderContext } from '../../Context/OrderContext.js';
// import Loading from '../Loading/Loading.jsx';

// export default function UploadOrderImage({orderId}) {
//    const [images, setImages] = useState([]);
//    const [error, setError] = useState('');
//    const [loading , setLoading] = useState(false);
//    const [previews, setPreviews] = useState([]);
//    const {userToken } = useContext(UserContext) ;
//    const {getLoggedOrders} = useContext(OrderContext) ;
   

//    const handleImageChange = (e) => {
//       const files = Array.from(e.target.files);
//       const validImages = [];

//       for (let file of files) {
//          if (!file.type.startsWith('image/')) {
//          setError('كل الملفات لازم تكون صور فقط');
//          return;
//          }
//          if (file.size > 2 * 1024 * 1024) {
//          setError('كل صورة لازم تكون أقل من 2 ميجا');
//          return;
//          }
//          validImages.push(file);
//       }

//       setImages(validImages);
//       setError('');

//       // توليد روابط العرض
//       const previewUrls = validImages.map((img) => URL.createObjectURL(img));
//       setPreviews(previewUrls);
//    };

//    const handleSubmit = async (e) => {
//       e.preventDefault();
      
//       if (images.length === 0) return setError('اختار صور الأول');
      
//       const formData = new FormData();
//       images.forEach((img) => formData.append('images', img)); // اسم الفيلد لازم يطابق الباك
      
//       try {
//          setLoading(true) ;
//          const {data} = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/order/uploadImages/${orderId}`, formData , {
//             headers: {
//                'Content-Type': 'multipart/form-data',
//                token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
//             },
//          });
//          if(data.message === "success"){
//             notification("success" , "Uploading Images Successfully")
//             setImages([]);
//             setPreviews([]);
//             setLoading(false) ;
//             getLoggedOrders("") ;
//          }else{
//             notification("error" , '❌ حصل خطأ أثناء تحميل الصور')
//          }
//       } catch (error) {
//          setLoading(false) ;
//          notification("error" , error.response.data.message )
//          setError('❌ حصل خطأ أثناء الرفع');
//       }
//    };

//    // تنظيف روابط الصور من الذاكرة
//    useEffect(() => {
//       return () => {
//          previews.forEach((url) => URL.revokeObjectURL(url));
//       };
//    }, [previews]);


//    return (
//       <Fragment>
//          <div className='container'>
//             <form onSubmit={handleSubmit}>
//                <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageChange}
//                   className='form-control'
//                />

//                {error && <p className='alert alert-danger p-1 my-1'>{error}</p>}

//                <div className='overflow-auto  py-1' style={{ display: 'flex', gap: '2px'}}>
//                   {previews.map((src, i) => (
//                      <img key={i} src={src} alt={`preview-${i}`} width={100} />
//                   ))}
//                </div>


//                {loading ? 
//                      <button className="btn bg-main my-2 w-50 p-1"> <Loading type="oval" color="white"  width={25} height={25} strokeWidth="6"/></button>
//                      // <button className='btn bg-main my-2 w-50'> <i className="fa-solid fa-spinner fa-spin fa-rotate-180 fa-xl"></i></button> 
//                   : 
//                      <button type="submit"  className='btn bg-main my-2 w-50'>رفع الصور</button>
//                }

//             </form>
//          </div>
//       </Fragment>
//    );
// };


























// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { UserContext } from '../../Context/UserContext.js';

// export default function UploadOrderImage({orderId}) {
// console.log(orderId);

//    const [image, setImage] = useState(null);
//    const [error, setError] = useState('');
//    const [preview, setPreview] = useState(null);
//    const {userToken } = useContext(UserContext) ;

//    const handleImageChange = (e) => {
//       const file = e.target.files[0];

//       if (!file) return;

//       if (!file.type.startsWith('image/')) {
//          return setError('الملف مش صورة!');
//       }

//       if (file.size > 2 * 1024 * 1024) {
//          return setError('الحجم لازم يكون أقل من 2 ميجا');
//       }

//       setImage(file);
//       setError('');
//       setPreview(URL.createObjectURL(file));
//    };

//    const handleSubmit = async (e) => {
//       e.preventDefault();

//       if (!image) return setError('اختار صورة الأول');

//       const formData = new FormData();
//       formData.append('image', image);

//       try {
//          const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/orders/uploadImages/${orderId}`, formData, {
//             headers: {
//                'Content-Type': 'multipart/form-data',
//                token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
//             },
//          });
//          console.log(res);
         
//          alert('✔️ تم الرفع بنجاح!');
//       } catch (err) {
//          console.error(err);
//          setError('❌ حصل خطأ أثناء الرفع');
//       }
//    };


//    useEffect(() => {
//       return () => {
//          if (preview) {
//             URL.revokeObjectURL(preview);
//          }
//       };
//    }, [preview]);

//    return (
//       <div className='container'>
//          <form onSubmit={handleSubmit}>
//             <div className='d-flex justify-content-between align-items-center my-2'>
//                <input type="file" accept="image/*" onChange={handleImageChange} className='form-control'/>
//                <button className='btn bg-main py-2 mx-2 w-25' type="submit">Add</button>
//             </div>
//                {error && <p style={{ color: 'red' }}>{error}</p>}
//                {preview && <img src={preview} alt="preview" width={150} />}
//          </form>
//       </div>
//    );
// };

