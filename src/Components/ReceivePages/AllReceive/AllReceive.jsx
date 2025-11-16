import { Fragment, useContext, useEffect } from 'react' ;
import style from "./allReceive.module.css"
import Loading from '../../Loading/Loading.jsx';
import { QuantityContext } from '../../../Context/QuantityContext.js';
import { ReportContext } from '../../../Context/ReportContext.js';
import TimeAgo from '../../TimeAgo/TimeAgo.jsx';

export default function AllReceive() {
   const {getReceive , receive , loadingTransfer} = useContext(QuantityContext) ;
   const {getReceivePDF , loading:loadingFile} = useContext(ReportContext) ;
   

   useEffect(() => {
      getReceive("receive") ;
   }, []) ;


   return (
      <Fragment>
         <div className='container'>
            <div className='row g-1 mb-2'>
               {loadingFile? 
                     <div className="col-4">
                        <button className="btn bg-main btn-sm w-100"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                     </div>
                  :
                  <>
                     <div className="col-2">
                        <button onClick={()=>{getReceivePDF("download" , "receive")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                     </div>
                     <div className="col-2">
                        <button onClick={()=>{getReceivePDF("seen" , "receive")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                     </div>
                  </>
               }

               <div className="col-8">
                  <button className='btn bg-main btn-sm w-100'>جميع طلبات التحويل </button>
               </div>
            </div>

            <h2 className='h4'>All Receive :</h2>
            <p><i class="fa-solid fa-mug-saucer mx-2"></i> Receive Count  : {receive.length || 0}</p>

            {loadingTransfer? 
                  <Loading type="large" color="gray"/> 
               : 
               <>
               <h5>{receive.length? "Items Receive" :"Empty Items Receive"}</h5>
               {receive.length? 
                  receive.map((ele)=>                  
                     <div key={ele._id} className={`${style.orderCart} border border-2 rounded-2 my-2 p-1`}>
                        <p className='fw-bold p-0 m-0 text-center'>{ele.item?.name}</p>
                        <div className={`${style.title} d-flex justify-content-between align-item-center  mx-2`}>
                           <p className='col-2 p-0 m-0'>{ele.itemNumber}</p>
                           <p className='col-4 p-0 m-0'>{ele.item?.item_s_code}</p>
                           <p className='col-3 p-0 m-0'>QTY:{ele.quantity_transferred}</p>
                           <p className='col-3 p-0 m-0 '>
                              <TimeAgo createdAt={ele.createdAt} showTimeOnly={true}/>
                           </p>
                        </div>


                        <div>
                           <details className='text-center'>
                              <p>Created At : {new Date(ele.createdAt).toISOString().slice(0, 10)}</p>
                              <summary className={`m-auto w-50 bg-main mb-1`} >Details ||<span className='d-inline-block mx-3 fw-bold '> {ele.status}</span></summary>
                              <div className={`${style.cardItems} `}>
                                 <table className="table order-table table-sm ">
                                    <thead>
                                       <tr>
                                          <th>Sender</th>
                                          <th>Receive</th>
                                          <th>Status</th>
                                          <th>Expired</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <td>{ele.sender_branch?.name}</td>
                                          <td>{ele.receiver_branch?.name}</td>
                                          <td>{ele.status === "cancel"?<span className='text-danger'>{ele.status} </span> : ele.status}</td>
                                          <td className={`${style.expired}`}>{new Date(ele.expired_date).toISOString().slice(0, 10)}</td>
                                       </tr>
                                       <tr>
                                          <td>{ele.createdBy?.name.toLowerCase().split(" ").map(word => word.charAt(0)?.toUpperCase() + word.slice(1)).slice(0,2).join(" ")}</td>
                                          <td>{ele.receivedUser?ele.receivedUser?.name.toLowerCase().split(" ").map(word => word.charAt(0)?.toUpperCase() + word.slice(1)).slice(0,2).join(" "):"Not Received"}</td>
                                          <td>{ele.status === "cancel"?<span className='text-danger'>{ele.status} </span> : ele.status}</td>
                                          <td className={`${style.expired}`}>{new Date(ele.expired_date).toISOString().slice(0, 10)}</td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>
                              <p>{ele.message}</p>
                           </details>
                        </div>
                     </div>)
                  : <p className='text-danger fw-bold'>Receive List Is Empty</p>
                  

               }
               </>            
            }

         </div>
      </Fragment>
   )
}
