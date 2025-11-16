import { Fragment, useContext, useState } from 'react'
import { useFormik } from "formik" ;
import {Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';

import axios from "axios";
import Swal from 'sweetalert2';

import { UserContext } from "../../Context/UserContext.js";
import { jwtDecode } from "jwt-decode";
import Loading from '../Loading/Loading.jsx';
import "./UpdateUserProfile.css" ;






export default function UpdateUserProfile() {
   const navigate = useNavigate() ;
   const [loading , setLoading] = useState(false) ;

   const {setLoggedUser  ,loggedUser , userToken , setUserToken } = useContext(UserContext)


   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
   }

   async function submitUpdated(values){
      setLoading(true) ;
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/users` , values ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setLoading(false) ;
            Swal.fire({
               title:"Successfully"  ,
               text: "Successfully Updated User Information" ,   
               icon: "success"
            });        
            
            localStorage.setItem("token" , data.token) ;

            const token = data.token ;
            const decoded = jwtDecode(token);

            setLoggedUser(decoded) ;
            setUserToken(data.token) ;
            navigate("/userProfile") ;
         }
      })
      .catch((error)=>{
         setLoading(false) ;
         console.log(error.response.data.message);
         Swal.fire({
            title:"Failed Updated"  ,
            text: `Can't Updated User Information Because : ${error.response.data.message}` ,   
            icon: "error"
         });  
      })
   }

   

   let validationSchema = Yup.object({
      name:Yup.string().min(2 , "Name Should be More than 2").max(50 , "Name less than 50").trim() ,
      phone:Yup.string().matches(/^01[0125][0-9]{8}$/).trim() ,
   })


   let formik = useFormik({
      initialValues:{
         name:loggedUser.name || "" ,
         phone:loggedUser.phone || "" ,
      } , validationSchema , 
      onSubmit:submitUpdated
   })


   return (
      <Fragment>
         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item"><Link className="text-primary" to="/UserProfile">User Profile</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Update User Profile</li>
            </ol>
         </nav>

         <div className='container updateUserProfile-container'>
            <div className="">
               <h1 className="main-header">تعديل ملفى الشخصى</h1>

               <p className="updateUserProfile-sub-title text-center">يرجى إدخال المعلومات بالطريقة الصحيحة</p>

               <form action="" onSubmit={formik.handleSubmit}>
                  <div className="my-4 position-relative">
                     <i className="fas fa-user icon-input-field"></i>
                     <label htmlFor="name" className="form-label not-required ">إدخل اسم المستخدم </label>
                     <input type="text" 
                        value={formik.values.name}
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur}
                        className="form-control ps-5" id="name"  
                        name="name" 
                        placeholder="اسم المستخدم" />
                     {
                        formik.errors.name  && formik.touched.name?
                           <div className="text-danger m-0 p-0">{formik.errors.name}</div> 
                           : 
                           <p className="text-success m-0 p-0">Enter Correct Information Please !</p>
                     }
                  </div>


                  <div className="my-4 position-relative">
                     <i className="fa-solid fa-mobile-screen-button icon-input-field"></i>
                     <label htmlFor="phone" className="form-label not-required">أدخل تليفون المستخدم</label>
                     {/* <input type="tel"  */}
                     <input type="text" 
                        value={formik.values.phone}
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur}
                        className="form-control ps-5" id="phone"  
                        name="phone" 
                        placeholder="01X XXX XXX XX" />
                     {
                     formik.errors.phone && formik.touched.phone?
                        <div className="text-danger m-0 p-0">{formik.errors.phone}</div> 
                        : 
                        <p className="text-success m-0 p-0">Enter Correct Information Please !</p>
                     }
                  </div>


                  <div className="d-grid gap-2 col-8 mx-auto">
                     {loading ? 
                           <button className="btn bg-main text-white  mt-2 p-1"> <Loading type="oval" color="white"  width={25} height={25} strokeWidth="6"/></button>
                           // <button className="btn bg-main text-white  mt-2"> <i className="fa-solid fa-spinner fa-spin fa-rotate-180 fa-xl"></i></button>
                        : 
                           <button  type="submit" className="btn bg-main text-white  mt-2">تعديل البيانات</button>
                     }
                  </div>
               </form>
            </div>
         </div>
      </Fragment>
   )
}


