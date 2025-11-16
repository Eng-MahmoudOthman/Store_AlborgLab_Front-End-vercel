import { Fragment, useState } from 'react';
import ReceiveOrder from '../ReceiveOrder/ReceiveOrder.jsx';
import OrderLoggedBranch from '../OrderLoggedBranch/OrderLoggedBranch.jsx';
import { Link } from 'react-router-dom';

export default function Orders() {
   const[show , setShow] = useState("receive") ;


   function handleShow (data){
      setShow(data)
   }

   return (
      <Fragment>

         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Orders</li>
            </ol>
         </nav>


         <div className='d-flex justify-content-evenly my-5'>
            <button className='btn bg-main ' onClick={()=>{handleShow("receive")}}>Receive Order</button>
            <button className='btn bg-main ' onClick={()=>{handleShow("orders")}}>Show Orders</button>
         </div>


         {show === "receive"? 
            <div>
               <ReceiveOrder/>
            </div> 
            : 
            ""
         }




         {show === "orders"? 
            <div>
               <OrderLoggedBranch/>
            </div> 
            : 
            ""
         }
      </Fragment>
   )
}
