import { Fragment, useContext, useEffect, useMemo, useState } from 'react' ;
import style from "./inventory.module.css" ;
import { Link } from 'react-router-dom';
import { QuantityContext } from '../../Context/QuantityContext.js';
import TimeAgo from '../TimeAgo/TimeAgo.jsx';
import { UserContext } from '../../Context/UserContext.js';
import { ReportContext } from '../../Context/ReportContext.js';
import Loading from '../Loading/Loading.jsx';
import Swal from 'sweetalert2';
import LoadingPopup from '../LoadingPopup/LoadingPopup.jsx';
import UpdateQuantity from '../UpdateQuantity/UpdateQuantity.jsx';



export default function Inventory() {
   const [selectedId, setSelectedId] = useState(null);

   const{ getBranchQuantities , getCategories , categories , quantities , getQuantityBarcode , loadingBarcode , deleteQuantity , loading } = useContext(QuantityContext) ;
   const {getAllQuantity  , showPopup , setShowPopup , getExpiredQuantityCurrentMonth , loginData , loading:loadingFile} = useContext(ReportContext) ;
   const{loggedUser} = useContext(UserContext) ;
   
   const[show , setShow] = useState("all") ;
   const [filter, setFilter] = useState("");
   const[categoryName , setCategoryName] = useState("All Quantities") ;


   function handleShow (data){
      if(data === "all"){
         getBranchQuantities(""   , "false") ;
         setShow(data)
      }else if(data === "expired"){
         getBranchQuantities(""  , "true") ;
         setShow(data)
      }
   }
   function handleSearch(search){
      if(search.length > 3){
         getBranchQuantities(search.toLowerCase()  , "false") ;
      }else if(search.length === 0){
         getBranchQuantities(""  , "false") ;
      }
   } ;
   function handleCategory(e){
      const category = e.target.value && (e.target.value.split("-")[0]) ;
      setFilter(category) ;
      
      const categoryName = e.target.value &&  (e.target.value.split("-")[1]) ;
      setCategoryName(categoryName && (categoryName.charAt(0).toUpperCase() + categoryName.split("").slice(1).join(""))) ;

   } ;


   function handleDeleteQuantity(id){
      Swal.fire({
         title:"Delete this Quantity? Are you sure?" ,
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
      }).then((result) => {
         if (result.isConfirmed) {
            deleteQuantity(id) ;
            Swal.fire({
               title: "Deleted!",
               text: "Your file has been deleted.",
               icon: "success"
            });
         }
      });
   }


   async function handleBarcode(id){
      await getQuantityBarcode(id);
   }






   useEffect(() => {
      getBranchQuantities(""  , "false") ;
      setShowPopup(false) ;
   }, [loggedUser])
   useEffect(() => {
      getCategories(true);
   }, [])







   const filteredProducts = useMemo(() => {
      if (filter === "") return quantities;
      return quantities.filter(item => item.category === filter);
   }, [quantities, filter]);

   

   if(loadingBarcode) return <h1 className='mt-5'>Print Barcode Loading...</h1>
   return (
      <Fragment>
         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item p-0"><Link className="text-primary mx-1" to="/">Home</Link></li>
               <li className="breadcrumb-item active p-0" aria-current="page">Inventory</li>
            </ol>
         </nav>
         <LoadingPopup show={showPopup} onClose={() => setShowPopup(false)} />

                  <div className='d-flex justify-content-evenly my-5'>
                     <button className='btn bg-main ' onClick={()=>{handleShow("all")}}>All Items</button>
                     <button className='btn bg-main position-relative' onClick={()=>{handleShow("expired")}}>
                        Pre Expired
                        {loginData.expiredCurrentMonth? 
                              <span className={`${style.notificationCount} d-flex justify-content-center align-item-center position-absolute  z-1 translate-middle badge rounded-pill bg-danger`}>
                                 {loginData.expiredCurrentMonth}
                              </span>
                           :
                           ""
                        }

                     </button>
                  </div>
         
         
                  {show === "all"? 
                     <div className='container my-5'>
                        <h1>Inventory</h1>

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
                                          <button onClick={()=>{getAllQuantity("download" , filter)}} className='btn btn-danger btn-sm w-100' ><i className="fa-solid fa-download"></i></button>
                                       </div>
                                       <div className="col-2">
                                          <button onClick={()=>{getAllQuantity("seen" , filter)}} className='btn btn-success btn-sm w-100'><i className="fa-solid fa-print"></i></button>
                                       </div>
                                    </>
                                 }

                              <div className="col-8">
                                 <button className='btn bg-main btn-sm w-100'>جرد الاصناف</button>
                              </div>
                           </div>



                           {loading?
                                 <Loading type="large" color="gray"/> 
                              :
                              <>
                                 <h6>All Items Within  Branch <span className='text-primary'>{loggedUser?.branch}</span></h6>
                                 <p>Quantity : <span className='text-primary'>{categoryName? categoryName : "All Quantities"}</span> </p>
                                 <div>
                                    <select onChange={(e)=>{handleCategory(e)}} className='form-select'>
                                       <option disabled selected>Choose Category Filter</option>
                                       <option value="">All Quantity</option>
                                       {categories.map((ele)=><option value={ele._id +"-"+ ele.name}>{ele.name}</option>)}
                                    </select>
                                 </div>

                                 <p><i className="fa-solid fa-mug-saucer mx-2"></i> Item Count  : {filteredProducts.length || 0}</p>
                                 {
                                    filteredProducts.length?
                                       filteredProducts.map((ele)=>
                                          <div key={ele._id} className={`${style.quantityCart} container border border-2 rounded-2 my-3 p-1 p-0 position-relative`}>
                                             <div className={`${style.title} row align-item-center mx-2`}>
                                                <p className='col-10 text-success p-0 m-0'><i className="fa-solid fa-trophy mx-2"></i>{ele.name}</p>
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
                                                            <td className={ele.expired_date < Date.now()? "text-danger" : ""}>
                                                               {new Date(ele.expired_date).toISOString().slice(0, 10)}
                                                               {ele.expired_date < Date.now()? <span className='fw-bold mx-4'>Expired</span> : ""}
                                                            </td>
                                                         </tr>
                                                         <tr className='text-center  m-0 main-color'>
                                                            <i className="fa-solid main-color rounded-circle p-0 mx-1 fa-circle-user"></i>
                                                            Added By :{ele.createdBy.name}
                                                         </tr>
                                                   </tbody>
                                                </table>
                                             </div>

                                             <div className={`${style.sidIcon} text-center rounded-2 position-absolute text-danger bg-danger-subtle`}>
                                                <p onClick={() => setSelectedId(ele._id)} data-bs-toggle="modal" data-bs-target="#UpdateQuantity"  className='m-0 p-0 my-1'>
                                                   <i className="fa-solid fa-pen-to-square text-primary"></i>
                                                </p>

                                                <p onClick={()=>{handleBarcode(ele._id)}}  className='m-0 p-0 my-1'>
                                                   <i className="fa-solid fa-barcode text-success"></i>
                                                </p> 

                                                <p onClick={()=>{handleDeleteQuantity(ele._id)}}  className='m-0 p-0 my-2'>
                                                   <i className="fa-solid fa-trash"></i>
                                                </p> 
                                                
                                                
                                             </div>

                                          </div>
                                       ) 
                                    : <p className='text-danger fw-bold'>Quantity List Is Empty</p>
                                 }
                                 <UpdateQuantity id={selectedId} />
                              </>
                           }

                        </div>
                     </div>
                     : 
                     ""
                  }
         
         
         
         
                  {show === "expired"? 
                     <div className='container my-5'>
                        <h1>Inventory</h1>

                        <div className=''>
                           <div className='row g-1 mb-5'>

                                 {loadingFile? 
                                       <div className="col-4">
                                          <button className="btn bg-main btn-sm w-100"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                       </div>
                                    :
                                    <>
                                       <div className="col-2">
                                          <button onClick={()=>{getExpiredQuantityCurrentMonth("download")}} className='btn btn-danger btn-sm w-100' ><i className="fa-solid fa-download"></i></button>
                                       </div>
                                       <div className="col-2">
                                          <button onClick={()=>{getExpiredQuantityCurrentMonth("seen")}} className='btn btn-success btn-sm w-100'><i className="fa-solid fa-print"></i></button>
                                       </div>
                                    </>
                                 }
                              <div className="col-8">
                                 <button className='btn bg-main btn-sm w-100'>جرد الاصناف المنتهية خلال شهر</button>
                              </div>
                           </div>


                           {loading?
                                 <Loading type="large" color="gray"/> 
                              :
                              <>
                                 <h6>Before Expired Items Through Current Month</h6>
                                 <p><i className="fa-solid fa-mug-saucer mx-2"></i> Item Count  : {quantities?.length || 0}</p>

                                 {
                                    quantities.length?
                                       quantities.map((ele)=>
                                          <div key={ele._id} className={`${style.quantityCart} container border border-2 rounded-2 my-3 p-1`}>
                                             <div className={`${style.title} row align-item-center mx-2`}>
                                                <p className='col-10 text-success p-0 m-0'><i className="fa-solid fa-trophy mx-2"></i>{ele.name}</p>
                                                {/* <i className="fa-solid fa-bong"></i> */}
                                                {/* <i className="fa-solid fa-trophy"></i> */}
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
                                                            <td className={ele.expired_date < Date.now()? "text-danger" : ""}>
                                                               {new Date(ele.expired_date).toISOString().slice(0, 10)}
                                                               {ele.expired_date < Date.now()? <span className='fw-bold mx-4'>Expired</span> : ""}
                                                            </td>                                                      
                                                         </tr>
                                                   </tbody>
                                                </table>
                                             </div>
                                          </div>
                                       )
                                    : <p className='text-danger fw-bold'>Quantity Pre Expired List Is Empty</p>
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
