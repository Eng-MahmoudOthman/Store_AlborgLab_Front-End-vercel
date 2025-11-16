import { Fragment, useContext, useEffect } from 'react' ;
import { UserContext } from '../../Context/UserContext.js';
import { useNavigate } from 'react-router-dom';






export default function ListUserChat() {
   const {getAllUsers , users , usersIds , setUsersIds , setMessageCount , count , setCount} = useContext(UserContext) ;
   const navigate = useNavigate() ;

   const chattingPage = (userId)=>{

      setUsersIds((prev)=> prev.filter((ele)=>ele !== userId)) ;
      delete count[userId] ;
      setCount(count) ;


      // Update Message Count Notification After Open Specific Chat :
      let totalMessageCount = 0 ;
      for (let key in count) {
         if (count.hasOwnProperty(key)) {
            totalMessageCount += count[key] ;
         } ;
      }

      setMessageCount(totalMessageCount) ;
      navigate(`/clientChat/${userId}`) ;
   }

   function handleSearch(search){
      if(search.length > 2){
         getAllUsers(search) ;
      }else{
         getAllUsers("") ;
      }
   }

   useEffect(() => {
      getAllUsers("") ;
      const counts = {};
      for (const item of usersIds) {
         counts[item] = (counts[item] || 0) + 1 ;
      } ;
      setCount(counts)
   }, [usersIds])

   return (
      <Fragment>
         <div className='container my-5 py-5'>
            <div className="mb-5">
               <form >
                  <div className='position-relative'>
                     <input  type="search" onChange={(e) => handleSearch(e.target.value)}  className='form-control' id='search' placeholder='Search User Name more than 2 char'  name="search" />
                  </div>
               </form>
            </div>


            <div className='m-auto w-75'>
               {users !== null ? users.map((ele)=>
                  <>
                     <p key={ele._id} onClick={()=>{chattingPage(ele._id)}} className="bg-body-secondary my-2 rounded-2 text-center py-2  position-relative">
                        {ele.name} 
                        {usersIds.includes(ele._id) ? 
                              // <span class="position-absolute top-50 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">55</span>
                                 <span class="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                                    {count[ele._id]? count[ele._id] : 0 }
                                 </span>
                           : ""
                        }
                     </p>
                     
                  </>
               ) 
                  
                  : <p>Users Empty</p>
               }
            </div>
         </div>

      </Fragment>
   )
}
