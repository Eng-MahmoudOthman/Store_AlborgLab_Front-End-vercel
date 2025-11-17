import { Fragment, useContext, useEffect } from 'react' ;
import style from "./addTransfer.module.css"
import Loading from '../../Loading/Loading.jsx';
import { QuantityContext } from '../../../Context/QuantityContext.js';

import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddTransfer({branches , loadingBranch}) {
      const{ getBranchQuantities , quantities , loading , addTransfer , loadingTransfer} = useContext(QuantityContext) ;
      

      const submitTransfer = async(values , { resetForm })=>{
         await addTransfer(values ,  resetForm ) ;
      } ;

      const validationSchema = Yup.object({
         quantity: Yup.string().required("Please choose an item"),
         receiver_branch: Yup.string().required("Please choose a branch"),
         quantity_transferred: Yup.number().required("Enter quantity").min(1, "Quantity must be at least 1"),
      }) ;

      const formik = useFormik({
         initialValues:{
            quantity: "",
            receiver_branch: "",
            quantity_transferred: "",
         } , validationSchema , 
         onSubmit:submitTransfer
      }) ;

      useEffect(() => {
         getBranchQuantities("" ,"", "false")
      }, []) ;
   
   return (
      <Fragment>
         <div className='container'>
            <h2 className='h4'>Add New Transfer :</h2>
                  <div className='row'>
                     <div className='col-md-10 border border-2 rounded-2 p-2 m-auto'>
                        <h5 className='p-0 m-0'>Transfer Information :</h5>

                        <form onSubmit={formik.handleSubmit}>
                           {/* Items in branch */}
                           <div className="my-2 position-relative">
                              {loading ? (
                                 <i className={`${style.loading} spinner-border fa-xl text-black position-absolute`}></i>
                              ) : null}

                              <label htmlFor="item" className="form-label required">Items in branch</label>

                              <select
                                 className={`${style.form} form-control`}
                                 id="quantity"
                                 name="quantity"
                                 onChange={formik.handleChange}
                                 value={formik.values.quantity}
                                 required
                              >
                                 <option value="">Choose Item</option>
                                 {quantities.length > 0 &&
                                    quantities.map((ele) => (
                                       <option key={ele._id} value={ele._id}>
                                          {`${ele.item?.item_s_code} | Qn: ${ele.item_quantity} | ${ele.name} | ${new Date(ele.expired_date).toISOString().slice(0, 10)}`}
                                       </option>
                                    ))}
                              </select>

                              {formik.touched.quantity && formik.errors.quantity ? (
                                 <div className="text-danger small">{formik.errors.quantity}</div>
                              ) : null}
                           </div>

                           {/* Receive Branch */}
                           <div className="my-2 position-relative">
                              {loadingBranch ? (
                                 <i className={`${style.loading} spinner-border fa-xl text-black position-absolute`}></i>
                              ) : null}

                              <label htmlFor="receiver_branch" className="form-label required">Receive Branch</label>

                              <select
                                 className={`${style.form} form-control`}
                                 id="receiver_branch"
                                 name="receiver_branch"
                                 onChange={formik.handleChange}
                                 value={formik.values.receiver_branch}
                                 required
                              >
                                 <option value="">Choose Receive Branch</option>
                                 {branches.length > 0 &&
                                    branches.map((ele) => (
                                       <option key={ele._id} value={ele._id}>
                                          {ele.name}
                                       </option>
                                    ))}
                              </select>

                              {formik.touched.receiver_branch && formik.errors.receiver_branch ? (
                                 <div className="text-danger small">{formik.errors.receiver_branch}</div>
                              ) : null}
                           </div>

                           {/* Enter Quantity */}
                           <div className="my-2 position-relative">
                              <label htmlFor="quantity_transferred" className="form-label required">Enter Quantity</label>
                              <input
                                 onChange={formik.handleChange}
                                 value={formik.values.quantity_transferred}
                                 className='form-control'
                                 type="number"
                                 id="quantity_transferred"
                                 name="quantity_transferred"
                                 required
                              />

                              {formik.touched.quantity_transferred && formik.errors.quantity_transferred ? (
                                 <div className="text-danger small">{formik.errors.quantity_transferred}</div>
                              ) : null}
                           </div>

                           {/* Submit Button */}
                           <div className='text-center'>
                              {loadingTransfer ? (
                                 <button className="btn bg-main w-50 mt-2 rounded-0 p-1" disabled>
                                    <Loading type="oval" color="white" width={25} height={25} strokeWidth="6" />
                                 </button>
                              ) : (
                                 <button type="submit" className="btn bg-main w-50 rounded-0">
                                    Transfer
                                 </button>
                              )}
                           </div>
                        </form>
                     </div>
                  </div>
               {/* </>            
            } */}
         </div>
      </Fragment>
   )
}
