import { Fragment, useContext, useEffect, useState } from 'react';
import TimeAgo from '../TimeAgo/TimeAgo.jsx';
import UploadOrderFile from "../UploadOrderFile/UploadOrderFile.jsx"
import style from "./orderLoggedBranch.module.css" ;
import { OrderContext } from '../../Context/OrderContext.js';
import Swal from 'sweetalert2';
import { ReportContext } from '../../Context/ReportContext.js';
import Loading from '../Loading/Loading.jsx';
import LoadingPopup from '../LoadingPopup/LoadingPopup.jsx';
import { Link } from 'react-router-dom';






export default function OrderLoggedBranch() {
      const[status , setStatus] = useState("")
      const {getLoggedOrders , orders , deleteOrder , loading} = useContext(OrderContext) ;
      const {getOrdersPDF , showPopup , setShowPopup , getSpecificOrderPDF , getOrderBarcodePDF ,loading:loadingFile} = useContext(ReportContext) ;



      const handleSpecificOrderPDF = (status , id)=>{
         getSpecificOrderPDF(status , id);
      }
      function handleSearch(search){
         if(search.length >= 3){
            getLoggedOrders(search.toLowerCase()) ;
         }else if(search.length === 0){
            getLoggedOrders("") ;
         }
      }



      const showImageProfile = (url)=>{
         Swal.fire({
            imageUrl:  url ,
            imageHeight: 700,
            imageAlt: "A tall image"
         });
      }


   function handleDeleteOrder(id){
      Swal.fire({
         title:"Delete this Order? Are you sure?" ,
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
      }).then((result) => {
         if (result.isConfirmed) {
            deleteOrder(id) ;
            Swal.fire({
               title: "Deleted!",
               text: "Your file has been deleted.",
               icon: "success"
            });
         }
      });
   }


      useEffect(() => {
         getLoggedOrders("") ;
         setShowPopup(false) ;
      }, [])

   return (
      <Fragment>
         <div className='container'>
            <h1 className='main-header my-4'>جميع الطلبيات السابقة </h1>

            <div className="mb-1">
               <form >
                  <div className='position-relative'>
                     <input  type="search" onChange={(e) => handleSearch(e.target.value)}  className='form-control' id='search' placeholder='Search Order more than 3 char'  name="search" />
                  </div>
               </form>
            </div>
            <LoadingPopup show={showPopup} onClose={() => setShowPopup(false)} />

            <div className='row g-1 mb-5'>
               {loadingFile? 
                     <div className="col-4">
                        <button className="btn bg-main btn-sm w-100"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                     </div>
                  :
                  <>
                     <div className="col-2">
                        <button onClick={()=>{getOrdersPDF("download")}} className='btn btn-danger btn-sm w-100' ><i className="fa-solid fa-download"></i></button>
                     </div>
                     <div className="col-2">
                        <button onClick={()=>{getOrdersPDF("seen")}} className='btn btn-success btn-sm w-100'><i className="fa-solid fa-print"></i></button>
                     </div>
                  </>
               }

               <div className="col-8">
                  <button className='btn bg-main btn-sm w-100'>جرد جميع الطلبيات </button>
               </div>
            </div>

            <p><i className="fa-solid fa-mug-saucer mx-2"></i> Order Count  : {orders.length || 0}</p>

            {loading? 
                  <Loading type="large" color="gray"/> 
               : 
               <>
                  {
                     orders.length? 
                        orders.map((ele)=>
                           <div key={ele._id} className={`${style.orderCart} container border border-2 rounded-2 my-3 p-1  position-relative`}>
                              <div className={`${style.title} row align-item-center mx-2`}>
                                 <p className='col-7 text-danger'>{ele.title}</p>
                                 <p className='col-2 text-danger'>{ele.delivery_number}</p>
                                 <p className='col-3 p-0 m-0 '>
                                    <TimeAgo createdAt={ele.createdAt} showTimeOnly={true}/>
                                 </p>
                              </div>


                              <div>
                                 <details className='text-center'>
                                    <p className='m-0 p-0'>Created At : {new Date(ele.createdAt).toISOString().slice(0, 10)}</p>
                                    <p className='m-0 p-0'>Created By : {ele.createdBy?.name}</p>
                                    <summary className={`m-auto w-50 bg-main mb-1`} >Details <span className='d-inline-block mx-3'>[ {ele.orderItems.length} ]</span> Num: {ele.itemNumber}</summary>
                                    <div className='row justify-content-evenly my-2 p-2'>
                                       {loadingFile? 
                                             <div className="col-12">
                                                <button className="btn bg-main btn-sm w-75 m-auto p-1 "> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                             </div>
                                          :
                                          <>
                                             {/* <div className="col-4">
                                                <button onClick={()=>{handleSpecificOrderPDF("download" , ele._id)}} className='btn btn-danger btn-sm w-100 p-0' >Download<i className="fa-solid fa-download mx-1"></i></button>
                                             </div>
                                             <div className="col-4">
                                                <button onClick={()=>{handleSpecificOrderPDF("seen" , ele._id)}} className='btn btn-success btn-sm w-100 p-0'>Print<i className="fa-solid fa-eye mx-1"></i></button>
                                             </div>
                                             <div className="col-4">
                                                <button onClick={()=>{getOrderBarcodePDF(ele._id)}} className='btn btn-info btn-sm w-100 p-0'>Barcode<i className="fa-solid fa-barcode mx-1"></i></button>
                                             </div> */}
                                             <div className="btn-group" role="group" aria-label="Basic outlined example">
                                                <button onClick={()=>{handleSpecificOrderPDF("download" , ele._id)}} type="button" className="btn btn-sm btn-outline-success"><i className="fa-solid fa-download mx-1"></i></button>
                                                <button onClick={()=>{handleSpecificOrderPDF("seen" , ele._id)}}  type="button" className="btn btn-sm btn-outline-success"><i className="fa-solid fa-print mx-1"></i></button>
                                                <button onClick={()=>{getOrderBarcodePDF(ele._id)}} type="button" className="btn btn-sm btn-outline-success"><i className="fa-solid fa-barcode mx-1"></i></button>
                                             </div>
                                          </>
                                       }
                                    </div>

                                    <div className={`${style.cardItems} `}>
                                       <table className="table order-table table-sm ">
                                          <thead>
                                             <tr>
                                                <th>Item</th>
                                                <th>Code</th>
                                                <th>Quantity</th>
                                                <th>Expired</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {ele.orderItems.map((order) => (
                                                <tr key={order.itemName}>
                                                   <td>{order.itemName}</td>
                                                   <td>{order.item_s_code}</td>
                                                   <td>{order.item_quantity}</td>
                                                   <td className={`${style.expired}`}>{new Date(order.expired_date).toISOString().slice(0, 10)}</td>
                                                </tr>
                                             ))}
                                          </tbody>
                                       </table>


                                       <div>
                                          <button onClick={()=>{setStatus("add")}} className={`${style.btnItem} btn btn-success  m-1 p-0  ${style.showBtn}`}>Upload File</button>
                                          {ele.pdf?.secure_url?
                                                <button  className={`${style.btnItem} btn btn-success m-1 p-0  ${style.showBtn}`}>
                                                   <Link target='_blank' to={ele.pdf?.secure_url}>Show File</Link>
                                                </button>
                                             :
                                                ""
                                          }

                                       </div>
                                       {status === "add"? 
                                          <div>
                                             <UploadOrderFile orderId={ele._id}/>
                                          </div> : ""
                                       }
                                       {/* {status === "display"? 
                                          <div>
                                             <div className='overflow-scroll py-3 px-2' style={{ display: 'flex', gap: '10px'}}>
                                                {ele.images.length? ele.images.map(({secure_url}, i) => (
                                                   <img key={i} src={secure_url} alt={`orderImage-${i}`} width={150} 
                                                      onClick={()=>{showImageProfile(secure_url)}}
                                                      onError={(e) => {
                                                         e.target.onerror = null ; // علشان ميعملش loop
                                                      }}
                                                   />
                                                )) : <p className='col-12 text-danger fs-6 fw-bold'>لا يوجد اى صور خاصة بهذة الطلبية لعرضها</p>}
                                             </div>
                                          </div> : "" 
                                       } */}
                                    </div>
                                 </details>
                              </div>


                              <div onClick={()=>{handleDeleteOrder(ele._id)}}  className={`${style.sidIcon} p-2 text-center rounded-2 position-absolute text-danger bg-danger-subtle`}>
                                 <p className='m-0 p-0'>
                                    <i className="fa-solid fa-trash"></i>
                                 </p>                             
                              </div>
                           </div>
                        )
                     : <p className='text-danger fw-bold'>Orders List Is Empty</p>

                  }
               </>

            
            }


         </div>
      </Fragment>
   )
}
