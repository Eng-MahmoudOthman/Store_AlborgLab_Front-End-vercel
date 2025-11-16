import { Fragment, useContext, useState } from 'react'
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./changeUserImage.css"
import { UserContext } from '../../Context/UserContext.js';
import { jwtDecode } from "jwt-decode";
import Cropper from 'react-easy-crop';
import CustomTitle from '../CustomTitle/CustomTitle.jsx';
import Loading from '../Loading/Loading.jsx';


export default function ChangeUserImage() {
   const [loading , setLoading] = useState(false)
   const navigate = useNavigate()

   const {setUserToken , setLoggedUser , getUserTeam} = useContext(UserContext) ;

   const [image, setImage] = useState(null);
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedArea, setCroppedArea] = useState(null);

   const onCropComplete = (_, croppedAreaPixels) => {
      setCroppedArea(croppedAreaPixels);
   };

   const handleFile = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
   };

   const cropImage = async () => {
      const img = new Image();
      img.src = image;
      await new Promise((r) => (img.onload = r));

      const canvas = document.createElement("canvas");
      canvas.width = 236;
      canvas.height = 236;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
         img,
         croppedArea.x,
         croppedArea.y,
         croppedArea.width,
         croppedArea.height,
         0,
         0,
         236,
         236
      );

      const blob = await new Promise((resolve) =>
         canvas.toBlob(resolve, "image/jpeg")
      );
      return blob;
   };








   async function getData(){
      setLoading(true)
      let headers = {
         'enctype' :'multipart/form-data' , 
         token:`${process.env.REACT_APP_BEARER_TOKEN} ${localStorage.getItem("token") }`
      };


      // قص الصورة أولاً
      const croppedBlob = await cropImage();

      // إنشاء FormData لرفع الصورة
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped.jpg");


      await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/changeProfileImage` , formData , {headers})
      .then(({data})=>{
         if(data.message === "success") {
            localStorage.setItem("token" , data.token) ;
            setUserToken(data.token);

            const decoded = jwtDecode(data.token);

            //& Get User Team When Refresh :
            getUserTeam(decoded.branchId) ;

            setLoggedUser(decoded) ;
            navigate("/userProfile")
         }
         console.log(data);
         
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         setLoading(false)
      })
   }


   const formik = useFormik({
      initialValues: {
         file: null , 
      },
      onSubmit: getData,
   });

   return (
      <div className="container mt-5">
         <CustomTitle title="تغيير صورة البروفايل" />
         
         <form onSubmit={formik.handleSubmit}>
               <h1 className='main-header'>تغيير الصورة الشخصية</h1>
               <div className='under-header'></div>
               <div className="mb-3">
                  <label htmlFor="file" className="form-label">
                     اختر صورة
                  </label>
                  <input
                     id="file"
                     type="file"
                     accept="image/*"
                     onChange={(e) => {
                     formik.setFieldValue("file", e.target.files[0]);
                     handleFile(e);
                     }}
                     className="form-control"
                  />
               </div>

               {image && (
                  <>
                     <div
                     className="mb-3"
                     style={{
                        width: 300,
                        height: 300,
                        position: "relative",
                     }}
                     >
                     <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                     />
                     </div>
                  </>
               )}

               <div className="mt-4">
                  {loading? 
                     <button className="btn bg-main"> <Loading color="white" width={40} height={30} strokeWidth="6"/></button>
                     // <button className="btn bg-main"><i className="fa fa-spinner fa-spin text-white fa-1x"></i></button> 
                  : 
                     <button type="submit" disabled={!(formik.isValid && formik.dirty)}   className="btn bg-main">إرسال</button>
                  }
               </div>
         </form>
      </div>
   )
}
