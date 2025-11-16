import { Fragment, useContext, useEffect , useState } from "react";
import avatar from "../../Assets/images/profile1.png"

import style from "./specificUser.module.css" ;
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext.js";
import CustomTitle from "../CustomTitle/CustomTitle.jsx";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading.jsx";




export default function SpecificUser() {
   const navigate = useNavigate();

   const {id} = useParams();
   const {user , getSpecificUser , loading} = useContext(UserContext) ;
   const[showLogo , setShowLogo] = useState(false) ;

   const showImageProfile = ()=>{
      Swal.fire({
         imageUrl: showLogo? avatar : user.image?.secure_url ,
         imageHeight: 460,
         imageAlt: "A tall image"
      });
   }

      // encodeURIComponent في JavaScript وظيفتها إنها تشفّر القيم اللي بتحطها جوه الـ URL
      const handleSelectColor = (color) => {
         navigate(`/changeColor?color=${encodeURIComponent(color)}`);
      };


   useEffect(() => {
      getSpecificUser(id) ;
   }, [])


   return (
      <Fragment>
         <CustomTitle title="أعضاء الفريق" />
         <nav aria-label="breadcrumb" className='container  bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary " to="/">Home</Link></li>
               <li className="breadcrumb-item"><Link className="text-primary " to="/yourTeam">Your Team</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Member Team</li>
            </ol>
         </nav>

         <div className="container mt-5">
            <h1 className='main-header'>Team Member</h1>
            <div className='under-header'></div>

            {loading?    
                     <Loading type="large" color="gray" />
                  :
                     <>
                        <div className={`${style.imgCover} m-auto text-center overflow-hidden`}>
                           <img 
                              onClick={()=>{showImageProfile()}} 
                              src={user.image?.secure_url || avatar} 
                              onError={(e) => {
                                 setShowLogo(true)
                                 e.target.onerror = null ; // علشان ميعملش loop
                                 e.target.src = avatar ;     // الصورة الديفولت
                              }}
                              className='w-100 rounded-2'
                              alt="Cover"
                           /> 
                        </div>

                        <div className='mt-4 main-color fw-bold'>
                           <p className='fs-6'>Name : {user.name}</p>
                           <p className='fs-6'>Employee Code :{user.employeeCode}</p>
                           <p className='fs-6'>Email :{user.email}</p>
                           <p className='fs-6'>Mobile : {user.phone}</p>
                           <p className='fs-6'>Branch: {user.branch?.name}</p>
                           <p className='fs-6'>Area: {user.branch?.branch_area}</p>
                           <p className='fs-6 d-flex justify-content-start align-items-center'>
                              Profile Color: 
                              <span className={`${style.showColor}`} style={{background:user.color}}></span>
                           </p>
                              <button className="btn btn-outline-primary" onClick={()=>{handleSelectColor(user.color)}} >Set This Color</button>
                        </div>
                     </>
            }

         </div>
      </Fragment>
      )
   }
