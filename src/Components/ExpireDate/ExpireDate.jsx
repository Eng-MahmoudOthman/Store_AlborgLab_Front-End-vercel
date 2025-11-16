import { Fragment, useContext, useEffect } from 'react' ;
import style from "./expireDate.module.css" ;
import { Link } from 'react-router-dom';
import { QuantityContext } from '../../Context/QuantityContext.js';
import TimeAgo from '../TimeAgo/TimeAgo.jsx';
import { useState } from 'react';
import { ReportContext } from '../../Context/ReportContext.js';
import Loading from '../Loading/Loading.jsx';





export default function ExpireDate() {
   const[isLoading , setIsLoading] = useState() ;
   const{ getBranchQuantitiesExpired , quantityExpired  , deleteQuantityExpired , loading} = useContext(QuantityContext) ;
   const {getExpiredQuantity , loading:loadingFile} = useContext(ReportContext) ;
   


   function handleSearch(search){
      if(search.length > 3){
         getBranchQuantitiesExpired(search.toLowerCase()) ;
      }else{
         getBranchQuantitiesExpired("") ;
      }
   } ;

   async function handleDelete(id){
      setIsLoading(true)
      await deleteQuantityExpired(id) ;
      setIsLoading(false)
   }



   useEffect(() => {
      getBranchQuantitiesExpired("") ;
   }, [])

   return (
      <Fragment>
         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item active" aria-current="page">ExpireDate</li>
            </ol>
         </nav>

         <div className='container my-5'>
            <h1>Expired Date</h1>
            <div className=''>
               <div className="mb-1">
                  <form >
                     <div className='position-relative'>
                        <input  type="search" onChange={(e) => handleSearch(e.target.value)}  className='form-control' id='search' placeholder='Search item more than 3 char'  name="search" />
                     </div>
                  </form>
               </div>

               <div className='row g-1 mb-5'>
                  {loadingFile? 
                        <div className="col-4">
                           <button className="btn bg-main btn-sm w-100"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                        </div>
                     :
                     <>
                        <div className="col-2">
                           <button onClick={()=>{getExpiredQuantity("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getExpiredQuantity("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                     </>
                  }
                  <div className="col-8">
                     <button className='btn bg-main btn-sm w-100'>جرد الاصناف منتهية الصلاحية</button>
                  </div>
               </div>


               {loading?
                        <Loading type="large" color="gray"/> 
                     :
                     <>
                        <p><i class="fa-solid fa-mug-saucer mx-2"></i> Item Count  : {quantityExpired.length || 0}</p>
                        <div>
                           <h4>{quantityExpired.length? "Items Expired" :"Empty Items Expired"}</h4>
                           {
                              quantityExpired.length ?
                                 quantityExpired.map((ele)=>
                                    <div key={ele._id} className={`${style.quantityCart} container border border-2 rounded-2 my-3 p-0`}>
                                       <div className={`${style.title} row align-item-center mx-2`}>
                                          <p className='col-10 text-danger p-0 m-0'><i class="fa-solid fa-clock-rotate-left mx-2"></i>{ele.name}</p>
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
                                                   <th>Delivery</th>
                                                   <th>Expired</th>
                                                </tr>
                                             </thead>
                                             <tbody>
                                                   <tr key={ele.name}>
                                                      <td className='text-primary fw-bold'>{ele.item?.item_s_code}</td>
                                                      <td>{ele.item_quantity}</td>
                                                      <td>{ele.delivery_number}</td>
                                                      <td className='bg-danger text-white fw-bold'>{new Date(ele.expired_date).toISOString().slice(0, 10)}</td>
                                                   </tr>
                                             </tbody>
                                             <tfoot>
                                                <tr>
                                                   <td colspan="4">
                                                      {isLoading ? 
                                                            <button className="btn btn-sm btn-danger w-75 p-0 my-2"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                                            // <button className="btn btn-sm btn-danger w-75 p-0 my-2"> <i className="fa-solid fa-spinner fa-spin fa-rotate-180 fa-xl"></i></button>
                                                         : 
                                                            <button onClick={()=>{handleDelete(ele._id)}} className='btn btn-sm btn-danger w-75 p-0 my-2'>Delete<i class="fa-solid fa-trash-can mx-2"></i> </button>
                                                      }
                                                   </td>
                                                </tr>
                                             </tfoot>
                                          </table>
                                       </div>
                                    </div>
                                 )
                              : <p className='text-danger fw-bold'>Expired Quantity List Is Empty</p>
                           }
                        </div> 
                     </>
               }

            </div>
         </div>
      </Fragment>
   )
}
