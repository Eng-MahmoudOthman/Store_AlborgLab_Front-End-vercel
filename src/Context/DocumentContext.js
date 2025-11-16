import { createContext , useContext, useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from "axios";
import notification from "../Utilities/notification.js";




export const DocumentContext = createContext();


export default function DocumentContextProvider(props){
      const[loading , setLoading] = useState(false) ;
      const[deleteLoading , setDeleteLoading ,] = useState(false) ;
      const[documents , setDocuments] = useState([]) ;
      const[documentsCount , setDocumentsCount] = useState(0) ;
      const {userToken} = useContext(UserContext) ;
   
      const header = {
         token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
      }

      async function getDocuments(search){
         setLoading(true) ;
         await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/document?keyword=${search}&limit=200`  ,  {headers:header} )
         .then(({data})=>{
            if(data.message === "success"){
               setDocuments(data.documents) ;
               setDocumentsCount(data.results);
               setLoading(false) ; 
            }else {
               return [] ; 
            } ;
         })
         .catch((error)=>{
            console.log(error.response.data.message);
            setDocuments([]) ;
            setDocumentsCount(0);
            notification("error",error.response.data.message);
            setLoading(false) ;
         })
      }

      async function AddDocument(formData){
         setLoading(true) ;
         try {
            const {data} = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/document` , formData ,  {headers:header} )
            if(data.message === "success"){
               setLoading(false);
               getDocuments("");
               notification("success" , "Add Document Successfully")
            }
         } catch (error) {
            console.log(error.response.data.message);
            notification("error" , error.response.data.message)
            setLoading(false);
         }
      }

      async function deleteDocument(id){
         setLoading(true) ;
         await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/document/${id}` ,  {headers:header} )
         .then(({data})=>{
            if(data.message === "success"){
               getDocuments("");
               // setDocuments((prev) => prev.filter((ele) => ele._id.toString() !== id));
               // setDocumentsCount((prev)=>prev - 1)
               setLoading(false) ; 
            }else {
               return [] ; 
            } ;
         })
         .catch((error)=>{
            console.log(error.response.data.message);
            notification("error",error.response.data.message);
            setLoading(false) ;
         })
      }




   return (
      <>
         <DocumentContext.Provider value={{
               getDocuments ,
               AddDocument ,
               deleteDocument ,


               documentsCount , 
               setDocumentsCount ,

               documents , 
               setDocuments ,

               deleteLoading , 
               setDeleteLoading ,

               loading , 
               setLoading ,

            }}>
            {props.children}
         </DocumentContext.Provider>
      </>
   )
}