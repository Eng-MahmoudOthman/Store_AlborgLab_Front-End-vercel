import { Fragment,  useState } from 'react';
import CurrentReceive from '../CurrentReceive/CurrentReceive.jsx';
import AllReceive from '../AllReceive/AllReceive.jsx';
import { Link } from 'react-router-dom';






export default function Receive() {
      const[display , setDisplay]=useState("receive")

      function handleShow(data){
         if(data === "receive"){
            setDisplay("receive")
         }else if(data === "all"){
            setDisplay("all")
         }
      }

   return (
      <Fragment>
         <div className='container'>
               <nav aria-label="breadcrumb" className='container bg-body-secondary'>
                  <ol className="breadcrumb ">
                     <li className="breadcrumb-item "><Link className="text-primary mx-1" to="/">Home</Link></li>
                     <li className="breadcrumb-item active" aria-current="page">Receive</li>
                  </ol>
               </nav>

               <h1 className='main-header  my-4'>Receive Items</h1>

               <div className="btn-group my-2 w-100" role="group" aria-label="Basic radio toggle button group">
                  <input onClick={()=>{handleShow("receive")}} type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                  <label className="btn bg-main mx-1" htmlFor="btnradio2">Current Receive</label>
                  <input onClick={()=>{handleShow("all")}} type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                  <label className="btn bg-main" htmlFor="btnradio3">All Receive</label>
               </div>

               {display === "receive"? <CurrentReceive/>:""}
               {display === "all"? <AllReceive/>:""}
         </div>
      </Fragment>
   )
}
