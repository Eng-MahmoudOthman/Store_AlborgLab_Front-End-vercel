
import { Fragment, useContext, useEffect, useState } from 'react';
import { ReportContext } from '../../../Context/ReportContext.js';
import AddTransfer from '../AddTransfer/AddTransfer.jsx';
import CurrentTransfer from '../CurrentTransfer/CurrentTransfer.jsx';
import AllTransfer from '../AllTransfer/AllTransfer.jsx';
import { BranchContext } from '../../../Context/BranchContext.js';
import { UserContext } from '../../../Context/UserContext.js';
import style from "./transfer.module.css" ;
import { Link } from 'react-router-dom';






export default function Transfer() {
      const[display , setDisplay]=useState("add")
      const {loginData } = useContext(ReportContext) ;
      const {loggedUser }= useContext(UserContext) ;


      const{getAllBranches , branches , loading:loadingBranch} = useContext(BranchContext);



      function handleShow(data){
         if(data === "add"){
            setDisplay("add")
         }else if(data === "transfer"){
            setDisplay("transfer")
         }else if(data === "all"){
            setDisplay("all")
         }
      }

      
      useEffect(() => {
         if(loggedUser){
            getAllBranches(loggedUser?.companyId , "true") ;
         }
      }, [loggedUser]) ;
   return (
      <Fragment>
         <div className='container'>
               <nav aria-label="breadcrumb" className='container bg-body-secondary'>
                  <ol className="breadcrumb ">
                     <li className="breadcrumb-item "><Link className="text-primary" to="/">Home</Link></li>
                     <li className="breadcrumb-item active " aria-current="page">Transfer</li>
                  </ol>
               </nav>
               <h1 className='main-header  my-4'>Transfer Items</h1>

               <div className="btn-group my-2 w-100" role="group" aria-label="Basic radio toggle button group">
                  <input onClick={()=>{handleShow("add")}} type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
                  <label className="btn bg-main" htmlFor="btnradio1">Add Transfer</label>
                  
                  <input onClick={()=>{handleShow("transfer")}} type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                  <label className="btn bg-main mx-1 position-relative" htmlFor="btnradio2">
                     Current
                     {loginData?.transfer?
                           <span className={`${style.notificationCount} d-flex justify-content-center align-item-center position-absolute z-1 translate-middle badge rounded-pill bg-danger`}>
                              {loginData?.transfer}
                           </span>
                        :
                           ""
                     }

                  </label>

                  <input onClick={()=>{handleShow("all")}} type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                  <label className="btn bg-main" htmlFor="btnradio3">All Transfer</label>
               </div>

               {display === "add"? <AddTransfer branches={branches} loadingBranch={loadingBranch}/>:""}
               {display === "transfer"? <CurrentTransfer/>:""}
               {display === "all"? <AllTransfer/>:""}
         </div>
      </Fragment>
   )
}
