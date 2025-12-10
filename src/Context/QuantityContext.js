import { createContext , useContext , useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from "axios";
import notification from "../Utilities/notification.js";




export const QuantityContext = createContext();


export default function QuantityContextProvider(props){
   const {userToken} = useContext(UserContext) ;


   const [loading , setLoading] = useState(false) ;
   const [loadingBarcode , setLoadingBarcode] = useState(false) ;
   const [loadingTransfer , setLoadingTransfer] = useState(false) ;
   const [deleteLoading , setDeleteLoading] = useState(false) ;
   const [consumption , setConsumption] = useState([]) ;
   const [categories , setCategories] = useState([]) ;
   const [items , setItems] = useState([]) ;
   const [itemsCount , setItemsCount] = useState(0) ;
   const [quantities , setQuantities] = useState([]) ;
   const [quantityExpired , setQuantityExpired] = useState([]) ;
   const [quantity , setQuantity] = useState({}) ;
   const [transfer , setTransfer] = useState([]) ;
   const [receive , setReceive] = useState([]) ;

   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
   } ;




   async function getBranchQuantities(search ,  flag){
      setLoading(true);
      await axios.get( `${process.env.REACT_APP_BASE_URL}/api/v1/quantity/quantitiesBranch?search=${search}&expired=${flag}` ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setQuantities(data?.quantities) ;
            setLoading(false);
         }
      })
      .catch((error)=>{
         console.log(error.response?.data.message);
         console.log(error);
         setQuantities([]) ;
         setLoading(false);
      })
   } ;
   async function getConsumption(){
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/consumption/branchConsumption`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setConsumption(data.consumption) ;
            setLoading(false);
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         setConsumption([]) ;
         setLoading(false);
      })
   } ;
   async function checkConsumption(itemId){
      setLoading(true);
      await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/v1/consumption/${itemId}` , {} ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            getConsumption("false") ;
            setLoading(false);
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         notification("error", error.response.data.message)
         setLoading(false);
      })
   } ;
   async function addConsumption(values){
      console.log(values);
      
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/consumption` , {...values}  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setLoading(false);
            setQuantities(data.quantities) ;
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         notification("error" , error.response.data.message)
         setLoading(false);
      })
   } ;
   async function getBranchQuantitiesExpired(search){
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/quantity/quantityExpired?keyword=${search}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setQuantityExpired(data.quantities) ;
            setLoading(false);
         }
      })
      .catch((error)=>{
         // console.log(error.response.data.message);
         setQuantityExpired([]) ;
         setLoading(false);
      })
   } ;
   async function deleteQuantityExpired(id){
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/quantity/${id}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            // getBranchQuantitiesExpired() ;
            setQuantityExpired((prev) => prev.filter((ele) => ele._id.toString() !== id));
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
      })
   } ;
   async function getSpecificQuantity(id){
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/quantity/${id}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setQuantity(data.Quantity)
            setLoading(false);
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         setLoading(false);
      })
   } ;
   async function addTransfer(values , resetForm){
      setLoadingTransfer(true);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/transfer` , {...values} ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            notification("success" , "Transfer Completed Successfully")
            setLoadingTransfer(false);
            resetForm(); // ← هنا بتفضي الفورم بعد الإرسال الناجح
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         notification("error" , error.response.data.message)
         setLoadingTransfer(false);
      })
   } ;
   async function getTransfer(status){
      setLoadingTransfer(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/transfer/getItemTransferSpecificBranch?status=${status}` ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setTransfer(data.transfer) ;
            setLoadingTransfer(false) ;
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         setTransfer([]);
         setLoadingTransfer(false);
      })
   } ;
   async function getReceive(status){
      setLoadingTransfer(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/transfer/getItemReceiveSpecificBranch?status=${status}` ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setReceive(data.receive) ;
            setLoadingTransfer(false) ;
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         setReceive([]);
         setLoadingTransfer(false);
      })
   } ;
   async function receiveTransfer(id){
      setLoadingTransfer(true);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/transfer/${id}` , {} , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            console.log(data);
            
            
            getReceive("pending") ;
            setLoadingTransfer(false) ;
         }
      })
      .catch((error)=>{
         setReceive([]) ;
         console.log(error.response.data.message);
         setLoadingTransfer(false);
      })
   } ;
   async function cancelTransfer(id , message){
      setLoadingTransfer(true); 
      await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/v1/transfer/${id}` , {message} , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            console.log(data);
            
            getReceive("pending") ;
            setLoadingTransfer(false) ;
         }
      })
      .catch((error)=>{
         setReceive([]) ;
         console.log(error.response.data.message);
         setLoadingTransfer(false);
      })
   } ;
   async function deleteTransfer(id){
      setLoadingTransfer(true); 
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/transfer/${id}` , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setTransfer((prev) => prev.filter((ele) => ele._id.toString() !== id));
            setLoadingTransfer(false) ;
         }
      })
      .catch((error)=>{
         console.log(error.response?.data.message);
         setLoadingTransfer(false);
      })
   } ;
   async function getCategories(all){
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/category?all=${all}` , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setCategories(data.categories) ;
         }
      })
      .catch((error)=>{
         console.log(error.response?.data.message) ;
      })
   } ;
   async function getItems(search){
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/item?keyword=${search}` , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setItems(data.items) ;
            setItemsCount(data.results)
            setLoading(false);
         }
      })
      .catch((error)=>{
         console.log(error.response?.data.message) ;
         setLoading(false);
      })
   } ;
   async function addItem(values){
      setLoading(true); 
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/item` , {...values} ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            getItems("")
            setLoading(false) ;
            notification("success" , "Added Item Successfully")
         }
      })
      .catch((error)=>{
         console.log(error.response?.data.message);
         setLoading(false);
         notification("error" , error.response.data.message)
      })
   } ;
   async function deleteItem(id){
      setDeleteLoading(true); 
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/item/${id}` , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            // getItems("") ;
            setItems((prev) => prev.filter((ele) => ele._id.toString() !== id));
            setItemsCount((prev)=>prev - 1)
            setDeleteLoading(false) ;
         }
      })
      .catch((error)=>{
         console.log(error.response?.data.message);
         setDeleteLoading(false);
      })
   } ;
   async function deleteQuantity (id){
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/quantity/${id}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setQuantities((prev) => prev.filter((ele) => ele._id.toString() !== id));
         }
      })
      .catch((error)=>{
         notification("error" , error.response.data.message)
         console.log(error.response.data.message);
      })
   } ;
   async function updateQuantity (id , values){
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/quantity/${id}`  , values ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setQuantities((prev) =>
               prev.map((ele) =>
                  ele._id.toString() === data.quantity._id.toString()
                     ? data.quantity 
                     : ele
               )
            );
         }
      })
      .catch((error)=>{
         notification("error" , error.response.data.message)
         console.log(error.response.data.message);
      })
   } ;
   async function getQuantityBarcode(quantityId) {
      setLoadingBarcode(true);
      try {
         const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/v1/quantity/barcode/${quantityId}`,
            { headers: header, responseType: "blob" }
         );

         const fileURL = URL.createObjectURL(response.data);

         // افتح نافذة جديدة
         const printWindow = window.open(fileURL);

         if (!printWindow) {
            notification("error", "المتصفح منع فتح نافذة الطباعة");
            return;
         }

         // استنى لما الملف يتحمل جوا النافذة
         printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();  

            // بعد ثانية اقفل الـ URL عشان مايحصلش memory leak
            setTimeout(() => {
               URL.revokeObjectURL(fileURL);
            }, 2000);
         };

         notification("success", "جاري فتح نافذة الطباعة...");
      } catch (error) {
         console.error("Error opening print preview:", error.message);
         notification("error", error.message);
      } finally {
         setLoadingBarcode(false);
      }
   }

   
   return (
      <>
         <QuantityContext.Provider value={{
               getBranchQuantities , 
               // getQuantitiesByCategory ,
               getSpecificQuantity ,
               getBranchQuantitiesExpired ,
               getCategories ,
               getItems ,
               deleteQuantity ,
               deleteQuantityExpired ,
               addConsumption , 
               getConsumption ,
               checkConsumption ,
               addTransfer ,
               getTransfer ,
               getReceive ,
               receiveTransfer ,
               cancelTransfer ,
               deleteTransfer ,
               deleteItem ,
               addItem ,
               updateQuantity ,
               getQuantityBarcode ,


               quantity , 
               setQuantity ,

               quantities ,
               setQuantities ,

               categories , 
               setCategories ,

               items , 
               setItems ,

               itemsCount , 
               setItemsCount ,

               loading , 
               setLoading ,
               
               loadingBarcode , 
               setLoadingBarcode ,

               loadingTransfer , 
               setLoadingTransfer ,

               deleteLoading , 
               setDeleteLoading ,

               quantityExpired , 
               setQuantityExpired ,

               consumption ,  
               setConsumption ,

               receive , 
               setReceive ,

               transfer , 
               setTransfer ,
            }}>
            {props.children}
         </QuantityContext.Provider>
      </>
   )
}