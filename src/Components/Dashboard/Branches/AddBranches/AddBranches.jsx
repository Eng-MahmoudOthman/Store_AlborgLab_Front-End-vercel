
import {useContext, useRef } from 'react'
import { ErrorMessage, Field, Form, Formik,  } from "formik" ;
import * as Yup from 'yup';
import { BranchContext } from '../../../../Context/BranchContext.js';
import Loading from '../../../Loading/Loading.jsx';

export default function AddBranches({companies}) {
   const {addBranch , loading} = useContext(BranchContext) ;
   const closeBtnRef = useRef() ;
   


   const handleSubmit = async(values, { resetForm }) => {
      addBranch(values)
      resetForm();
      closeBtnRef.current.click() ;
   };


   const initialValues = {
      name:"" ,
      phone:"" ,
      email:"" ,
      branch_area:"" ,
      company:"" , 
   };

   const validationSchema = Yup.object({
      name:Yup.string().min(2 , "Name Should be More than 2").max(50 , "Name less than 50").required("Name is Required").trim() ,
      phone:Yup.string().required().trim() ,
      email:Yup.string().email().required().trim() ,
      branch_area: Yup.string().required().trim() ,
      company:Yup.string().required().trim() ,
   });


   const area = [
      {name:"المهندسين"},
      {name:"الجيزة"},
      {name:"المنيل"},
      {name:"المعادي"},
      {name:"وسط البلد"},
      {name:"شبرا"},
      {name:"Hilopolis"},
      {name:"مصر الجديدة"},
      {name:"شرق القاهرة"},
      {name:"مدينة نصر"},
      {name:"القاهرة الجديدة"},
      {name:"العبور"},
      {name:"وسط البلد"},
      {name:"اكتوبر"},
      {name:"زايد"},
      {name:"اسكندرية"},
      {name:"الـوزارة"},
      {name:"فيكتوريا"},
      {name:"الرمـل"},
      {name:"المندرة"},
      {name:"محرم بك"},
      {name:"العجمى"},
      {name:"سموحة"},
      {name:"الإبراهيمية"},
      {name:"العامرية"},
      {name:"الورديان"},
      {name:"مرسى مطروح"},
      {name:"السيوف"},
      {name:"البحيرة"},
      {name:"الكيلو 21"},
      {name:"دمنـهـور"},
      {name:"الدلنجات"},
      {name:"ابوالمطامير"},
      {name:"كفر الدوار"},
      {name:"ايتاي البارود "},
      {name:"كوم حمادة "},
      {name:"رشيد"},
      {name:"المحموديه"},
      {name:"ابوحمص"},
      {name:"النوباريه"},
      {name:"القليوبية"},
      {name:"المنوفية"},
      {name:"الغربية"},
      {name:"القناة"},
      {name:"شرم الشيخ"},
      {name:"دمياط"},
      {name:"الشرقية"},
      {name:"الدقهلية"},
      {name:"شمال الصعيد"},
      {name:"وسط الصعيد"},
      {name:"جنوب الصعيد"},
   ]



   return (
         <div className="AddBranch-container">
            <div className="modal fade" id="AddBranch" tabIndex="-1" aria-labelledby="AddBranchLabel" aria-hidden="true">
               <div className="modal-dialog ">
                  <div className="modal-content">

                     <div className="modal-header">
                        <h5 className="modal-title" id="AddBranchLabel">Add New Branch</h5>
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
                                 <label className="form-label">Email</label>
                                 <Field type="email" name="email" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="email" /></div>
                              </div>


                              <div className="mb-3">
                                 <label className="form-label">Phone</label>
                                 <Field type="tel" name="phone" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="phone" /></div>
                              </div>


                              <div className="mb-3">
                                 <label htmlFor="company" className="form-label d-block">Company</label>

                                 <Field as="select" name="company" id="company" className="form-select">
                                    <option value="">Choose Company</option>
                                    {companies.map((ele)=><option  key={ele._id} value={ele._id}>{ele.name}</option>)}
                                 </Field>

                                 <div className="text-danger">
                                    <ErrorMessage name="company" />
                                 </div>
                              </div>


                              <div className="mb-3">
                                 <label htmlFor="branch_area" className="form-label d-block">Branch Area</label>

                                 <Field as="select" name="branch_area" id="branch_area" className="form-select">
                                    <option value="">Choose Area</option>
                                    {area.map((ele)=><option key={ele.name} value={ele.name}>{ele.name}</option>)}
                                 </Field>

                                 <div className="text-danger">
                                    <ErrorMessage name="branch_area" />
                                 </div>
                              </div>


                              <div className="d-flex justify-content-start">
                                 {loading ? 
                                       <button className="btn btn-primary"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                    : 
                                       <button type="submit" className="btn btn-primary">Create Branch</button>
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
