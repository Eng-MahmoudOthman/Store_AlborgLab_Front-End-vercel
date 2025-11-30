import { useContext, useEffect } from 'react' ;
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import getGreeting from "../../Utilities/getGreeting.js"
import { UserContext } from '../../Context/UserContext.js';



import style from "./mainPage.module.css" ;
import { ReportContext } from '../../Context/ReportContext.js';
import Loading from '../Loading/Loading.jsx';



export default function MainPage() {
   const {loggedUser , role , messageCount , mainColor} = useContext(UserContext) ;
   const {loginData , loading , getInfoLogin} = useContext(ReportContext) ;



   const services = [
      { name: "Consumption"   , icon: ""     , url:"/Consumption"    , count:loginData?.consumption  , isActive:true}  , 
      { name: "Orders"        , icon: ""     , url:"/Orders"         , count:0  , isActive:true}  , 
      { name: "Inventory"     , icon: ""     , url:"/Inventory"      , count:loginData?.expiredCurrentMonth  , isActive:true}  ,
      { name: "Expired"       , icon: ""     , url:"/ExpireDate"     , count:loginData?.expired  , isActive:true}  , 
      { name: "Received"      , icon: ""     , url:"/Receive"        , count:loginData?.receive  , isActive:true}  , 
      { name: "Transfer"      , icon: ""     , url:"/Transfer"       , count:loginData?.transfer  , isActive:true} , 
      { name: "Members"       , icon: ""     , url:"/yourTeam"       , count:0  , isActive:true}  , 
      { name: "Exam"          , icon: <i className="fa-regular fa-hourglass-half text-danger mx-2"></i>     , url :"#"              , count:0  , isActive:true}  , 
      { name: "Templates"     , icon: ""     , url:"/showDocuments"  , count:0  , isActive:true} ,
      { name: "Chatting"      , icon: <i className="fa-regular fa-hourglass-half text-danger mx-2"></i>     , url:"/ListUserChat"   , count:0  , isActive:false} ,
      { name: "Reports"       , icon: ""     , url:"/Report"         , count:0  , isActive:true}  ,
      ...(role === "admin"?[{ name: "Dashboard"     , icon: ""     , url:"/Dashboard"      , count:0  , isActive:true}]:[] ) ,
      // { name: "UsersList"     , icon: ""     , url:"/UsersList"      , count:0  , isActive:true}  ,
      // { name: "UsersSummary"  , icon: ""     , url:"/UsersSummary"   , count:0  , isActive:true}  ,
   ] ;

   const adverts = [
      { _id: "Consumption", image: "/slider_online_1.jpg"  , isActive:false}, 
      { _id: "Orders"     , image: "/slider_online_2.webp"  , isActive:true} , 
      { _id: "Expired"    , image: "/slider_online_3.jpg"  , isActive:true} , 
      { _id: "Members"    , image: "/slider_online_4.jpg"  , isActive:false}, 
      { _id: "Received"   , image: "/slider_online_5.webp"  , isActive:false}, 
      { _id: "Transfer"   , image: "/slider_online_6.jpg"  , isActive:false}, 
      { _id: "Inventory"  , image: "/slider_online_7.jpg"  , isActive:false},
   ] ;



   useEffect(() => {
		getInfoLogin() ;
	}, [loggedUser ]) ;


   return ( 
      <div className={` ${style.mainSection}`}>
         <div className={`container`}> 
            <section className={`${style.fixedBottom}`}>
               <div className="text-center my-3">
                  <Link to={`https://chat.whatsapp.com/GrBqCbZWp2N765GNFSwX9U`} className={`btn`}>
                     <img src="/WhatsApp.png" className='w-100' alt="WhatsApp" srcset="" />
                  </Link>
               </div>
            </section>
            
            {/* Info Section with Slider */}
            <section className="home-slider p-3 rounded-2 mb-2">
               <div className='mb-2'>
                  <p className=' my-4 text-center fw-bold '>{getGreeting() }</p>
               </div>

               <div className=' bg-light rounded-2 overflow-hidden'>
                  <Carousel indicators={true} controls={false} interval={2000} className={style.carouselDiv} >
                     {adverts.map((ele) => (
                        <Carousel.Item key={ele._id} className={`carousel-item ${style.carouselItem}`}>
                           <div className="text-center carousel-div">
                              <img src={ele.image} alt="cover" className={`w-100 carousel-img ${style.carouselImg}`}/>
                           </div>
                        </Carousel.Item>
                     ))}
                  </Carousel>
               </div>
            </section>

            <section className=''>
               {loading?
                     // <p className='text-center mb-4 fw-bold'><i className={`${style.loading} spinner-border fa-xl text-black`}></i></p>
                     <p className='text-center mb-4 fw-bold'><Loading type="btn" color={mainColor}/></p>
                     
                  :
                  <>
                     <p className={`${style.message} m-0 p-0`}> {loginData?.messageLogin}</p>
                     <p className={`${style.message} m-0 p-0 mb-3`}> Total Valid Items : <span className='main-color'>{loginData?.notExpired}</span> 🧪</p>
                  </>
               }
            </section>

            {/* Services Grid */}
            <div className="row g-2 bg-body-secondary rounded-2 home-box ">
               {services.map((service, index) => (
                  <div key={index} className={`col-6 my-1 `}>
                     <Link to={service.isActive?service.url:"#"}>
                        <div className="position-relative ">
                           <div className={`card text-center p-2 ${style.card}`}>
                              <p className={`m-0 fw-bold  ${style.cardText}`}>  {service.name} <span className='position-absolute end-0'>{service.icon}</span> </p>
                           </div>
                           {service.count? 
                                 <span className={`${style.notificationCount} d-flex justify-content-center align-item-center position-absolute z-1 translate-middle badge rounded-pill bg-danger`}>
                                    {service.count}
                                 </span>
                              :
                                 ''
                           }
                           {service.name === "Chatting"? 
                              <span className={` ${style.notification} position-absolute top-50 start-25 translate-middle badge rounded-pill bg-danger`}>
                                 {messageCount > 99 ? "99+" : messageCount === 0 ? null : messageCount}
                              </span>
                              : ""
                           }
                        </div>
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </div>

   )
}







