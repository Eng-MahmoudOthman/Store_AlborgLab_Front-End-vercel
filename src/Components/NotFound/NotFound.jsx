import { Fragment } from "react"
import CustomTitle from "../CustomTitle/CustomTitle.jsx"
import { Link } from "react-router-dom"
import style from "./notFound.module.css"



export default function NotFound(){

	return (
		<Fragment>
			<CustomTitle title="Not Found" />
			<div className="container mt-5 pt-5">
					<div className=" m-3 rounded-4 shadow-lg p-5 ">
							<div className={`${style.icon} my-2  m-auto rounded-circle text-primary bg-primary-subtle d-flex justify-content-center align-items-center`}>
									<i class="fa-solid fa-magnifying-glass fs-3 fw-bold"></i>
							</div>

							<h1 className="text-center fw-bold my-2">Page Not Found</h1>
							<p className="text-center fw-bold">Sorry, we couldn`t find the page you were looking for.</p>

							<div className="text-center my-2 text-white"><button className="btn btn-primary px-3 w-100"><Link to="/home"><i class="fa-solid fa-house mx-3"></i>Back to Home Page</Link></button></div>
							<div className="text-center my-2 "><button  onClick={() => window.history.back()}  className="btn btn-outline-primary px-3 w-100">Go Back </button></div>

							<br />

							<p className="text-center fw-bold text-black-50">If you believe this is a mistake, please contact support.</p>
					</div>

			</div>
		</Fragment>
	)
}
