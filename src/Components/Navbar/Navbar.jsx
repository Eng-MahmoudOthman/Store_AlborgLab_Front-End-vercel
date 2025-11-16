import {Fragment, useContext} from "react" ;
import { Link } from "react-router-dom" ;
import { UserContext } from "../../Context/UserContext.js";
import style from "./navbar.module.css"
import isTokenValid from "../../Utilities/checkToken.js";

export default function Navbar(){
   const {loggedUser ,  userToken  , team} = useContext(UserContext) ;

   return (
      <Fragment>
         <div className="">
            {userToken && loggedUser && isTokenValid(userToken)? 
               <>
                  {/* Header */}
                  <div className="fixed-top p-1 bg-white border-0">
                     <p className="text-center bg-danger  p-0 m-0 text-white">🎁 هذة نسخة تجريبية </p>

                     <header className ={`p-1 text-white bg-body-tertiary  ${style.divHeader}`}>
                        <div className='row justify-content-center align-items-center g-0'>
                           
                           <div  className={`col-2 m-0 ${style.divMobileImgCover}`}>
                              <Link to="/UserProfile">
                                 <img 
                                    src={loggedUser.image || "/profile1.png"} 
                                    onError={(e) => {
                                       e.target.onerror = null ;   // علشان ميعملش loop
                                       e.target.src = "/profile1.png" ;     // الصورة الديفولت
                                    }}
                                    className={`${style.imgCover}`}
                                    alt="Cover"
                                    />
                              </Link>
                           </div>

                           <div className={`col-7 m-0 px-0 ps-2`}>
                              <p className={`m-0 p-0 text-black ${style.info}`}>{loggedUser?.name?.toLowerCase().split(" ").map(word => word.charAt(0)?.toUpperCase() + word.slice(1)).slice(0,2).join(" ")} 👋</p>
                              <p className={`m-0 p-0 text-black ${style.info}`}>{loggedUser.branch}</p>
                              <p className={`m-0 p-0 text-black ${style.info}`}>{loggedUser.branchArea}</p>
                           </div>

                           <div  className="col-2 m-0 px-0 text-center">
                              <Link to="/yourTeam" className="main-color">
                                 <i className={`fa-solid fa-users-line ${style.iconTeam}`}></i>
                                 <p className={`m-0 text-center ${style.team}`}>Team:{team.length || 0}</p>
                              </Link>
                           </div>
                           
                        </div>
                     </header>
                  </div>
                  



                  {/* Navbar Large Screen Position Top  */}
                  <nav className={`navbar shadow-sm  bg-body-secondary fixed-top p-0 m-0 mx-1 ${style.sidebarLarge}`}> 
                     <div className="container-fluid "> 
                        <div className="d-flex justify-content-evenly w-50 m-auto">
                           <Link to="/Consumption" className={`text-center main-color fw-bold `}>
                              <i className="fa-solid fa-cart-plus p-0 m-0"></i> Consumption 
                           </Link>

                           <Link to="/home" className={`text-center main-color fw-bold`}>
                              <i className="fa-solid fa-house-user"></i> Home  
                           </Link>

                           <Link to="/Setting" className={`text-center main-color fw-bold`}>
                              <i className="fa-solid fa-gear p-0 m-0"></i> Setting 
                           </Link>
                        </div>
                     </div> 
                  </nav>



                  {/* Navbar Mobile Position Bottom  */}
                  <nav className={`navbar bg-main fixed-bottom py-1 m-0 mx-1 ${style.sidebar}`}> 
                     <div className="container-fluid d-flex justify-content-between"> 

                           <Link to="/Consumption" className={`text-center ${style.consumptionIcon}`}>
                              <i className="fa-solid fa-cart-plus p-0 m-0"></i> 
                              <p className="m-0 p-0">Consumption</p>
                           </Link>


                           <Link to="/home" className={`text-center  ${style.mainIcon}`}>
                              <i className="fa-solid fa-house-user"></i> 
                           </Link>


                           <Link to="/Setting" className={`text-center ${style.settingIcon}`}>
                              <i className="fa-solid fa-bars m-0 p-0"></i>
                              <p className="m-0 p-0">Setting</p> 
                           </Link>

                     </div> 
                  </nav>
               </>
               : ""
            }
         </div>














         {/* <div className="">
            {userToken && loggedUser && isTokenValid(userToken)? 
               <>
                  
                  <div className="fixed-top p-1 bg-white border-0">
                     <p className="text-center bg-danger  p-0 m-0 text-white">🎁 هذة نسخة تجريبية </p>

                     <header className ={`p-1 text-white bg-body-tertiary  ${style.divHeader}`}>
                        <div className='row justify-content-evenly  align-items-center'>
                           
                           <div  className={`col-3 ${style.divMobileImgCover}`}>
                              <Link to="/UserProfile">
                                 <img 
                                    src={loggedUser.image || avatar} 
                                    onError={(e) => {
                                       e.target.onerror = null ;   // علشان ميعملش loop
                                       e.target.src = avatar ;     // الصورة الديفولت
                                    }}
                                    className={`${style.imgCover}`}
                                    alt="Cover"
                                    />
                              </Link>
                           </div>

                           <div className={`col-7`}>
                              <p className={`m-0 p-0 text-black ${style.info}`}>{loggedUser?.name?.toLowerCase().split(" ").map(word => word.charAt(0)?.toUpperCase() + word.slice(1)).slice(0,2).join(" ")} 👋</p>
                              <p className={`m-0 p-0 text-black ${style.info}`}>{loggedUser.branch}</p>
                              <p className={`m-0 p-0 text-black ${style.info}`}>{loggedUser.branchArea}</p>
                           </div>

                           <div  className="col-2 m-0  text-center">
                              <Link to="/yourTeam" className="main-color">
                                 <i className={`fa-solid fa-users-line ${style.iconTeam}`}></i>
                                 <p className={`m-0 text-center ${style.team}`}>Team:{team.length || 0}</p>
                              </Link>
                           </div>

                        </div>
                     </header>
                  </div>
                  

                  
                  <nav className={`navbar bg-main fixed-bottom py-1 m-0 mx-1 ${style.sidebar}`}> 
                     <div className="container-fluid d-flex justify-content-between"> 

                           <Link to="/Consumption" className={`text-center ${style.consumptionIcon}`}>
                              <i className="fa-solid fa-cart-plus p-0 m-0"></i> 
                              <p className="m-0 p-0">Consumption</p>
                           </Link>


                           <Link to="/home" className={`text-center  ${style.mainIcon}`}>
                              <i className="fa-solid fa-house-user"></i> 
                           </Link>


                           <Link to="/Setting" className={`text-center ${style.settingIcon}`}>
                              <i className="fa-solid fa-bars m-0 p-0"></i>
                              <p className="m-0 p-0">Setting</p> 
                           </Link>

                     </div> 
                  </nav>
               </>
               : ""
            }
         </div> */}
      </Fragment>
   )
}