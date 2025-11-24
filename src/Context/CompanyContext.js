import axios from 'axios';
import { useContext } from 'react' ;
import { createContext , useState } from "react";
import { UserContext } from './UserContext.js';



export const CompanyContext = createContext();



export default function CompanyContextProvider(props){

   const [companies , setCompanies] = useState([]) ;
   const [company , setCompany] = useState({}) ;
   const [loading , setLoading] = useState(false) ;
   const {userToken } = useContext(UserContext) ;

   

   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
   }
   
   async function getCompanies (){
      setLoading(true) ;
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/company`  , {headers:header} )
      .then(({data})=>{
         if(data?.message === "success"){
            setCompanies(data.companies) ;
         }
         setLoading(false) ;
      })
      .catch((error)=>{
         console.log(error.response.data.message);
         setLoading(false) ;
      })
   }

   return (
      <>
         <CompanyContext.Provider value={{
               getCompanies ,
               companies , 
               setCompanies , 
               loading , 
               setLoading ,
               company , 
               setCompany
            }}>
            {props.children}
         </CompanyContext.Provider>
      </>
   )
}

