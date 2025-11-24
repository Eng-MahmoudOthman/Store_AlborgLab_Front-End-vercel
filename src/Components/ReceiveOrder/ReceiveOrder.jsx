import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import CustomTitle from "../CustomTitle/CustomTitle.jsx";
import Loading from "../Loading/Loading.jsx";
import notification from "../../Utilities/notification.js";
import { UserContext } from "../../Context/UserContext.js";
import style from "./receiveOrder.module.css";

// Refactored ReceiveOrder component
// - Clear separation of concerns
// - listItem = payload items (will be sent to backend)
// - listView = items used for rendering with display-only fields
// - products = global product list (never mutated on delete)
// - delete by index (keeps duplicates support)
// - debounced search, controlled add/remove

export default function ReceiveOrder() {
      const navigate = useNavigate();
      const { userToken } = React.useContext(UserContext);
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(false);
      const [scanBarcode, setScanBarcode] = useState(false);

      // products = all products from server (do NOT mutate this array)
      const [products, setProducts] = useState([]);

      // listItem: minimal payload objects that will be posted to server
      // e.g. { item: productId, item_quantity, expired_date }
      const [listItem, setListItem] = useState([]);

      // listView: richer objects used for rendering (name, sap, formatted date, ...)
      const [listView, setListView] = useState([]);

      // search
      const [searchTerm, setSearchTerm] = useState("");
      const [filteredItems, setFilteredItems] = useState([]);
      const [loadingSearch, setLoadingSearch] = useState(false);
      const searchDebounceRef = useRef(null);

      const submitBtnRef = useRef(null);

      // Compose header
      const header = useMemo(() => ({
         token: `${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`,
      }), [userToken]);

      // --------- API: fetch all products (on mount) ---------
      const getAllProducts = useCallback(async () => {
         try {
            const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/item?all=true` ,  {headers:header} );
            if (data?.message === "success") setProducts(data.items || []);
         } catch (err) {
            notification("error", err.response?.data?.message || "Failed to load products");
         }
      }, []);

      useEffect(() => {
         getAllProducts();
      }, [getAllProducts]);



      // --------- Helpers ---------
      const formatDisplayName = (name = "") => name.split(" ").slice(0, 7).join(" ");

      // delete by index (keeps duplicates behavior)
      const deleteByIndex = (index) => {
         setListItem((prev) => prev.filter((_, i) => i !== index));
         setListView((prev) => prev.filter((_, i) => i !== index));
      };

      // --------- Submit Order ---------
      const handleSubmitOrder = async (values) => {
         setLoading(true);
         setError(null);
         try {
            values.delivery_number = values.delivery_number.toString();
            const payload = { ...values, listItem };
            const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/order/createOrderBranch`, payload, { headers: header });
            if (data?.message === "success") {
               notification("success", "The Order Successfully Saved.");
               
               // reset local state on success
               setListItem([]);
               setListView([]);
               navigate("/home");
            }
         } catch (err) {
            setError(err.response?.data?.message || "Failed to save order");
            notification("error", err.response?.data?.message || "Failed to save order");
         } finally {
            setLoading(false);
         }
      };

      const orderValidation = Yup.object().shape({
         title: Yup.string().min(2, "Title Should be More than 2").max(30, "Title less than 100").required("Title is Required").trim(),
         delivery_number: Yup.number().required("Delivery Number is Required"),
      });

      const formikOrder = useFormik({
         initialValues: { title: "", delivery_number: "" },
         validationSchema: orderValidation,
         onSubmit: handleSubmitOrder,
      });



      // --------- Add item form ---------
      // Note: we accept duplicates. Each added item keeps its own expired_date and quantity.
      const addItemValidation = Yup.object().shape({
         item: Yup.string().required("Item is required"),
         item_quantity: Yup.number().min(0, "الكمية مينفعش تكون أقل من صفر").required("Quantity is required"),
         expired_date: Yup.string().required("Expired date is required"),
      });

      const handleAddItem = async (values, { resetForm }) => {
         try {
            // parse item value -> "id+name+code"
            const [id, name = "", code = ""] = (values.item || "").split("+");

            // validate expired date not in the past
            const expiredTime = new Date(values.expired_date).getTime();
            const now = new Date().getTime();
            if (now > expiredTime) {
               notification("error", "Expired Invalid, Please Enter Valid Expired.! ");
               return;
            }

            // create payload item (minimal)
            const payloadItem = {
               item: id,
               item_quantity: Number(values.item_quantity),
               expired_date: values.expired_date,
            };

            // append
            setListItem((prev) => [...prev, payloadItem]);

            // view item
            const viewItem = {
               item: id,
               name,
               sap: code,
               item_quantity: Number(values.item_quantity),
               expired_date: values.expired_date,
            };
            setListView((prev) => [...prev, viewItem]);


            // reset search and form
            setSearchTerm("");
            setFilteredItems([]);
            setScanBarcode(false);
            resetForm();
            playSound();
         } catch (err) {
            notification("error", "Failed to add item");
         }
      };

      const formikAddItem = useFormik({
         initialValues: { item: "", item_quantity: "", expired_date: "" },
         validationSchema: addItemValidation,
         onSubmit: handleAddItem,
      });


      // --------- Search logic (debounced) ---------
      const doSearch = useCallback(async (keyword) => {
         if (!keyword || keyword.trim().length < 3) {
            setFilteredItems([]);
            return;
         }
         setLoadingSearch(true);
         try {
            const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/item?keyword=${encodeURIComponent(keyword)}`);
            setFilteredItems(data.items || []);
         } catch (err) {
            console.error(err);
            setFilteredItems([]);
         } finally {
            setLoadingSearch(false);
         }
      }, []);

      useEffect(() => {
         // clear existing debounce
         if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
         // set new debounce
         searchDebounceRef.current = setTimeout(() => doSearch(searchTerm), 300);

         return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
         };
      }, [searchTerm, doSearch]);

      const handleSearchChange = (e) => {
         setSearchTerm(e.target.value.toLowerCase());
      };

      const handleSelectItem = (ele) => {
         formikAddItem.setFieldValue("item", `${ele._id}+${ele.name}+${ele.item_s_code}`);
         setSearchTerm(`${ele.item_s_code} - ${ele.name}`);
         setFilteredItems([]);
      };


      // expose submit button programmatically
      const triggerOrderSubmit = () => submitBtnRef.current?.click();


      // --------- derived values ---------
      const itemCount = listView.length;



      const playSound = () => {
         const audio = new Audio("/audio/order.mp3");
         audio.play();
      };

   // --------- Render ---------
   return (
      <Fragment>
         <CustomTitle title="Order Received" />
         <div className="container">
               <h1 className="main-header my-4">Receive Order</h1>
               <button className="btn btn-success" onClick={()=>{playSound()}}>Click</button>
               <p className="m-0"><i className="fa-solid fa-mug-saucer mx-2 main-color"></i> Item Count  : {itemCount || 0}</p>

               <div className="row">
                  <div className="col-md-8 offset-md-2">
                     <form onSubmit={formikOrder.handleSubmit}>
                     {error && <div className="alert alert-danger w-75 my-1">{error}</div>}

                     <div className="w-100 m-auto mb-2">
                        <label htmlFor="title">Order Title :</label>
                        <input
                           type="text"
                           id="title"
                           name="title"
                           maxLength={30}
                           required
                           className="form-control py-1"
                           placeholder="Enter Order Title"
                           value={formikOrder.values.title}
                           onChange={formikOrder.handleChange}
                           onBlur={formikOrder.handleBlur}
                        />
                        {formikOrder.errors.title && <div className="text-danger m-0 p-0">{formikOrder.errors.title}</div>}
                     </div>

                     <div className="w-100 m-auto mb-2">
                        <label htmlFor="delivery_number">Delivery Number :</label>
                        <input
                           type="number"
                           id="delivery_number"
                           name="delivery_number"
                           required
                           className="form-control py-1"
                           placeholder="Enter Delivery Number"
                           value={formikOrder.values.delivery_number}
                           onChange={formikOrder.handleChange}
                           onBlur={formikOrder.handleBlur}
                        />
                        {formikOrder.errors.delivery_number && <div className="text-danger m-0 p-0">{formikOrder.errors.delivery_number}</div>}
                     </div>

                     <div className={`${style.showItem}`}>
                        <div className={`${style.search_result} my-2 p-2 bg-body-tertiary rounded-2 overflow-auto `}>
                           {itemCount ? (
                           listView.map((ele, index) => (
                              <div key={`${ele.item}-${index}`} className="row justify-content-center align-item-center bg-white border rounded-1 p-1 ps-2 fw-bold m-0 my-1 text-success cursor ">
                                 <div className={`row col-10 p-0 m-0 ${style.orderItem}`}>
                                    <div className="col-12 m-0 p-0">
                                       <p className="text-center m-0 p-0">{formatDisplayName(ele.name)}</p>
                                    </div>
                                    <div className="col-4 m-0 p-0 text-start">
                                       <span>{ele.sap}</span>
                                    </div>
                                    <div className="col-4 m-0 p-0  text-center">
                                       <span>Expired :{ele.expired_date}</span>
                                    </div>
                                    <div className="col-4 m-0 p-0  text-end">
                                       <span>QTY:{ele.item_quantity}</span>
                                    </div>
                                 </div>

                                 <div className="col-2 p-0 m-0 d-flex justify-content-center align-items-center">
                                    <button type="button" onClick={() => deleteByIndex(index)} className="btn btn-sm text-danger">
                                       <i className="fa-solid fa-trash"></i>
                                    </button>
                                 </div>
                              </div>
                           ))
                           ) : (
                           <p className="text-center text-danger p-0 m-0 ">لا يوجد اصناف</p>
                           )}
                        </div>
                     </div>

                     <button ref={submitBtnRef} disabled={!(formikOrder.isValid && formikOrder.dirty && listItem.length > 0)} type="submit" className="d-none" />
                     </form>
                  </div>

                  {/* Add item form */}
                  <div className="col-md-8 offset-md-2 mt-3">
                     <form onSubmit={formikAddItem.handleSubmit} className="row mt-1 border border-3 rounded-3 p-3 m-1">
                     <p className="m-0"><i className="fa-solid fa-mug-saucer mx-2 main-color"></i> Item Count  : {itemCount || 0}</p>

                     <div className="col-12 p-0">
                        <div className="d-flex justify-content-between align-items-end">
                           <div className="mx-1 flex-fill position-relative">
                           <label htmlFor="item">{scanBarcode ? "Search Item :" : "Choose Item :"}</label>

                           {scanBarcode ? (
                              <>
                                 <input
                                    id="item"
                                    name="item"
                                    type="search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className={`${style.form} form-control py-1`}
                                    placeholder="Search by name or code..."
                                 />

                                 {loadingSearch && <div className="text-center small text-secondary mt-1">Searching...</div>}

                                 {filteredItems.length > 0 && (
                                    <ul className="list-group position-absolute w-100 shadow-sm mt-1" style={{ zIndex: 10, maxHeight: "200px", overflow: "auto" }}>
                                       {filteredItems.map((ele) => (
                                          <li key={ele._id} className="list-group-item list-group-item-action" style={{ cursor: "pointer" }} onClick={() => handleSelectItem(ele)}>
                                             {ele.item_s_code} - {ele.name}
                                          </li>
                                       ))}
                                    </ul>
                                 )}
                              </>
                           ) : (
                              <select
                                 id="item"
                                 name="item"
                                 value={formikAddItem.values.item}
                                 onChange={formikAddItem.handleChange}
                                 onBlur={formikAddItem.handleBlur}
                                 className={`${style.form} form-control py-1`}
                                 required
                              >
                                 <option value="">Choose Specific item</option>
                                 {products.map((ele) => (
                                 <option key={ele._id} value={`${ele._id}+${ele.name}+${ele.item_s_code}`}>
                                    {ele.item_s_code} - {ele.name}
                                 </option>
                                 ))}
                              </select>
                           )}
                           </div>

                           <div>
                              <i onClick={() => {
                                 setScanBarcode((s) => !s);
                                 setSearchTerm("");
                                 setFilteredItems([]);
                              }} className={`${style.searchIcon} btn main-color p-1 fa-solid fa-magnifying-glass`}></i>
                           </div>
                        </div>
                     </div>

                     <div className="col-12 p-0 mt-2">
                        <div className="mx-1">
                           <label htmlFor="expired_date">Expired Date :</label>
                           <input id="expired_date" name="expired_date" type="date" className="form-control py-1" required value={formikAddItem.values.expired_date} onChange={formikAddItem.handleChange} onBlur={formikAddItem.handleBlur} />
                           {formikAddItem.errors.expired_date && <div className="text-danger m-0 p-0">{formikAddItem.errors.expired_date}</div>}
                        </div>
                     </div>

                     <div className="col-12 p-0 mt-2">
                        <div className="mx-1">
                           <label htmlFor="item_quantity">Quantity :</label>
                           <input id="item_quantity" name="item_quantity" type="number" min="0" required className="form-control py-1" value={formikAddItem.values.item_quantity} onChange={formikAddItem.handleChange} onBlur={formikAddItem.handleBlur} />
                           {formikAddItem.errors.item_quantity && <div className="text-danger m-0 p-0">{formikAddItem.errors.item_quantity}</div>}
                        </div>
                     </div>

                     <div className="text-center mt-3">
                        <button disabled={!(formikAddItem.isValid && formikAddItem.dirty)} type="submit" className="btn bg-main text-white mt-2 w-25 p-1">Add</button>
                     </div>
                     </form>
                  </div>

                  {/* Submit button area */}
                  <div className="d-grid gap-2 col-8 mx-auto my-5">
                     {loading ? (
                     <button className="btn bg-main text-white mt-2 p-1"><Loading type="oval" color="white" width={25} height={25} strokeWidth="6" /></button>
                     ) : (
                     <button disabled={!(formikOrder.isValid && formikOrder.dirty && listItem.length > 0)} onClick={triggerOrderSubmit} type="button" className="btn bg-main text-white mt-2 p-1">Save</button>
                     )}
                  </div>
               </div>
         </div>
      </Fragment>
   );
}




















// import axios from "axios";
// import { useFormik } from "formik" ;
// import { Fragment , useContext, useEffect, useRef, useState } from "react";
// import {useNavigate } from "react-router-dom";
// import * as Yup from 'yup';
// import CustomTitle from "../CustomTitle/CustomTitle.jsx";
// import notification from "../../Utilities/notification.js";

// import { UserContext } from "../../Context/UserContext.js";
// import Loading from "../Loading/Loading.jsx";
// import style from "./receiveOrder.module.css" ;



// export default function ReceiveOrder() {
//       const navigate = useNavigate() ;
//       const [error , setError] = useState(null) ;
//       const [scanBarcode , setScanBarcode] = useState(false) ;
//       const [loading , setLoading] = useState(false) ;
//       const [listItem , setListItem] = useState([]) ;
//       const [listName , setListName] = useState([]) ;
//       const {userToken } = useContext(UserContext) ;
//       const buttonSubmit = useRef(null) ;



//       const [searchTerm, setSearchTerm] = useState("");
//       const [filteredItems, setFilteredItems] = useState([]);
//       const [loadingSearch, setLoadingSearch] = useState(false);
//       const [items , setItems] = useState([]);

//       const header = {
//          token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
//       }


//       // Save Order :
//       async function submitSaveOrder(values){
//          setLoading(true);
//          values.listItem =  listItem ;         
//          await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/order/createOrderBranch` , values ,  {headers:header} )
//          .then(({data})=>{
//             if(data.message === "success"){
//                setLoading(false) ;
//                notification("success" , "The Order Successfully Saved.")
//                navigate("/home") ;
//             }
//          })
//          .catch((error)=>{
//             setError(error.response.data.message)
//             notification("error" , error.response.data.message)
//             setLoading(false)
//          })
//       }
//       const validationSchema = Yup.object().shape({
//          title:Yup.string().min(2 , "Title Should be More than 2").max(30 , "Title less than 100").required("Title is Required").trim() ,
//          delivery_number:Yup.string() ,
//       })
//       const formik = useFormik({
//          initialValues:{
//             title:"" ,
//             delivery_number:"" ,
//          } , validationSchema , 
//          onSubmit:submitSaveOrder
//       })




//       // Add Item in Order :
//       async function submitAddItem(values , {resetForm}){
//          // if(searchTerm === "")return ;
         
//          let deep = {...values}
//          const name = deep.item.split("+").slice(1 , 2).join("") ;
//          const sap = deep.item.split("+").slice(2 , 3).join("") ;
         
         
         
//          const item = values.item.split("+").slice(0 , 1).join("") ;

//          //^ Check Repeat Item :
//          // const existItem = listItem.find((ele)=> ele.item === item) ;
//          // if(existItem){
//          //    notification("error" , "Item Already Added") ;
//          //    return ;
//          // }
         
//          //^ Check Valid Expired Date :
//          const  expired_date =  new Date(values.expired_date).getTime() ;
//          const  current_date =  new Date().getTime() ;         
//          if(current_date > expired_date){
//             notification("error" , "Expired  Invalid, Please Enter Valid Expired.!") ;
//             return ;
//          }
         
         
//          values.item = item ;
//          setListItem([...listItem , values]) ;
         
         
//          deep.name = name ;
//          deep.sap = sap ;
//          deep.item = item ;
//          setListName([...listName , deep]) ;
//          setSearchTerm("") ;
//          setScanBarcode(false) ;
//          resetForm( ) ;
//       }
//       const validationSchemaAddItem = Yup.object().shape({
//          item:Yup.string() ,
//          item_quantity:Yup.number().min(0, "الكمية مينفعش تكون أقل من صفر") ,
//          expired_date:Yup.string() ,
//       })
//       const formikAddItem = useFormik({
//          initialValues:{
//             item:"" ,
//             item_quantity:"" ,
//             expired_date:"" ,
//          } , validationSchemaAddItem , 
//          onSubmit:submitAddItem
//       })



//    async function getAllItem(search){
//       await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/item?all=true`)
//       .then(({data})=>{
//          if(data.message === "success"){
//             setItems(data.items)
//          }
//       })
//       .catch((error)=>{
//          notification("error" , error.response?.data.message)
//       })
//    } ;
//    function handleSubmit(){
//       buttonSubmit.current.click() ;
//    } ;
//    // function deleteItem(item){
//    //    const arrItem = listItem.filter((ele)=>ele.item !== item)
//    //    setListItem(arrItem) ;
      
//    //    const arrName = listName.filter((ele)=>ele.item !== item)
//    //    setListName(arrName) ;
//    // } ; 

//    const deleteItem = (index , ele) => {
//          setListItem((prev) => prev.filter((_, i) => i !== index));
//       setListName((prev) => prev.filter((element , i) => i !== index));
//    };





//    const handleSearchChange = async (e) => {
//       const value = e.target.value.toLowerCase() ;
//       setSearchTerm(value.toLowerCase());

//       if (value.trim().length < 3) {
//          setFilteredItems([]);
//          return;
//       }
//       // if (value.trim() === "") {
//       //    setFilteredItems([]);
//       //    return;
//       // }

//       setLoadingSearch(true);
//       try {
//          const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/item?keyword=${value}`);
//          setFilteredItems(data.items);
//       } catch (err) {
//          console.error(err);
//       } finally {
//          setLoadingSearch(false);
//       }
//    } ;
//    const handleSelectItem = (ele) => {
//       formikAddItem.setFieldValue("item", `${ele._id}+${ele.name}+${ele.item_s_code}`);
//       setSearchTerm(`${ele.item_s_code} - ${ele.name}`);
//       setFilteredItems([]);
//       // setScanBarcode(false);
//    } ;







//    useEffect(() => {
//       getAllItem();
//    }, [])


//    return (
//       <Fragment>
//          <CustomTitle title="Order Received" />
//          <div className='container'>
//             <h1 className='main-header my-4'>Receive Order</h1>
//             <p className="m-0"><i className="fa-solid fa-mug-saucer mx-2 main-color"></i> Item Count  : {listName.length || 0}</p>
      
//             <div className="row">

//                {/* input title and delivery number this order */}
//                <div className="col-md-8 offset-md-2">
//                   <form action="" onSubmit={formik.handleSubmit}>
//                      {error?<div className="alert alert-danger w-75  my-1">{error}</div> :""}
//                      <div className="">
//                         <div className="w-100 m-auto">
//                            <label htmlFor="title">Order Title :</label>
//                            <input type="text" 
//                               value={formik.values.title}
//                               onChange={formik.handleChange} 
//                               onBlur={formik.handleBlur}
//                               className="form-control py-1" id="title"  
//                               name="title" 
//                               maxLength={30}
//                               required
//                               placeholder="Enter Order Title" />
//                            {formik.errors.title?<div className="text-danger m-0 p-0">{formik.errors.title}</div> :""}
//                            {/* {formik.errors.title && formik.touched.title?<div className="text-danger m-0 p-0">{formik.errors.title}</div> :""} */}
//                         </div>

//                         <div className="w-100 m-auto">
//                            <label htmlFor="delivery_number">Delivery Number :</label>
//                            <input type="delivery_number" 
//                               value={formik.values.delivery_number}
//                               onChange={formik.handleChange} 
//                               onBlur={formik.handleBlur}
//                               className="form-control py-1" id="delivery_number"  
//                               name="delivery_number" 
//                               required
//                               placeholder="Enter Delivery Number" />
//                            {formik.errors.delivery_number  && formik.touched.delivery_number?<div className="text-danger m-0 p-0">{formik.errors.delivery_number}</div> :""}
//                         </div>
//                      </div>

//                      <div className={`${style.showItem}`}>
//                         <div className={`${style.search_result} my-2 p-2 bg-body-tertiary rounded-2 overflow-auto `}>
//                            {listName.length?
//                               listName.map((ele , index)=>   
//                                  <div className="row justify-content-center align-item-center bg-white border rounded-1 p-1 ps-2 fw-bold m-0 my-1 text-success cursor ">
//                                     <div  className={`row col-10 p-0 m-0 ${style.orderItem}`}>

//                                        <div className="col-12 m-0 p-0">
//                                           <p className="text-center m-0 p-0">{ele.name.split(" ").splice(0 , 7).join(" ")}</p>
//                                        </div>
//                                        <div className="col-4 m-0 p-0 text-start">
//                                           <span>{ele.sap}</span>
//                                        </div>
//                                        <div className="col-4 m-0 p-0  text-center">
//                                           <span>Expired :{ele.expired_date}</span>
//                                        </div>
//                                        <div className="col-4 m-0 p-0  text-end">
//                                           <span>QTY:{ele.item_quantity}</span>
//                                        </div>

//                                     </div>

//                                     <div  className="col-2 p-0 m-0 d-flex justify-content-center align-items-center">
//                                        <button  type="button" onClick={()=>{deleteItem(index , ele.item)}} className="btn btn-sm text-danger"><i className="fa-solid fa-trash"></i></button>
//                                     </div>
//                                  </div>
//                               )
//                            : <p className="text-center p-0 m-0 ">لا يوجد اصناف</p>
//                            }
//                         </div>
//                      </div>

//                      <button ref={buttonSubmit} disabled={!(formik.isValid && formik.dirty)} type="submit" className="d-none"></button>
//                   </form>
//                </div>
            
//                {/* Choose Item and add new item in order */}
//                <div className="">
//                   <form action="" onSubmit={formikAddItem.handleSubmit} className="row mt-1 border border-3 rounded-3 p-1 m-1">
//                         <p className="m-0"><i className="fa-solid fa-mug-saucer mx-2 main-color"></i> Item Count  : {listName.length || 0}</p>

//                         {/* Choose item name in this list or scan barcode */}
//                         {scanBarcode? 
//                               <div className="col-12 p-0">
//                                  <div className="d-flex justify-content-between align-items-end">
//                                     <div className="mx-1 flex-fill">
//                                        <label htmlFor="item">Search Item :</label>
//                                        <input
//                                           type="search"
//                                           value={searchTerm}
//                                           onChange={handleSearchChange}
//                                           className={`${style.form} form-control py-1`}
//                                           id="item"
//                                           placeholder="Search by name or code..."
//                                        />

//                                        {/* لو لسه بيعمل بحث */}
//                                        {loadingSearch && (<div className="text-center small text-secondary mt-1">Searching...</div>)}

//                                        {/* لو فيه نتائج */}
//                                        {filteredItems.length > 0 && (
//                                           <ul className="list-group position-absolute w-75 shadow-sm mt-1" style={{ zIndex: 10, maxHeight: "200px", overflow: "auto" }}>
//                                              {filteredItems.map((ele) => (
//                                                 <li key={ele._id} className="list-group-item list-group-item-action" style={{ cursor: "pointer" }} onClick={() => handleSelectItem(ele)}>
//                                                    {ele.item_s_code} - {ele.name}
//                                                 </li>
//                                              ))}
//                                           </ul>
//                                        )}

//                                        {/* لو مفيش نتائج */}
//                                        {/* {!loadingSearch && !searchTerm && filteredItems.length === 0 && (<div className="text-center small text-danger mt-1">No items found</div>)} */}
//                                     </div>

//                                     <div className="">
//                                           <i onClick={()=>{
//                                              setScanBarcode(!scanBarcode)
//                                              setSearchTerm("");
//                                              setFilteredItems([]);
//                                           }} className={`${style.searchIcon} btn main-color p-1 fa-solid fa-magnifying-glass`}></i>
//                                     </div>
//                                  </div>
//                               </div>
//                            : 
//                               <div className="col-12 p-0">
//                                  <div className="d-flex justify-content-between align-items-end">
//                                     {/* Choose item name from the list */}
//                                     <div className="mx-1 flex-fill">
//                                           <label htmlFor="item">Choose Item :</label>
//                                           <select value={formikAddItem.values.item}
//                                              onChange={formikAddItem.handleChange} 
//                                              onBlur={formikAddItem.handleBlur}
//                                              className={`${style.form} form-control py-1`} id="item"  
//                                              name="item" 
//                                              required>
//                                              <option value="" selected>Choose Specific item</option>
//                                              {items.map((ele)=>
//                                                 <option value={`${ele._id}+${ele.name}+${ele.item_s_code}`}>{ele.item_s_code  + " - " + ele.name}</option>
//                                              )}
//                                           </select>
//                                        {formikAddItem.errors.item && formikAddItem.touched.item?<div className="text-danger m-0 p-0">{formikAddItem.errors.item}</div> :""}
//                                     </div>

//                                     {/* Choose item name by scan barcode Or Search */}
//                                     <div className={``} >
//                                        {/* <i onClick={()=>{setScanBarcode(true)}} className="btn main-color fa-solid fa-2x fa-barcode"></i> */}
//                                        <i onClick={()=>{setScanBarcode(!scanBarcode)}} className={`${style.searchIcon} btn main-color p-1 fa-solid fa-magnifying-glass`}></i>
//                                     </div>
//                                  </div>
//                               </div>
//                         }

//                         {/* Enter Expire Date this item */}
//                         <div className="col-12 p-0">
//                            <div className="mx-1">
//                               <label htmlFor="expired_date">Expired Date :</label>
//                               <input type="date" 
//                                  value={formikAddItem.values.expired_date}
//                                  onChange={formikAddItem.handleChange} 
//                                  onBlur={formikAddItem.handleBlur}
//                                  className="form-control py-1" id="expired_date"  
//                                  name="expired_date" 
//                                  required
//                                  placeholder="Expire Date"
//                                  />
//                               {formikAddItem.errors.expired_date  && formikAddItem.touched.expired_date?<div className="text-danger m-0 p-0">{formikAddItem.errors.expired_date}</div> :""}
//                            </div>
//                         </div>

//                         {/* Enter Quantity this item */}
//                         <div className="col-12 p-0">
//                            <div className="mx-1">
//                               <label htmlFor="item_quantity">Quantity :</label>
//                               <input type="number" 
//                                  value={formikAddItem.values.item_quantity}
//                                  onChange={formikAddItem.handleChange} 
//                                  onBlur={formikAddItem.handleBlur}
//                                  className="form-control py-1" id="item_quantity"  
//                                  name="item_quantity" 
//                                  min="0"
//                                  required
//                                  placeholder="Enter Quantity" />
//                               {formikAddItem.errors.item_quantity  && formikAddItem.touched.item_quantity?<div className="text-danger m-0 p-0">{formikAddItem.errors.item_quantity}</div> :""}
//                            </div>
//                         </div>

//                         {/* Button add item in this order*/}
//                         <div className="text-center">
//                            <button disabled={!(formikAddItem.isValid && formikAddItem.dirty)} type="submit" className="btn bg-main text-white mt-2 w-25 p-1">Add</button>
//                         </div>
//                   </form>
//                </div>

//                {/* Button submit */}
//                <div className="d-grid gap-2 col-8 mx-auto my-5">
//                   {loading ? 
//                         <button className="btn bg-main text-white mt-2 p-1"> <Loading type="oval" color="white"  width={25} height={25} strokeWidth="6"/></button>
//                         // <button className="btn bg-main text-white mt-2 p-1"> <i className="fa-solid fa-spinner fa-spin fa-rotate-180 fa-xl"></i></button>
//                      : 
//                         <button disabled={!(formik.isValid && formik.dirty)} onClick={()=>{handleSubmit()}} type="submit" className="btn bg-main text-white mt-2 p-1">Save</button>
//                   }
//                </div>
//             </div>

//          </div>
//       </Fragment>
//    )
// } ;
