import { Fragment, useContext , useState } from 'react';
import { useFormik } from "formik" ;
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { UserContext } from "../../Context/UserContext.js";
import Swal from 'sweetalert2';
import CustomTitle from '../CustomTitle/CustomTitle.jsx';
import notification from '../../Utilities/notification.js';
import { logOut } from '../../Utilities/logOut.js';
import style from  "./changePassword.module.css"
import Loading from '../Loading/Loading.jsx';



export default function ChangePassword() {
      const navigate = useNavigate() ;
      const [loading , setLoading] = useState(false) ;
      const {setRole , setLoggedUser  , setUserToken , userToken , getUserTeam} = useContext(UserContext) ;
      const [showPassword, setShowPassword] = useState(false) ;
      const totalUserInfo = useContext(UserContext) ;

      const header = {
         token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
      } ;
   
   
   //& Handle Log Out :
   function  handleLogOut(){
      logOut(navigate , totalUserInfo) ;
      Swal.fire({
         title:"Session Expired !" ,
         text: "Session Expired .Please Try Log in Again !!" ,   
         icon: "error"
      });
   }


      //& Handle Phone Empty Or Email Empty :
      async function submitChangePassword(values){
         setLoading(true)
         await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/changePassword` , values ,  {headers:header})
         .then(({data})=>{
            if(data.message === "success"){
               setLoading(false) ;

               notification("success" , "Change Password Successfully") ;

               //& save Token In Local Storage And Save Token in Use Context :
               localStorage.setItem("token" , data.token) ;
               setUserToken(data.token) ;
   
               const token = data.token ;
               const decoded = jwtDecode(token);

               //& Get User Team When Refresh :
               getUserTeam(decoded.branchId) ;

               setLoggedUser(decoded) ;
   
               //& Set Main Color From Database :
               document.documentElement.style.setProperty("--main-color" , decoded.color )
   
               //& Set Role :
               setRole(decoded.role);
               navigate("/home") ;

               setTimeout(() => {
                  handleLogOut()
               } , (60*60*1000)) ;    
               // After 1 hours   logout
                  // 60*10*1000 = 600,000= 10 minute
                  // 60*20*2*1000 = 2400,000= 1/3 hours
                  // 60*60*1000 = 3600,000= 1 hours  
                  // 60*60*2*1000 = 7200,000= 2 hours 
            }
         })
         .catch((error)=>{
            setLoading(false)
            notification("error" , error.response.data.message)
         });


      }
   
      let validationSchema = Yup.object({
         oldPassword:Yup.string().required().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]?).{7,}$/ , "should be Password Start UpperCase And Contain 8 Character And Contain any (@#$%&*)") ,
         password:Yup.string().required().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]?).{7,}$/ , "should be Password Start UpperCase And Contain 8 Character And Contain any (@#$%&*)") ,
         rePassword:Yup.string().required().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]?).{7,}$/ , "should be Password Start UpperCase And Contain 8 Character And Contain any (@#$%&*)") ,
      })
   
   
      let formik = useFormik({
         initialValues:{
            oldPassword:"" ,
            password:"" ,
            rePassword:"" ,
         } , validationSchema , 
         onSubmit:submitChangePassword
      })
   
   return (
      <Fragment>
         <CustomTitle title="تغيير كلمة المرور" />

         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary mx-1" to="/">Home</Link></li>
               <li className="breadcrumb-item"><Link className="text-primary mx-1" to="/Setting">Setting</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Change Password</li>
            </ol>
         </nav>
         
         <div className='container changePassword-container'>
            <div className="row mx-1">
               <div className=" col-md-8 m-auto">
                  <h1 className="main-header">تغيير كلمة المرور</h1>
                  {/* <p className="sub-title text-center">Change Password</p> */}
                  <form action="" onSubmit={formik.handleSubmit}>

                     <div className="mb-4 position-relative">
                        <i className="fas fa-lock icon-input-field"></i>
                        <label htmlFor="oldPassword" className="form-label required">Enter Old Password </label>
                        <input  type={showPassword ? "text" : "password"}
                           value={formik.values.oldPassword}
                           onChange={formik.handleChange} 
                           onBlur={formik.handleBlur}
                           className={`${style.form} form-control rounded-0`} id="oldPassword"  
                           name="oldPassword" 
                           required
                           autoComplete="current-password"
                           placeholder="ادخل كلمة المرور القديمة" 

                           /** ==== Prevent Copy , Cut , paste , Right Click ==== */
                           onCopy={(e) => e.preventDefault()}
                           onPaste={(e) => e.preventDefault()}
                           onCut={(e) => e.preventDefault()}
                           onContextMenu={(e) => e.preventDefault()}
                           />
                        {
                           formik.errors.oldPassword && formik.touched.oldPassword?
                              <p className="text-danger m-0 p-0">{formik.errors.oldPassword}</p> 
                              : 
                              <p className="text-success ms-2 p-0">Write The  Old Password Here Please !</p>
                        }

                        {showPassword ? (
                           <i className="fas fa-eye toggle-password" onClick={() => setShowPassword(false)}></i>
                        ) : (
                           <i className="fas fa-eye-slash toggle-password" onClick={() => setShowPassword(true)}></i>
                        )}
                     </div>


                     <div className="my-4 position-relative">
                        <i className="fas fa-lock icon-input-field"></i>
                        <label htmlFor="password" className="form-label required">Enter New Password </label>
                        <input  type={showPassword ? "text" : "password"}
                           value={formik.values.password}
                           onChange={formik.handleChange} 
                           onBlur={formik.handleBlur}
                           className={`${style.form} form-control rounded-0`} id="password"  
                           name="password" 
                           required
                           placeholder="ادخل كلمة المرور الجديدة"

                           /** ==== Prevent Copy , Cut , paste , Right Click ==== */
                           onCopy={(e) => e.preventDefault()}
                           onPaste={(e) => e.preventDefault()}
                           onCut={(e) => e.preventDefault()}
                           onContextMenu={(e) => e.preventDefault()}
                           />
                        {
                           formik.errors.password && formik.touched.password?
                              <p className="text-danger m-0 p-0">{formik.errors.password}</p> 
                              : 
                              <p className="text-success ms-2 p-0">More 8 Character and Special Character !</p>
                        }
                     </div>


                     <div className="my-4 position-relative">
                     <i className="fa-solid fa-unlock-keyhole  icon-input-field"></i>
                        <label htmlFor="rePassword" className="form-label required">Enter Re-Password </label>
                        <input  type={showPassword ? "text" : "password"}
                           value={formik.values.rePassword}
                           onChange={formik.handleChange} 
                           onBlur={formik.handleBlur}
                           className={`${style.form} form-control rounded-0`} id="rePassword"  
                           name="rePassword" 
                           required
                           placeholder="إعادة ادخال كلمة المرور الجديدة" 

                           /** ==== Prevent Copy , Cut , paste , Right Click ==== */
                           onCopy={(e) => e.preventDefault()}
                           onPaste={(e) => e.preventDefault()}
                           onCut={(e) => e.preventDefault()}
                           onContextMenu={(e) => e.preventDefault()}
                        />
                        {
                           formik.errors.rePassword && formik.touched.rePassword?
                              <p className="text-danger m-0 p-0">{formik.errors.rePassword}</p> 
                              : 
                              <p className="text-success ms-2 p-0">More 8 Character and Special Character !</p>
                        }
                     </div>

                     <div className="d-grid gap-2 col-8 mx-auto">
                        {loading ? 
                              // <button className="btn bg-main text-white  mt-2"> <i className="fa-solid fa-spinner fa-spin fa-rotate-180 fa-xl"></i></button>
                              <button className="btn bg-main text-white  mt-2"> <Loading color="white" width={40} height={30} strokeWidth="6"/></button>
                           : 
                              <button disabled={!(formik.isValid && formik.dirty)} type="submit" className="btn bg-main text-white  mt-2">
                                 <i className="fa-solid fa-unlock-keyhole mx-4"></i>   تغيير كلمة المرور 
                              </button>
                        }
                     </div>

                  </form>
               </div>
            </div>
         </div>
      </Fragment>
   )
}
