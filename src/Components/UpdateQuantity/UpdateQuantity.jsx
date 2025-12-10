
import {useContext, useRef } from 'react'
import { ErrorMessage, Field, Form, Formik,  } from "formik" ;
import * as Yup from 'yup';
import { QuantityContext } from '../../Context/QuantityContext.js';
import Loading from '../Loading/Loading.jsx';
import Swal from 'sweetalert2';
import notification from '../../Utilities/notification.js';


export default function UpdateQuantity({id}) {
   const {updateQuantity , loading} = useContext(QuantityContext) ;
   const closeBtnRef = useRef() ;
   
   const handleSubmit = async(values, { resetForm }) => {


      //3- Validation Expired Date :
      const  expiredDate =  new Date(values.expired_date).getTime() ;
      const  currentDate =  new Date().getTime() ;
      if(currentDate >= expiredDate) return notification("error" , "Expired Date Not Valid .!")
      


      Swal.fire({
         title:"Update this Quantity? Are you sure?" ,
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, update it!"
      }).then((result) => {
         if (result.isConfirmed) {
            updateQuantity(id , values) ;
            Swal.fire({
               title: "Updated!",
               text: "Your file has been Update.",
               icon: "success"
            });
         }
      });
      resetForm();
      closeBtnRef.current.click() ;
   };


   const initialValues = {
      item_quantity:"" ,
      expired_date:"" ,
   };

   const validationSchema = Yup.object({
      item_quantity:Yup.string().trim() ,
      expired_date:Yup.string().trim() ,
   });


   return (
         <div className="UpdateQuantity-container">
            <div className="modal fade" id="UpdateQuantity" tabIndex="-1" aria-labelledby="UpdateQuantityLabel" aria-hidden="true">
               <div className="modal-dialog ">
                  <div className="modal-content">

                     <div className="modal-header">
                        <h5 className="modal-title" id="UpdateQuantityLabel">Update Quantity</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeBtnRef}></button>
                     </div>

                     <div className="modal-body">
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize >
                           <Form>

                              <div className="mb-3 text-start">
                                 <label className="fs-6" >Item Quantity</label>
                                 <Field type="number" name="item_quantity" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="item_quantity" /></div>
                              </div>


                              <div className="mb-3  text-start">
                                 <label className="fs-6">Expire Date</label>
                                 <Field type="date" name="expired_date" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="expired_date" /></div>
                              </div>

                              <div className="d-flex justify-content-start">
                                 {loading ? 
                                       <button className="btn btn-primary"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                    : 
                                       <button type="submit" className="btn btn-primary">Save Change</button>
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
