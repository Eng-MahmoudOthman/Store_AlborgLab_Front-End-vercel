import axios from "axios";
import { createContext , useEffect, useState } from "react";
import notification from "../Utilities/notification.js";
import { io } from "socket.io-client" ;




export const UserContext = createContext();


export default function UserContextProvider(props){


   const [loggedUser , setLoggedUser] = useState(null) ;

   const [userToken , setUserToken] = useState(localStorage.getItem("token")) ;
   const [error , setError] = useState(null) ;
   const [loading , setLoading] = useState(false)
   const [confirmedLoading , setConfirmedLoading] = useState(false)
   const [blockedLoading , setBlockedLoading] = useState(false)
   const [deleteLoading , setDeleteLoading] = useState(false)
   const [role , setRole] = useState("") ;
   const [user , setUser] = useState({}) ;
   const [users , setUsers] = useState([]) ;
   const [allUsers , setAllUsers] = useState([]) ;
   const [team , setTeam] = useState([]) ;

   const [socket, setSocket] = useState(null) ;
   const [usersOnline, setUsersOnline] = useState([]) ;
   const [messageCount, setMessageCount] = useState(0) ;
   const [chats, setChats] = useState({}) ;
   const [usersIds, setUsersIds] = useState([]) ;
   const [count , setCount] = useState({}) ;
   const [pageCount, setPageCount] = useState(0) ;
   const [mainColor, setMainColor] = useState("") ;


   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
   }


   async function getAllUsers (search){
      setLoading(true) ;
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/users?keyword=${search}`  ,  {headers:header} )
      .then(({data})=>{
         if(data?.message === "success"){
            setUsers(data.users);
            setLoading(false) ;
         }
      })
      .catch((error)=>{
         notification("error" , error.response.data.message)
         setUsers([]) ;
         setLoading(false) ;
      })
   }
   async function getSpecificUser (id){
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${id}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setUser(data.user);
            setLoading(false);
         }
      })
      .catch((error)=>{
         setLoading(false);
         notification("error" , error.response.data.message)
      })
   } ;
   async function confirmedUser (id , confirmed){
      setConfirmedLoading(true);
      await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${id}`  , {confirmed:confirmed?"true":"false"} ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setUsers((prev) =>
               prev.map((ele) =>
                  ele._id === data.user._id ? { ...ele, confirmed: confirmed } : ele
               )
            );         

            setConfirmedLoading(false);
            notification("success" , confirmed?"User Confirmed Successfully":"User Not Confirmed Successfully" )
         }
      })
      .catch((error)=>{
         setConfirmedLoading(false);
         notification("error" , error.response.data.message)
      })
   } ;
   async function blockedUser (id , blocked){
      setBlockedLoading(true);
      await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${id}`  , {blocked:blocked?"true":"false"} ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setUsers((prev) =>
               prev.map((ele) =>
                  ele._id === data.user._id ? { ...ele, blocked: blocked } : ele
               )
            );         
            setBlockedLoading(false);
            notification("success" , blocked?"User Blocked Successfully":"User Not Blocked Successfully" )
         }
      })
      .catch((error)=>{
         setBlockedLoading(false);
         notification("error" , error.response.data.message)
      })
   } ;
   async function updateBranchUser (id , branch){
      setBlockedLoading(true);
      await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/updateBranchUser/${id}`  , {branch} ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){   
            setBlockedLoading(false);
            getAllUsers("")
            // notification("success" , "Update Branch Successfully" )
         }
      })
      .catch((error)=>{
         setBlockedLoading(false);
         notification("error" , error.response.data.message)
      })
   } ;
   async function deleteUser (id){
      setDeleteLoading(true);
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${id}` , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setUsers((prev) =>prev.filter((ele) =>ele._id !== data.user._id)) ;         
            setDeleteLoading(false) ;
            notification("success" , "User Deleted Successfully" ) ;
         }
      })
      .catch((error)=>{
         setDeleteLoading(false);
         notification("error" , error.response.data.message)
      })
   } ;
   async function getUserTeam (branchId){  
      const header = {
         token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
      }
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/users?branch=${branchId}` ,  {headers:header})
      .then(({data})=>{
         if(data.message === "success"){
            setTeam(data.users);
            setLoading(false);
         }
      })
      .catch((error)=>{
         setLoading(false);
         console.log(error.response.data.message);
      })
   };
   async function AddSignature (signature){ 
      console.log(signature);
         
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/users/signature` ,{signature} ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            notification("success" , "Added Signature Successfully")
            setLoading(false);
         }
      })
      .catch((error)=>{
         setLoading(false);
         notification("error" , "حصل خطأ أثناء حفظ التوقيع")
         console.log(error.response.data.message);
      })
   };
   async function getLoggedUserMessages (id , limit , currentPage){      
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/message/getLoggedUserMessages/${id}?limit=${limit}&sort=-createdAt&page=${currentPage}` ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            // console.log("data" , data.messages);
            setPageCount(data.metadata.numberOfPages) ;
         }
         // return data ;
      })
      .catch((error)=>{
         console.log(error.response.data.message);
      })
   }
   // //! Get Logged Message :
   // const getLoggedUserMessages = async(id , limit , currentPage)=>{
	// 	try { 
   //       const res = await axios.get(`message/getLoggedUserMessages/${id}?limit=${limit}&sort=-createdAt&page=${currentPage}` )  
   //       const data = res?.data ;
   //       if(data.message === "success"){
   //          setPageCount(data.metadata.numberOfPages) ;
   //          // setMessages((prev) => [...data.messages , ...prev]);
   //          return data.messages ;
   //       }
   //       return data ;
	// 	} catch (error) {
   //       setError(error.response?.data.message) ;
	// 	}
	// }
   const socketConnect = async () => {
      if (!socket && loggedUser) { // لتجنب اتصالات مزدوجة
         const newSocket = io(process.env.REACT_APP_BASE_URL);
         setSocket(newSocket);
         
         newSocket.emit("register_user", {userId :loggedUser._id , user:loggedUser});
         newSocket.on("count_message", ({ countMessages }) => {
            setMessageCount(Number(countMessages)) ;
			});
         
         newSocket.on("update_online", (users)=>{
            setUsersOnline(users) ;
         });
      }
   } ;
   const socketDisConnect = () => {
      if (socket) {
         socket.disconnect();
         setSocket(null);
         setUsersOnline([]) ;
         console.log("Disconnect");
      }
   } ;



   useEffect(() => {
      if(socket){
         socket.on('notification', (data) => {
            // alert(`🔔 إشعار: رسالة جديدة من ${data.from}: ${data.message}`);
            // toast.success(`🔔 إشعار: رسالة جديدة من ${data.from}: ${data.message}`)
            setMessageCount((prev)=>prev + 1) ;
            setUsersIds((prev)=>[...prev , data.from._id.toString()])
            notification("success" , `🔔 New Message From ${data.from.name}: ${data.message.split(" ").slice(0,4).join(" ")} ....`)
         });


         socket.on("usersIds" , ({usersIds})=>{
            setUsersIds(usersIds) ;
         })
      }
   }, [socket]);
   // Get Main Color From CSS Style File, and Set Into UseState :
   useEffect(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const colorValue = rootStyles.getPropertyValue("--main-color").trim();
      setMainColor(colorValue) ;
   }, [])

   return (
      <>
         <UserContext.Provider 
            value={{
               getSpecificUser ,
               getUserTeam ,
               socketConnect ,
               socketDisConnect ,
               getAllUsers ,
               getLoggedUserMessages ,
               confirmedUser ,
               blockedUser ,
               deleteUser ,
               updateBranchUser ,
               AddSignature ,

               team ,
               setTeam ,

               user ,  
               setUser , 

               users , 
               setUsers ,

               allUsers , 
               setAllUsers ,

               role , 
               setRole , 

               loggedUser , 
               setLoggedUser , 

               userToken , 
               setUserToken , 

               error , 
               setError , 

               loading , 
               setLoading ,

               confirmedLoading , 
               setConfirmedLoading ,

               blockedLoading , 
               setBlockedLoading ,

               deleteLoading , 
               setDeleteLoading ,

               pageCount, 
               setPageCount ,


               socket, 
               setSocket ,

               usersOnline, 
               setUsersOnline ,

               messageCount, 
               setMessageCount ,

               chats, 
               setChats ,

               usersIds, 
               setUsersIds ,

               count , 
               setCount ,


               mainColor, 
               setMainColor ,

            }}>
            {props.children}
         </UserContext.Provider>
      </>
   )
}