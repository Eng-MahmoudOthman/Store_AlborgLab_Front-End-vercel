
import {useContext, useRef, useState} from 'react' ;
import { ErrorMessage, Field, Form, Formik,  } from "formik" ;
import * as Yup from 'yup';
import Loading from '../../../Loading/Loading.jsx';
import { UserContext } from '../../../../Context/UserContext.js';
import axios from 'axios';
import notification from '../../../../Utilities/notification.js';

export default function SendMessageUsers() {
   const [loading , setLoading]= useState(false) ;
   const {userToken } = useContext(UserContext) ;
   const closeBtnRef = useRef() ;
   
   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
   }

   async function sendMessage(values){
      setLoading(true) ;
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/users/advert` , values ,  {headers:header} )
      .then(({data})=>{
         if(data.message === "success"){
            notification("success" , "Send Message Successfully")
         }
         setLoading(false) ;
      })
      .catch((error)=>{
         notification("error" , error.response.data.message) ;
         console.log(error.response.data.message);
         setLoading(false) ;
      })
   }


   const handleSubmit = async(values, { resetForm }) => {
      sendMessage(values) ;
      resetForm();
      closeBtnRef.current.click() ;
   };
   const initialValues = {
      title:"" ,
      message:"" , 
   };
   const validationSchema = Yup.object({
      title:Yup.string().min(2 , "Name Should be More than 2").max(50 , "Name less than 50").required("Name is Required").trim() ,
      message:Yup.string().min(2 , "Name Should be More than 2").max(5000 , "Name less than 5000").required().trim() ,
   });


   return (
         <div className="sendMessageUsers-container">
            <div className="modal fade" id="sendMessageUsers" tabIndex="-1" aria-labelledby="sendMessageUsersLabel" aria-hidden="true">
               <div className="modal-dialog ">
                  <div className="modal-content">

                     <div className="modal-header">
                        <h5 className="modal-title" id="sendMessageUsersLabel">Send Message All Users</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeBtnRef}></button>
                     </div>

                     <div className="modal-body">
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize >
                           <Form>

                              <div className="mb-3">
                                 <label className="form-label">Title</label>
                                 <Field type="text" name="title" className="form-control" />
                                 <div className="text-danger"><ErrorMessage name="title" /></div>
                              </div>


                              <div className="mb-3">
                                 <label className="form-label">Message</label>
                                 <Field as="textarea" name="message" className="form-control" rows={6}  />
                                 <div className="text-danger"><ErrorMessage name="message" /></div>
                              </div>


                              <div className="d-flex justify-content-start">
                                 {loading ? 
                                       <button className="btn btn-primary"> <Loading color="white"  width={20} height={20} strokeWidth="6"/></button>
                                    : 
                                       <button type="submit" className="btn btn-primary">Send Message</button>
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
