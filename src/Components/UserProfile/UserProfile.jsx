import { useContext, useState } from 'react' ;
import { UserContext } from '../../Context/UserContext.js' ;
import Swal from 'sweetalert2' ;
import { Fragment } from 'react' ;
import { Link } from 'react-router-dom' ;
import CustomTitle from '../CustomTitle/CustomTitle.jsx' ;
import Loading from '../Loading/Loading.jsx' ;
import style from "./userProfile.module.css" ;



export default function UserProfile() {
   const {role , loggedUser} = useContext(UserContext) ;
   const[showLogo , setShowLogo] = useState(false) ;

   let showImageProfile = ()=>{
      Swal.fire({
         imageUrl: showLogo? "/profile1.png" : loggedUser?.image ,
         imageHeight: 460,
         imageAlt: "A tall image"
      });
   }


   return (
      <Fragment>
         <CustomTitle title="الصفحة الشخصية " />
         {!loggedUser?  
               <div className="container mt-5">
                  <Loading type="large" color="gray" />
               </div>
            : 
               <div className="container mt-5 homeDashboard">
                  <h1 className='main-header'>Profile</h1>
                  <div className='under-header'></div>

                  <div className={`${style.imgCoverProfile} m-auto text-center overflow-hidden`}>
                     <img 
                        onClick={()=>{showImageProfile()}} 
                        src={loggedUser?.image || "/profile1.png"} 
                        onError={(e) => {
                           setShowLogo(true)
                           e.target.onerror = null ; // علشان ميعملش loop
                           e.target.src = "/profile1.png" ;     // الصورة الديفولت
                        }}
                        className='w-100 rounded-2'
                        alt="Cover"
                     /> 
                  </div>

                  <div className='text-center my-2'>
                     <Link to="/ChangeUserImage" title='اضغط هنا لتغيير الصورة الشخصية' className='btn btn-sm bg-main'>تغيير الصورة الشخصية<i className="fa-solid fa-camera-rotate ms-2"></i></Link>
                  </div>

                  <div className='mt-4 main-color fw-bold'>
                     <p className='fs-6'>Name : {loggedUser.name}</p>
                     <p className='fs-6'>Employee Code :{loggedUser.employeeCode}</p>
                     <p className='fs-6'>Email :{loggedUser.email}</p>
                     <p className='fs-6'>Mobile : {loggedUser.phone}</p>
                     <p className='fs-6'>Branch: {loggedUser.branch}</p>
                     {role === "admin" || role === "moderator" ? <p className='fs-6'>User Role : {loggedUser.role}</p> :""}
                  </div>
                  <div>
                     <Link to={`/UpdateUserProfile`} className='btn btn-sm bg-main w-50 ' >تعديل بياناتى</Link>
                  </div>
               </div>
         }
      </Fragment>
   )
}
