
import {useContext, useRef } from 'react'
import { ErrorMessage, Field, Form, Formik,  } from "formik" ;
import * as Yup from 'yup';
import Loading from '../../../Loading/Loading.jsx';
import { QuantityContext } from '../../../../Context/QuantityContext.js';

export default function AddItems({categories}) {
   const {addItem , loading} = useContext(QuantityContext) ;
   const closeBtnRef = useRef() ;
   const handleSubmit = async(values, { resetForm }) => {
      addItem(values)
      resetForm();
      closeBtnRef.current.click() ;
   };



   const initialValues = {
      name:"" ,
      description:"" ,
      item_s_code:"" ,
      measure_unit:"" ,
      category:"" , 
   };

   const validationSchema = Yup.object({
      name:Yup.string().min(2 , "Name Should be More than 2").max(100 , "Name less than 50").required("Name is Required").trim() ,
      description:Yup.string().min(2 , "Name Should be More than 2").max(500 , "Name less than 50").required("Name is Required").trim() ,
      item_s_code:Yup.string().required().trim() ,
      measure_unit: Yup.string().required() ,
      category:Yup.string().required().trim() ,
   });



   return (
         <div className="AddItem-container">
            <div className="modal fade" id="AddItem" tabIndex="-1" aria-labelledby="AddItemLabel" aria-hidden="true">
               <div className="modal-dialog ">
                  <div className="modal-content">

                     <div className="modal-header">
                        <h5 className="modal-title" id="AddItemLabel">Add New Item</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeBtnRef}></button>
                     </div>

                     <div className="modal-body">
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize >
                           <Form>
                              <div className="mb-3">
                                 <label className="form-label">Name</label>
                                 <Field type="text" name="name" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="name" /></div>
                              </div>


                              <div className="mb-3">
                                 <label className="form-label">Description</label>
                                 <Field type="text" name="description" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="description" /></div>
                              </div>

 
                              <div className="mb-3">
                                 <label className="form-label">Item Sap Code</label>
                                 <Field type="text" name="item_s_code" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="item_s_code" /></div>
                              </div>

 
                              <div className="mb-3">
                                 <label className="form-label">Measure Unit</label>
                                 <Field type="text" name="measure_unit" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="measure_unit" /></div>
                              </div>


                              <div className="mb-3">
                                 <label className="form-label d-block">Category</label>
                                 <Field as="select" name="category"  className="form-select">
                                    <option value="">Choose Category</option>
                                    {categories.map((ele)=><option  key={ele._id} value={ele._id}>{ele.name}</option>)}
                                 </Field>
                                 <div className="text-danger"><ErrorMessage name="category" /></div>
                              </div>

                              <div className="d-flex justify-content-start">
                                 {loading ? 
                                       <button  className="btn btn-primary"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                    : 
                                       <button type="submit" className="btn btn-primary">Create Item</button>
                                 }
                              </div>
                           </Form>
                        </Formik>
                     </div>

                  </div>
               </div>
            </div>
         </div>
      );
}
