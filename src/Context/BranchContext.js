import { createContext , useContext, useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from "axios";
import notification from "../Utilities/notification.js";




export const BranchContext = createContext();


export default function BranchContextProvider(props){
   const {userToken } = useContext(UserContext) ;

   
   const [branches , setBranches] = useState([]) ;
   const [branchesCount , setBranchesCount] = useState(0) ;
   const[branch , setBranch] = useState({}) ;
   const[loading , setLoading] = useState(false) ;
   const[deleteLoading , setDeleteLoading] = useState(false) ;
   const[userLoading , setUserLoading] = useState(false) ;

   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
   }

   async function getBranches(search){
      setLoading(true) ;
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/branch?keyword=${search}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setBranches(data.branches) ;
            setBranchesCount(data.results)
            setLoading(false) ; 
         }else {
            return [] ; 
         } ;
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         setLoading(false) ;
      })
   }

   async function getAllBranches(company, all) {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/v1/branch?company=${company}&all=${all}`,
            { headers: header }
         );

         setLoading(false);

         if (data.message === "success") {
            setBranches(data.branches); // عادي تفضل تحدث الـ state
            return data.branches;       // ⬅️ هنا فعلاً بيرجع الفروع
         } else {
            return []; // لو مفيش فروع
         }
      } catch (error) {
         setLoading(false);
         console.log(error.response?.data?.message || error.message);
         return []; // لو فيه خطأ
      }
   } ;



   async function getSpecificBranch(id){
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/branch/${id}`  ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            setBranch(data.branch)
         }
      })
      .catch((error)=>{
         console.log(error.response.data.message);
      })
   } ;
   
   
   async function getUsersSpecificBranch(id){
      setUserLoading(true) ;
      try {
         const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/users/getUsersSpecificBranch/${id}`  ,  {headers:header} )
         if(data.message === "success"){
            setUserLoading(false);
            return data.users ;
         }
      } catch (error) {
         console.log(error.response.data.message);
         setUserLoading(false);
      }
   } ;



   async function addBranch(values){
      setLoading(true) ;
      try {
         const {data} = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/branch` , {...values} ,  {headers:header} )
         if(data.message === "success"){
            setLoading(false);
            getBranches("");
            notification("success" , "Add Branch Successfully")
         }
      } catch (error) {
         console.log(error.response.data.message);
         notification("error" , error.response.data.message)
         setLoading(false);
      }
   } ;
   
   
   async function deleteBranch (id){
      setDeleteLoading(true);
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/branch/${id}` , {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            // getBranches("") ;
            setBranches((prev) =>prev.filter((ele) =>ele._id !== data.branch._id)) ;         
            setBranchesCount((prev)=>prev - 1)
            setDeleteLoading(false) ;
         }
      })
      .catch((error)=>{
         setDeleteLoading(false);
         notification("error" , error.response.data.message)
      })
   } ;


   return (
      <>
         <BranchContext.Provider value={{
               getAllBranches , 
               getSpecificBranch ,
               getBranches ,
               getUsersSpecificBranch ,
               addBranch ,
               deleteBranch ,

               branch , 
               setBranch ,

               branches ,
               setBranches ,


               branchesCount ,  
               setBranchesCount , 

               loading , 
               setLoading ,

               deleteLoading , 
               setDeleteLoading , 

               userLoading , 
               setUserLoading ,

            }}>
            {props.children}
         </BranchContext.Provider>
      </>
   )
}