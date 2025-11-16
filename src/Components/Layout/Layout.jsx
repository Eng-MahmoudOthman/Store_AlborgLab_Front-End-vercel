import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import { Fragment } from "react";

export default function Layout(){

   const location = useLocation() ;
   const hideFooterPages = ["ConfirmedAccount"] ;
   const shouldHideFooter = hideFooterPages.includes(location.pathname.split("/")[1]) ; 

   
   return (
      <Fragment>
         <Navbar />
            <div className="mt-5 pt-5">
               <Outlet></Outlet>
            </div>
         {!shouldHideFooter && <Footer />}
      </Fragment>
   )
}