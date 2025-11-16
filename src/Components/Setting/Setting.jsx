import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext.js';
import { logOut } from '../../Utilities/logOut.js';
import CustomTitle from '../CustomTitle/CustomTitle.jsx';

import style from "./setting.module.css"







export default function Setting() {
   
   const navigate = useNavigate() ;
   const totalUserInfo = useContext(UserContext);

   const services = [
      {name:"Change Color" , url:"/ChangeColor" , icon:<i className="fa-solid fa-heart-pulse"></i>} ,
      {name:"Change Password" , url:"/ChangePassword" , icon:<i className="fa-solid fa-lock"></i>} ,
      {name:"Contact Me" , url:"/DevelopedInformation" , icon:<i className="fa-solid fa-phone"></i>} ,
      {name:"Language " ,  click:""  , icon:<i className="fa-solid fa-earth-americas"></i>} ,
      {name:"Change Style" , url:"" , icon:<i className="fa-solid fa-wallet"></i>} ,
      {name:"Log Out" , click:handleLogOut , icon:<i className="fa-solid fa-right-from-bracket"></i>} ,
   ]



   
   //& Handle Log Out :
   function handleLogOut(){
      logOut(navigate , totalUserInfo) ;
   }


   return (
      <>
         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Setting</li>
            </ol>
         </nav>

         <div className="container vh-75 mt-5 bt-5">
            <CustomTitle title="الاعدادات" />
            <h1 className='main-header'>Setting Page</h1>
            <div className='my-5 text-center '>
               <Link to="/yourTeam" className='btn bg-main w-75'>عرض فريق العمل </Link>
            </div>

            {/* <div className="row justify-content-center btn-group" dir="rtl">
  {services.map((ele, index) => (
    <div key={index} className="col-6 col-md-4 col-lg-3 d-flex justify-content-center">
      <div className="p-1 w-100" style={{ maxWidth: "250px" }}>
        <Link
          to={ele.url ? ele.url : ""}
          onClick={ele.click ? () => ele.click() : undefined}
          className="btn btn-secondary w-100 border-0"
        >
          <div className="d-flex justify-content-between align-items-center">
            {ele.icon}
            <span className={`${style.itemName}`}>{ele.name}</span>
          </div>
        </Link>
      </div>
    </div>
  ))}
</div> */}

            <div className="row " dir='rtl'>
               {services.map((ele , index)=>
                  <div key={index} className="col-6 col-md-4">
                     <div className='p-1'>
                        <Link to={ele.url?ele.url:""} onClick={ele.click?()=>{ele.click()}:""}  className='btn btn-secondary w-100 border-0'>
                           <div className='d-flex justify-content-between align-items-center'>
                              {ele.icon}
                              <span className={`${style.itemName}`}>{ele.name}</span>
                           </div>
                        </Link>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   )
}
