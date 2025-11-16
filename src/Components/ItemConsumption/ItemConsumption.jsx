import { Fragment, useContext, useState } from 'react' ;
import TimeAgo from '../TimeAgo/TimeAgo.jsx';
import { QuantityContext } from '../../Context/QuantityContext.js';
import Loading from '../Loading/Loading.jsx';
import style from "./itemConsumption.module.css" ;

export default function ItemConsumption({ele}) {
   const[countItem  , setCountItem] = useState(0) ;
   const[isLoading  , setIsLoading] = useState(false) ;
   const{addConsumption} = useContext(QuantityContext) ;
   




   function handleAddConsumption(id){
      setIsLoading(true) ;
      let values = {
         quantityId :id, 
         quantity_consumed: +countItem
      }
      addConsumption(values);
      setIsLoading(false) ;
   }
      

   return (
      <Fragment>
         <div  className={` container border border-2 rounded-2 my-3 p-0`}>
            <div className={`${style.title} row align-item-center mx-4 `}>
               <p className='col-10 text-success p-0 m-0'><i className="fa-solid fa-trophy me-2"></i>{ele.name}</p>
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
                        <tr key={ele.name}>
                           <td>{ele.item?.item_s_code}</td>
                           <td>{ele.item_quantity}</td>
                           <td>{new Date(ele.expired_date).toISOString().slice(0, 10)}  {ele.expired_date < Date.now()? <span className='fw-bold mx-4 text-danger'>Expired</span> : ""}</td>
                        </tr>
                  </tbody>
                     <tfoot>
                        <tr>
                           <td colspan="4">

                              <div className='d-flex justify-content-center align-items-center'>
                                 <button className='btn btn-sm btn-success px-3 my-2' onClick={()=>{setCountItem((prev)=> prev + 1)}}>+</button>
                                 <input type="number" onChange={(e)=>{setCountItem(e.target.value)}} value={countItem} className='mx-2 form-control w-25 p-0 text-center '/>
                                 <button className='btn btn-sm btn-success  px-3 my-2' onClick={()=>{setCountItem((prev)=> prev <= 0? 0 : prev - 1)}}>-</button>
                              </div>
                              {isLoading ? 
                                    <button className="btn btn-sm btn-success w-75 p-0 my-1"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                 : 
                                    <button className={`btn btn-sm w-75 p-1 my-1 ${ele.expired_date < Date.now()?"btn-danger":"btn-success"}`} onClick={()=>{handleAddConsumption(ele._id)}}>Consumped 🕗</button>
                              }
                           </td>
                        </tr>
                     </tfoot>
               </table>
            </div>
         </div>
      </Fragment>

   )
} ;