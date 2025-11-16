import { Fragment, useContext } from 'react';

import style from "./yourTeam.module.css" ;
import { UserContext } from '../../Context/UserContext.js';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';



export default function YourTeam() {
   const {team , loading} = useContext(UserContext) ;




   return (
      <Fragment>
         <section className='container '>
            <nav aria-label="breadcrumb" className='container bg-body-secondary'>
               <ol className="breadcrumb ">
                  <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link className="text-primary" to="/Setting">Setting</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Team</li>
               </ol>
            </nav>

            <div className=''>
               <h1 className='main-header'>OUR PERFECT TEAM</h1>
               {loading? 
                     <Loading type="large" color="gray"/>
                  :
                     <div className="row ">
                              {
                                 team.length? 
                                    team.map((ele)=>
                                       <div className="col-md-4 ">
                                          <Link key={ele._id} to={`/SpecificUser/${ele._id}`} className=' btn my-1'>
                                             <div className={`${style.card}  position-relative text-center overflow-hidden`}>
                                                <div className={`${style.oneDiv}`}></div>
                                                <div className="border border-1 rounded-3 shadow-sm m-0">
                                                   <div className={`overflow-hidden ${style.imageCard} position-absolute my-4 `}>
                                                      <img src={ele.image?.secure_url || "/profile1.png"} className='img-fluid w-100 h-100 object-fit-contain' alt="" />
                                                   </div>

                                                   <div className={`${style.memberCard} my-2 `}>
                                                      <h3 className='fw-bold mt-3'>{ele.name.split(" ").slice(0 , 1).join(" ")}</h3>
                                                      <p className='fw-bold text-secondary m-0'>{ele.email}</p>
                                                      <p className='fw-bold text-secondary m-0'>{ele.employeeCode}</p>
                                                      <p className='my-3  p-3'>Hi, I’m {ele.name.split(" ").slice(0 , 2).join(" ")} from the {ele.branch?.name} branch team.
                                                         I’m really happy to be part of this amazing and professional team, and I’m looking forward to growing and achieving more together.
                                                      </p>
                                                      <div className="text-warning my-3">
                                                         <i class="fa-brands fa-twitter mx-2 "></i>
                                                         <i class="fa-brands fa-linkedin-in mx-2 "></i>
                                                         <i class="fa-brands fa-facebook-f mx-2 "></i>
                                                         <i class="fa-brands fa-instagram mx-2 "></i>
                                                      </div>
                                                   </div>
                                                </div>
                                                <span className={`${style.circle} position-absolute bg-body-secondary rounded-circle`}></span>
                                             </div>
                                          </Link>

                                       </div>
                                    ) 
                                 : <p className='text-danger fw-bold'>Team List Is Empty</p>

                              }
                     </div>
               }
            </div>
         </section>
      </Fragment>
   )
}









   // return (
   //    <Fragment>
   //       <nav aria-label="breadcrumb" className='container my-3 bg-body-secondary'>
   //          <ol className="breadcrumb ">
   //             <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
   //             <li className="breadcrumb-item"><Link className="text-primary" to="/Setting">Setting</Link></li>
   //             <li className="breadcrumb-item active" aria-current="page">Team</li>
   //          </ol>
   //       </nav>

   //       <div className='container'>
   //          <h1 className='main-header'>OUR PERFECT TEAM</h1>
   //          {loading? 
   //                   <Loading type="large" color="gray"/>
   //                :
   //                   <div className='mt-5 '>
   //                      {team.length > 0 ? 
   //                         team.map((ele)=>
   //                            <Link key={ele._id} to={`/SpecificUser/${ele._id}`} className='card btn my-1'>
   //                               <div className=" my-2">
   //                                     <div className="row align-items-center" >
   //                                        <div className="col-3">
   //                                           <img src={ele.image?.secure_url || "/profile1.png"} className={`img-fluid rounded-start  ${style.cardImage}`} alt="..." />
   //                                        </div>

   //                                        <div className="col-9 p-0">
   //                                           <div className={`card-body p-0 ${style.text}`}>
   //                                              <h6 className="card-title p-0 m-0">{ele.name} </h6>
   //                                              <p className="card-text p-0 m-0">Branch : {ele.branch?.name} </p>
   //                                              <p className='p-0 m-0'> <TimeAgo createdAt={ele.createdAt}/></p>
   //                                           </div>
   //                                        </div>
   //                                     </div>
   //                               </div>
   //                            </Link>
   //                         ) 
   //                         : 
   //                         <h4>Not Exist Team Member. !</h4>
   //                      }
                        
   //                   </div>
   //          }
   //       </div>
   //    </Fragment>
   // )