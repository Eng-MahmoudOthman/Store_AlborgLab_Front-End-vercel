import { createContext , useContext, useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from "axios";
import notification from "../Utilities/notification.js";




export const OrderContext = createContext();


export default function OrderContextProvider(props){
   const {userToken , loggedUser } = useContext(UserContext) ;

   const [orders , setOrders] = useState([]) ;
   const[Order , setOrder] = useState({}) ;
   const[loading , setLoading] = useState(false) ;
   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
   }



   async function getLoggedOrders (search){
      setLoading(true) ;
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/order?branch=${loggedUser.branchId}&keyword=${search}`  , {headers:header} )
      .then(({data})=>{
         if(data?.message === "success"){
            setOrders(data.orders) ;
            setLoading(false) ;
         }
      })
      .catch((error)=>{
         setLoading(false) ;
         notification("error", error.response.data.message + "---Done")
      })
   }
   async function deleteOrder (id){
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/order/${id}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setOrders((prev) => prev.filter((ele) => ele._id.toString() !== id));
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
      })
   } ;


   return (
      <>
         <OrderContext.Provider value={{
               Order , 
               setOrder ,

               orders ,
               setOrders ,

               loading , 
               setLoading ,

               getLoggedOrders ,
               deleteOrder
            }}>
            {props.children}
         </OrderContext.Provider>
      </>
   )
}