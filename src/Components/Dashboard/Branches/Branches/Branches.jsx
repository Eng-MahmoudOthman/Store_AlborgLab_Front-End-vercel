import { Fragment, useContext, useEffect } from 'react' ;
import CustomTitle from '../../../CustomTitle/CustomTitle.jsx';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CompanyContext } from '../../../../Context/CompanyContext.js';
import { BranchContext } from '../../../../Context/BranchContext.js';
import TimeAgo from '../../../TimeAgo/TimeAgo.jsx';
import Loading from '../../../Loading/Loading.jsx';
import AddBranches from "../AddBranches/AddBranches.jsx";
import style from "./branches.module.css" ;

export default function Branches() {
      const{getBranches , branchesCount ,userLoading  , getUsersSpecificBranch ,deleteLoading ,deleteBranch, branches , loading} = useContext(BranchContext);
      const{getCompanies , companies} = useContext(CompanyContext);
   
   
   
      function handleSearch(search){
         if(search.length >= 3){
            getBranches(search.toLowerCase()) ;
         }else if(search.length === 0){
            getBranches("") ;
         }
      } ;

   
      function handleDeletedBranch(id  , role){
   
         Swal.fire({
            title:"Delete This Branch? Are you sure?" ,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
         }).then((result) => {
            if (result.isConfirmed) {
               deleteBranch(id) ;
               Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success"
               });
            }
         });
      } ;
   

      async function handleBranchUsers(id){
         const users = await getUsersSpecificBranch(id) ;
         const usersList = users?.length?users
         .map((ele, index) =>`${index + 1}- ${ele.name}<br>ID: ${ele.employeeCode}<br>Phone: ${ele.phone}<br>Email: ${ele.email}`)
         .join("<hr>"):"No Users Found For This Branch" ; 

         Swal.fire({
         title: "Users List" ,
         html: usersList, // نستخدم html بدل text عشان التنسيق
         icon: "info",
         confirmButtonText: "OK" ,
         });         
      } ;
   
   
   
      useEffect(() => {
         getBranches("") ;
         getCompanies();
      }, [])


   return (
      <Fragment>
         <CustomTitle title="Branches Dashboard" />

         <nav aria-label="breadcrumb" className='container  bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item"><Link className="text-primary" to="/Dashboard">Dashboard</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Branches Dashboard</li>
            </ol>
         </nav>

         <div className='container'>
            <h1 className='main-header my-4'>Branches</h1>

            <div className="mb-1">
               <form >
                  <div className='position-relative'>
                     <input  type="search" onChange={(e) => handleSearch(e.target.value)}  className='form-control' id='search' placeholder='Search Branches more than 3 char'  name="search" />
                  </div>
               </form>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
               <p className='m-0 p-0 mx-3'><i className="fa-solid fa-mug-saucer mx-2"></i> Branches Count  : <span className='fw-bold text-success'>{branches.length || 0}</span> From <span className='fw-bold text-danger'>{branchesCount}</span></p>
               <p data-bs-toggle="modal" data-bs-target="#AddBranch" className='m-0 p-0 mx-3'><i className="fa-solid fa-plus fs-3 main-color"></i></p>
            </div>
               <AddBranches companies={companies}/>

            {loading? 
                  <Loading type="large" color="gray"/> 
               : 
               <>
                  {branches.length? 
                     branches.map((ele)=>
                        <div key={ele._id} className={`${style.card} border border-2 rounded-2 m-3 p-2  position-relative overflow-hidden `}>
                           <div className={``}>
                              <p className='m-0 p-0 d-flex justify-content-between'><span className='fw-bold'>Num: {ele.itemNumber || 1000}</span> <TimeAgo  showTimeOnly={true} createdAt={ele.createdAt} /></p>
                              <p className='m-0 p-0'><span className='fw-bold'>Name: </span>{ele.name}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>Phone: </span>{ele.phone}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>Email: </span>{ele.email}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>Company: </span>{ele.company.name}</p>
                              <p className='m-0 p-0 '><span className='fw-bold'>Created At : </span>{new Date(ele.createdAt).toISOString().slice(0, 10)}</p>
                              <p className='m-0 p-0 '><span className='fw-bold'>Added By: </span>{ele.createdBy?.name || "Super Admin"}</p>
                           </div>

                           <div className={`${style.sidIcon} text-center rounded-2 position-absolute text-info bg-info-subtle`}>
                              <p  className='m-0 p-0 my-2'>
                                 {
                                    userLoading?
                                    <Loading type="icon" color="gray"/> 
                                    :
                                    <i onClick={()=>{handleBranchUsers(ele._id)}} className={`fa-solid fa-circle-user text-success`} ></i>
                                 }
                              </p>


                              <p  className='m-0 p-0 my-2'><i className="fa-solid fa-code-branch text-body-secondary"></i></p>


                              <p className='m-0 p-0 my-2'><i  className="fa-solid fa-pen-to-square text-body-secondary"></i></p>

                              
                              {
                                 deleteLoading?
                                    <p className='m-0 p-0 my-2'> <Loading type="icon" color="gray" /> </p>
                                 :
                                    <p onClick={()=>{handleDeletedBranch(ele._id)}}><i className="fa-solid fa-trash text-danger"></i></p>
                              }
                           </div>
                        </div>
                     )
                     : ""
                  }
               </>

            
            }


         </div>
      </Fragment>
   )
}
