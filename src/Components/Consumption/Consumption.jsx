import { Fragment, useContext, useEffect, useState } from 'react' ;
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext.js';
import { QuantityContext } from '../../Context/QuantityContext.js';
import TimeAgo from '../TimeAgo/TimeAgo.jsx';
import ItemConsumption from '../ItemConsumption/ItemConsumption.jsx';
import { ReportContext } from '../../Context/ReportContext.js';
import Loading from '../Loading/Loading.jsx';
import style from "./consumption.module.css"

export default function Consumption() {
   const[show , setShow] = useState("add") ;
   
   const{ getBranchQuantities , quantities , loading , getConsumption , consumption , checkConsumption} = useContext(QuantityContext) ;
   const{loggedUser} = useContext(UserContext) ;
   const {getCurrentConsumption ,  getAllConsumption , loginData , loading:loadingFile} = useContext(ReportContext) ;

   


   
   function handleShow (data){
      if(data === "get"){
         getConsumption() ;
      }
      setShow(data)
   }
   function handleCheckedConsumption(id){
      checkConsumption(id) ;
      
   }
   function handleSearch(search){
      if(search.length >= 3){
         getBranchQuantities(search.toLowerCase()) ;
      }else if(search.length === 0){
         getBranchQuantities("") ;
      }
   }

   useEffect(() => {
      getBranchQuantities("") ;
   }, [loggedUser])
   
   return (
      <Fragment>
         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item p-0"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Consumption</li>
            </ol>
         </nav>

         
         <div className='d-flex justify-content-evenly my-5'>
            <button className='btn bg-main ' onClick={()=>{handleShow("add")}}>Add Consumption</button>
            <button className='btn bg-main position-relative' onClick={()=>{handleShow("get")}}>
               All Consumption

               {loginData.consumption? 
                     <span className={`${style.notificationCount} d-flex justify-content-center align-item-center position-absolute  z-1 translate-middle badge rounded-pill bg-danger`}>
                        {loginData.consumption}
                     </span>
                  : 
                  ""
               }

            </button>
         </div>




         {show === "add"? 
               <div className='container my-5'>
                  <h1>Consumption</h1>

                  <div className=''>
                     <div className="mb-3">
                        <form >
                           <div className='position-relative'>
                              <input  type="search" onChange={(e) => handleSearch(e.target.value)}  className='form-control form-control-sm' id='search' placeholder='Search item more than 3 char'  name="search" />
                           </div>
                        </form>
                     </div>
                     {loading?
                           <Loading type="large" color="gray"/>
                        :
                        <>
                           <p>Please Add New Consumption :</p>
                           <p><i className="fa-solid fa-mug-saucer mx-2"></i> Item Count  : {quantities.length || 0}</p>
                           {
                              quantities.length?
                                 quantities.map((ele)=> <ItemConsumption key={ele._id} ele={ele}/>)
                              : <p className='text-danger fw-bold'>Consumption List Is Empty</p>
                           }
                        </>
                     }

                  </div>
               </div>
            : 
               ""
         }




         {show === "get"? 
               <div className='container my-5'>
                  <h1>Consumption</h1>

                  <div className=''>
                     <div className='row g-1 mb-1'>
                        {loadingFile? 
                              <div className="col-4">
                                 <button className="btn bg-main btn-sm w-100"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                              </div>
                           :
                           <>
                              <div className="col-2">
                                 <button onClick={()=>{getCurrentConsumption("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                              </div>
                              <div className="col-2">
                                 <button onClick={()=>{getCurrentConsumption("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                              </div>
                           </>
                        }
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الأستهلاك الحالى</button>
                        </div>
                     </div>



                     <div className='row g-1 mb-5'>
                        {loadingFile? 
                              <div className="col-4">
                                 <button className="btn bg-main btn-sm w-100"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                              </div>
                           :
                           <>
                              <div className="col-2">
                                 <button onClick={()=>{getAllConsumption("download")}} className='btn btn-danger btn-sm w-100' ><i className="fa-solid fa-download"></i></button>
                              </div>
                              <div className="col-2">
                                 <button onClick={()=>{getAllConsumption("seen")}} className='btn btn-success btn-sm w-100'><i className="fa-solid fa-eye"></i></button>
                              </div>
                           </>
                        }
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الأستهلاك الكلى</button>
                        </div>
                     </div>


                     {loading?
                           <Loading type="large" color="gray"/>
                        :
                        <>
                           <p> All Consumption Branch <span className='text-primary'>{consumption[0]?.branch.name}</span> :</p>
                           <p><i className="fa-solid fa-mug-saucer mx-2"></i> Item Count  : {consumption.length || 0}</p>
                           {
                              consumption.length? 
                                 consumption.map((ele)=>
                                    <div key={ele._id} className={`${style.quantityCart} container border border-2 rounded-2 my-3 py-2 p-0`}>
                                       <div className={`${style.title} row align-item-center mx-4 `}>
                                          <p className='col-10 text-success p-0 m-0'><i className="fa-solid fa-trophy me-2"></i>{ele.item?.name}</p>
                                          <p className='col-2 p-0 m-0'>
                                             <TimeAgo createdAt={ele.createdAt} showTimeOnly={true}/>
                                          </p>
                                       </div>

                                       <div>
                                          <table className="table order-table table-sm text-center">
                                             <thead>
                                                <tr>
                                                   <th>Code</th>
                                                   <th>Quantity</th>
                                                   <th>Expired</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                   <tr>
                                                      <td>{ele.item?.item_s_code}</td>
                                                      <td>{ele.quantity_consumed}</td>
                                                      <td className={`${style.expired}`}>{new Date(ele.expired_date).toISOString().slice(0, 10)}  {ele.expired_date < Date.now()? <span className='fw-bold mx-4 text-danger'>Expired</span> : ""}</td>
                                                   </tr>
                                             </tbody>
                                                <tfoot>
                                                   <tr>
                                                      <td colspan="4"  className='m-0 p-0'>
                                                         <button className='btn btn-sm btn-success w-75 p-0 my-0' onClick={()=>{handleCheckedConsumption(ele.item._id)}}>Consumped Checked ✔</button>
                                                      </td>
                                                   </tr>
                                                </tfoot>
                                          </table>
                                       </div>
                                    </div>
                                 )
                              : <p className='text-danger fw-bold'>Consumption List Is Empty</p>

                           }
                        </>
                     }

                  </div>
               </div>
            : 
            ""
         }
      </Fragment>
   )
}
