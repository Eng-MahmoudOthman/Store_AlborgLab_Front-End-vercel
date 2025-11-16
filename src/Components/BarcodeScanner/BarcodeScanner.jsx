import { useState, useEffect, useRef, Fragment } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import {useFormik} from "formik";
import * as Yup from "yup";
import "./BarcodeScanner.css"
import axios from 'axios';
import notification from '../../Utilities/notification.js';



export default function BarcodeScanner({data}) {
	const {listItem , setListItem , listName , setListName , deleteItem} = data ;
	const [display, setDisplay] = useState(false); // Controls tambourine display and camera activation
	const [result, setResult] = useState(null);
	const [showEdit, setShowEdit] = useState(false);
	const [selectItem , setSelectItem] = useState(null);
	const [search , setSearch] = useState([]);
	const videoRef = useRef(null);
	const codeReader = useRef(new BrowserMultiFormatReader());
	const expired = useRef(null);
	const quantity = useRef(null);


	//! Add Code By Scanner Camera Barcode :
	useEffect(() => {
		const startScanning = () => {
			codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
			if (result) {
				playAudio(); // Play beep sound on successful scan
				setResult(result.getText());
				setDisplay(false) ;
				getSearchItemByBarcode(result.getText())
			}
			if (err && err.name !== "NotFoundException") {
				console.error(err);
			}
			});
		};

		if (display) {
			startScanning();
		} else {
			stopScanning();
		}

		return () => stopScanning();
	}, [display]);

	const stopScanning = () => {
		codeReader.current.reset();
		const stream = videoRef.current?.srcObject;
		const tracks = stream?.getTracks();

		if (tracks) {
			tracks.forEach((track) => track.stop());
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
	};

	const playAudio = () => {
		const audio = new Audio(process.env.PUBLIC_URL + "/audio/beep.mp3"); // For public folder
		audio.play();
	};

	const getSearchItemByBarcode = async(item_s_code)=>{
		await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/item?keyword=${item_s_code}`)
		.then(({data})=>{
			if(data?.message === "success"){
				handleShowInput(data.items[0])		
			} ;
		})
		.catch((error)=>{
			notification("error" , error.response.data.message)
		})
	}

	//! =================================== :







	// ^-------------------------------------------------------------------------------

	const getSearchItem = async(values)=>{
		if(values.item_s_code.length >= 4){
			const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/item?keyword=${values.item_s_code}`)
			.catch((error)=>{
				notification("error" , error.response.data.message)
			})

			//^ Check Login Success User :
			if(data?.message === "success"){
				setSearch(data.items);
				console.log(data.items);
			}
		}else{
			setSearch([]);
		}
	}
	const validationSchema = Yup.object({
		item_s_code: Yup.string().required("This field is required"),
	});
   const formik = useFormik({
      initialValues:{
         item_s_code:"" ,
      } , validationSchema , 
      onSubmit:getSearchItem
   })



	async function submitAddItem(values){
		let deep = {...values} ;

		const name = selectItem.name ;
		const sap = selectItem.item_s_code ;
		const item = selectItem._id


		//^ Check Repeat Item :
		const existItem = listItem.find((ele)=> ele.item === item) ;
		if(existItem){
			notification("error" , "Item Already Added") ;
			return ;
		}
		
		//^ Check Valid Expired Date :
		const  expired_date =  new Date(values.expired_date).getTime() ;
		const  current_date =  new Date().getTime() ;         
		if(current_date > expired_date){
			notification("error" , "Expired  Invalid, Please Enter Valid Expired.!") ;
			return ;
		} ;
		
		
		values.item = item ;
		setListItem([...listItem , values]) ;
		
		
		deep.name = name ;
		deep.sap = sap ;
		deep.item = item ;
		setListName([...listName , deep]) ;
		
		// Reset Input Value :
		formikItem.resetForm();
		setSelectItem(null);
		setShowEdit(false);
	}
	let validationSchemaAddItem = Yup.object().shape({
		item_quantity:Yup.string() ,
		expired_date:Yup.string() ,
	})
	let formikItem = useFormik({
		initialValues:{
			item_quantity:"" ,
			expired_date:"" ,
		} , validationSchemaAddItem , 
		onSubmit:submitAddItem
	})


	function handleShowInput(ele){
		setSelectItem(ele) ;
		setShowEdit(true) ;
		setSearch([]) ;
	}
	
	return (
		<Fragment>
			<div className="container my-5 p-0">
				{display?                                        
						<i onClick={()=>{setDisplay(false)}} className=" btn main-color fa-solid fa-2x fa-magnifying-glass m-3"></i>
					: 
						<i onClick={()=>{setDisplay(true)}} className="btn main-color fa-solid fa-2x fa-barcode m-3"></i>
				}



				{display? 
						<div>
							{/* Video Screen Scan Barcode */}
							{/* Camera Video Stream */}
							{display && (
								<div className="video-container">
									<video ref={videoRef}/>
								</div>
							)}
						</div> 
					: 
						<div>
							{/* Search Item Name or Sap Code */}
							{listName.length?
									listName.map((ele)=>   
										<div className="row justify-content-center align-item-center bg-white border rounded-1 p-1 fw-bold m-0 my-1 text-success cursor bg-body-tertiary ">
											<div  className={`orderItem row col-10 p-0 m-0 `}>

												<div className="col-12 m-0 p-0">
													<span>{ele.name?.split(" ").splice(0 , 7).join(" ")}</span>
												</div>
												<div className="col-4 m-0 p-0">
													<span>{ele.sap}</span>
												</div>
												<div className="col-4 m-0 p-0">
													<span>Expired :{ele.expired_date}</span>
												</div>
												<div className="col-4 m-0 p-0">
													<span>Quantity:{ele.item_quantity}</span>
												</div>

											</div>

											<div  className="col-1 p-0 m-0 d-flex justify-content-center align-items-center">
												<button onClick={()=>{deleteItem(ele.item)}} className="btn btn-sm btn-close"></button>
											</div>
										</div>
									)
								: 
									<p className="text-center p-0 m-0 ">لا يوجد اصناف</p>
							}


							{showEdit? 
									<form action="" onSubmit={formikItem.handleSubmit} className="row mt-4 border border-3 rounded-3 p-1 m-1">
											<p> {selectItem.item_s_code} : {selectItem.name}</p>
											{/* Enter Expire Date this item */}
											<div className="col-6 p-0">
												<div className="m-1">
													<input type="date" 
														value={formikItem.values.expired_date}
														onChange={formikItem.handleChange} 
														onBlur={formikItem.handleBlur}
														className="form-control py-1" id="expired_date"  
														name="expired_date" 
														required ref={expired}/>
													{formikItem.errors.expired_date  && formikItem.touched.expired_date?<div className="text-danger m-0 p-0">{formikItem.errors.expired_date}</div> :""}
												</div>
											</div>

											{/* Enter Quantity this item */}
											<div className="col-6 p-0">
												<div className="m-1">
													<input type="number" 
														value={formikItem.values.item_quantity}
														onChange={formikItem.handleChange} 
														onBlur={formikItem.handleBlur}
														className="form-control py-1" id="item_quantity"  
														name="item_quantity" 
														required
														placeholder="Enter Quantity" ref={quantity}/>
													{formikItem.errors.item_quantity  && formikItem.touched.item_quantity?<div className="text-danger m-0 p-0">{formikItem.errors.item_quantity}</div> :""}
												</div>
											</div>

											{/* Button add item in this order*/}
											<div className="text-center">
												<button type="submit" className="btn bg-main text-white mt-2 w-25 p-0">Add</button>
											</div>
									</form>
								: 
									""
							}

							<form onChange={formik.handleSubmit}>
								<div style={{ marginBottom: "20px" }}>
									<div style={{ marginTop: "5px" }}>
										<label htmlFor="item_s_code">تقدر تبحث بالاسم  او رقم الساب الخاص بالصنف</label>
										<input type="text" id="item_s_code" name="item_s_code" value={formik.values.item_s_code}
											onChange={formik.handleChange} placeholder="Search item by name or sap number" className="form-control" 
											style={{
												width: "100%",
												padding: "10px",
												border: "1px solid #ccc",
												borderRadius: "5px",
											}}
										/>
									</div>
								</div>

								<div className='px-2 bg-body-secondary rounded-2 overflow-auto'>
									{search.length > 0 ? search.map((ele)=>
										<p onClick={()=>{handleShowInput(ele)}} className='btn bg-white p-1 w-100 my-1'> {ele.item_s_code} : {ele.name}</p>
									) : ""}
								</div>
							</form>
							
						</div>
				}
				<p className='main-color fs-4 text-center fw-bold my-2'>{result}</p>
			</div>
		</Fragment>
	) ;
} ;
