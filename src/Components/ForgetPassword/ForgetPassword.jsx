import { useFormik } from "formik" ;
import { Fragment , useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import axios from "axios";
import style from  "./forgetPassword.module.css" ;
import CustomTitle from "../CustomTitle/CustomTitle.jsx";
import notification from "../../Utilities/notification.js";
import Loading from "../Loading/Loading.jsx";





export default function ForgetPassword() {

   const [employeeCode , setEmployeeCode] = useState("")
   const [resetToken , setResetToken] = useState("") ;
   const [step , setStep] = useState("email") ;
   const [loading , setLoading] = useState(false)
   const [error , setError] = useState(null) ;
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate() ;









      //& Send Email To Server And Send Server OTP To Email :
      async function sendEmail(values){
         setLoading(true)
         await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/request-reset` , values)
         .then(({data})=>{
            setError(null) ;
            notification("success" , data.message)
            setEmployeeCode(values.employeeCode)
            setStep("otp")
            setLoading(false)
         })
         .catch((error)=>{
            setError(error.response.data.message)
            console.log(error.response.data.message);
            setLoading(false)
         })
      }
      const validationSchemaEmail = Yup.object({
         employeeCode:Yup.string().required("الكود مطلوب").trim() ,
      })
      const formikEmail = useFormik({
         initialValues:{
            employeeCode:"" ,
         } , validationSchemaEmail , 
         onSubmit:sendEmail
      })






      async function verifyOTP (values){
         setLoading(true)
         values.employeeCode = employeeCode
         await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/verify-otp` , values)
         .then(({data})=>{
            setError(null) ;
            notification("success" , data.message)
            setResetToken(data.resetToken)
            setStep("reset")
            setLoading(false)
         })
         .catch((error)=>{
            setError(error.response.data.message)
            console.log(error.response.data.message);
            setLoading(false)
         })
      } ;
      const validationSchemaOTP = Yup.object({
         OTP:Yup.string().email().required().trim() ,
      })
      const formikOTP = useFormik({
         initialValues:{
            OTP:"" ,
         } , validationSchemaOTP , 
         onSubmit:verifyOTP
      })









      async function newPassword(values){
         setLoading(true)
         values.resetToken = resetToken
         await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/reset-password` , values)
         .then(({data})=>{
            setError(null) ;
            notification("success" , data.message)
            navigate("/");
            setLoading(false) ;
         })
         .catch((error)=>{
            setError(error.response.data.message)
            console.log(error.response.data.message);
            setLoading(false)
         })
      } ;
      const validationSchemaReset = Yup.object({
         newPassword:Yup.string().email().required().trim() ,
      })
      const formikReset  = useFormik({
         initialValues:{
            newPassword:"" ,
         } , validationSchemaReset , 
         onSubmit:newPassword
      })









   return (
      <Fragment>
         <CustomTitle title="Forget Password" />

         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item p-0"><Link className="text-primary mx-1" to="/">Home</Link></li>
               <li className="breadcrumb-item active p-0" aria-current="page">Inventory</li>
            </ol>
         </nav>

         <div className='container ForgetPassword-container'>
            <div>
               <h1 className="mb-0 mt-4 main-color">Password Reset</h1>
               <p className="my-0 ">Provide the email address associated with your account to recover your password.</p>
               <p className="fs-5 mb-3 fw-bold">Step {step === "email" ? <span className="main-color">1</span> : step === "otp" ? <span className="main-color">2</span> : <span className="main-color">3</span>} of 3</p>
            </div>



            {step === "email"? 
                  <div className="email">
                     <div>
                        <form action="" onSubmit={formikEmail.handleSubmit}>
   
                           {error?<p className="text-danger">{error}</p> :""}
   
                           <div className="my-4 position-relative">
                              <i className="fas fa-user icon-input-field"></i>
                              <label htmlFor="email" className="form-label required">Enter Employee Code </label>
                              <input type="text" 
                                 value={formikEmail.values.employeeCode}
                                 onChange={formikEmail.handleChange} 
                                 onBlur={formikEmail.handleBlur}
                                 className={`${style.form} form-control`} id="employeeCode"  
                                 name="employeeCode" 
                                 required
                                 placeholder="xx x xx" />
                              {
                                 formikEmail.errors.employeeCode  && formikEmail.touched.employeeCode?
                                    <div className="text-danger m-0 p-0">{formikEmail.errors.employeeCode}</div> 
                                    : 
                                    <p className="text-success m-0 p-0">Enter Good Information Please !</p>
                              }
                           </div>
   
                           <div className="d-grid gap-2 col-8 mx-auto">
                              {loading ? 
                                    <button className="btn bg-main text-white  mt-2"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                 : 
                                    <button disabled={!(formikEmail.isValid && formikEmail.dirty)} type="submit" className="btn bg-main text-white  mt-2">Send OTP to email</button>
                              }
                           </div>
                              <p className={`text-center mt-1`}>Log in to your account !<Link className="m-2 main-color" to="/">تسجيل الدخول</Link></p>
                        
                        </form>
                     </div>
                  </div>
               : 
               ""
            }





            {step === "otp" ? 
                  <div className="otp">
                     <div>
                        <form action="" onSubmit={formikOTP.handleSubmit}>
   
                           {error?<p className="text-danger">{error}</p> :""}
   
                           <div className="my-4 position-relative">
                              <i className="fas fa-user icon-input-field"></i>
                              <label htmlFor="OTP" className="form-label required">Enter OTP </label>
                              <input type="text" 
                                 value={formikOTP.values.OTP}
                                 onChange={formikOTP.handleChange} 
                                 onBlur={formikOTP.handleBlur}
                                 className={`${style.form} form-control`} id="OTP"  
                                 name="OTP" 
                                 required
                                 placeholder="xx xx xx" />
                              {
                                 formikOTP.errors.OTP  && formikOTP.touched.OTP?
                                    <div className="text-danger m-0 p-0">{formikOTP.errors.OTP}</div> 
                                    : 
                                    <p className="text-success m-0 p-0">Enter Good Information Please !</p>
                              }
                           </div>
   
                           <div className="d-grid gap-2 col-8 mx-auto">
                              {loading ?
                                    <button className="btn bg-main text-white  mt-2"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button> 
                                 : 
                                    <button disabled={!(formikOTP.isValid && formikOTP.dirty)} type="submit" className="btn bg-main text-white  mt-2">Verify OTP</button>
                              }
                           </div>
   
                        </form>
                     </div>
                  </div>
               : 
               " "
            }




            {step === "reset" ? 
                  <div className="reset">
                     <div>
                        <form action="" onSubmit={formikReset.handleSubmit}>

                           {error?<p className="text-danger">{error}</p> :""}

                           <div className="my-4 position-relative">
                              <i className="fas fa-lock icon-input-field"></i>
                              <label htmlFor="newPassword" className="form-label required">Enter New Password </label>
                              <input  type={showPassword ? "text" : "password"}
                                 value={formikReset.values.newPassword}
                                 onChange={formikReset.handleChange} 
                                 onBlur={formikReset.handleBlur}
                                 className={`${style.form} form-control`} id="newPassword"  
                                 name="newPassword" 
                                 required
                                 placeholder="Enter New Password" 

                                 /** ==== Prevent Copy , Cut , paste , Right Click ==== */
                                 onCopy={(e) => e.preventDefault()}
                                 onPaste={(e) => e.preventDefault()}
                                 onCut={(e) => e.preventDefault()}
                                 onContextMenu={(e) => e.preventDefault()}
                                 />
                              {
                                 formikReset.errors.newPassword && formikReset.touched.newPassword?
                                    <p className="text-danger m-0 p-0">{formikReset.errors.newPassword}</p> 
                                    : 
                                    <p className="text-success m-0 p-0">Enter Good Information Please !</p>
                              }
                              <i className="fas fa-eye toggle-password"></i>


                              {showPassword ? (
                                 <i className="fas fa-eye toggle-password" onClick={() => setShowPassword(false)}></i>
                              ) : (
                                 <i className="fas fa-eye-slash toggle-password" onClick={() => setShowPassword(true)}></i>
                              )}
                           </div>

                           <div className="d-grid gap-2 col-8 mx-auto">
                              {loading ? 
                                    <button className="btn bg-main text-white  mt-2"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                 : 
                                    <button disabled={!(formikReset.isValid && formikReset.dirty)} type="submit" className="btn bg-main text-white  mt-2">New Password</button>
                              }
                           </div>
                        </form>
                     </div>
                  </div>
               : 
               " "
            }
         </div>
      </Fragment>
   )
} ;