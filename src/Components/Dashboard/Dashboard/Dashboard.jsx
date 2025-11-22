import { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReportContext } from '../../../Context/ReportContext.js';
import CustomTitle from '../../CustomTitle/CustomTitle.jsx';
import style from "./dashboard.module.css" ;
import Loading from '../../Loading/Loading.jsx';






export default function Dashboard() {
   const {getAdminData , adminData , loading} = useContext(ReportContext)


   useEffect(() => {
      getAdminData();
   }, [])
   return (
      <Fragment>
         <CustomTitle title="Dashboard" />

         <div className='bg-body-secondary'>
            <h4 className='ps-2 p-2 m-0 main-color'>Dashboard</h4>
         </div>

         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
            </ol>
         </nav>

            {
               loading?
                  <div className='my-5'>
                     <Loading type="large" color="gray"/> 
                  </div>
               : 
                  <div className=''>
                     <div className='row g-1 justify-content-evenly align-items-center my-2'>
                        
                        <div className='col-5' >
                           <Link to="/Dashboard/Users">
                              <div className='d-flex justify-content-between align-item-center p-1 px-2 rounded-3 bg-danger-subtle '>
                                 <div className={`${style.icon} text-danger d-flex justify-content-center align-items-center fw-bold`}><i className={`fa-solid fa-users-line`}></i></div>
                                 <div className={`${style.text} text-danger d-flex justify-content-center align-items-center fw-bold`}>Users</div>
                                 <div className={`${style.count} text-danger d-flex justify-content-center align-items-center`}>
                                    <div className='m-0 p-0'>
                                       <p className='m-0 p-0'><i className="fa-solid fa-thumbs-up mx-1 "></i>{adminData.activeUsers || 0}</p>
                                       <p className='m-0 p-0'><i className="fa-solid fa-user mx-1"></i>{adminData.users || 0}</p>
                                    </div>
                                 </div>
                              </div>
                           </Link>
                        </div>


                        
                        <div className='col-5' >
                           <Link to="/Dashboard/Branches">
                              <div className='d-flex justify-content-between align-item-center py-3 px-2 rounded-3 bg-info-subtle '>
                                 <div className={`${style.icon} text-info d-flex justify-content-center align-items-center fw-bold`}><i className="fa-solid fa-code-branch"></i></div>
                                 <div className={`${style.text} text-info d-flex justify-content-center align-items-center fw-bold`}>Branches</div>
                                 <div className={`${style.count} text-info d-flex justify-content-center align-items-center`}>{adminData.branches || 0}</div>
                              </div>
                           </Link>
                        </div>

                        
                        <div className='col-5' >
                           <Link to="./Items">
                              <div className='d-flex justify-content-between align-item-center py-3 px-2 rounded-3 bg-primary-subtle '>
                                 <div className={`${style.icon} text-primary d-flex justify-content-center align-items-center fw-bold`}><i className="fa-solid fa-sitemap"></i></div>
                                 <div className={`${style.text} text-primary d-flex justify-content-center align-items-center fw-bold`}>Items</div>
                                 <div className={`${style.count} text-primary d-flex justify-content-center align-items-center`}>{adminData.items || 0}</div>
                              </div>
                           </Link>
                        </div>


                        
                        <div className='col-5' > 
                           <Link to="/Dashboard/Documents">
                              <div className='d-flex justify-content-between align-item-center py-3 px-2 rounded-3 bg-warning-subtle '>
                                 <div className={`${style.icon} text-warning d-flex justify-content-center align-items-center fw-bold`}><i className="fa-solid fa-file-pdf"></i></div>
                                 <div className={`${style.text} text-warning d-flex justify-content-center align-items-center fw-bold`}>Documents</div>
                                 <div className={`${style.count} text-warning d-flex justify-content-center align-items-center`}>{adminData.document || 0}</div>
                              </div>
                           </Link>
                        </div>

                        {/* <div className='col-5' >
                           <div className='d-flex justify-content-between align-item-center p-3 rounded-3 bg-primary-subtle '>
                              <div className={`${style.icon} text-primary d-flex justify-content-center align-items-center fw-bold`}><i className={`fa-solid fa-users-line`}></i></div>
                              <div className={`${style.text} text-primary d-flex justify-content-center align-items-center fw-bold`}>Setting</div>
                              <div className={`${style.count} text-primary d-flex justify-content-center align-items-center`}>258</div>
                           </div>
                        </div> */}
                     </div>
                  </div>
            }
      </Fragment>
   )
}
