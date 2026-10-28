import { Fragment } from "react";
import { Link } from "react-router-dom";
import style from "./footer.module.css"

export default function Footer(){


   return (
      <Fragment>
         <footer className={`${style.divFooter} text-center mt-5 pt-1`}>
            <p className="mb-5 pb-5">CopyRight © {new Date().getFullYear()} ; Developed By : <a href="https://portfoliomahmoud-othman.vercel.app/" className="text-primary">Chemist-Mahmoud Othman</a> and <Link className="text-primary" to="/DevelopedInformation"> Al-Ayaat Chemist Team</Link></p>
         </footer>
      </Fragment>
   )
}