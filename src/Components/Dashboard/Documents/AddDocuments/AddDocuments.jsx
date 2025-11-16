import { useContext, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { DocumentContext } from "../../../../Context/DocumentContext.js";
import Loading from "../../../Loading/Loading.jsx";

export default function AddDocuments() {
   const { AddDocument, loading } = useContext(DocumentContext) ;
   const closeBtnRef = useRef() ;

   const handleSubmit = async (values, { resetForm }) => {
      const formData = new FormData() ;
      formData.append("title", values.title) ;
      formData.append("description", values.description) ;
      formData.append("file", values.file) ;

      await AddDocument(formData) ; 
      resetForm() ;
      closeBtnRef.current.click() ;
   } ;

   const initialValues = {
      title: "",
      description: "",
      file: null,
   } ;

   const validationSchema = Yup.object({
      title: Yup.string()
         .min(2, "Name Should be More than 2")
         .max(50, "Name less than 50")
         .required("Name is Required")
         .trim(),
      description: Yup.string().required("Description is Required").trim(),
      file: Yup.mixed()
         .required("PDF file is required")
         .test("fileType", "Only PDF files are allowed", (value) => {
            return value && value.type === "application/pdf";
         }),
   }) ;

   return (
      <div className="AddDocument-container">
         <div
         className="modal fade"
         id="AddDocument"
         tabIndex="-1"
         aria-labelledby="AddDocumentLabel"
         aria-hidden="true"
         >
         <div className="modal-dialog ">
            <div className="modal-content">
               <div className="modal-header">
               <h5 className="modal-title" id="AddDocumentLabel">
                  Add New Document
               </h5>
               <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={closeBtnRef}
               ></button>
               </div>

               <div className="modal-body">
               <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
               >
                  {({ setFieldValue }) => (
                     <Form encType="multipart/form-data">
                     <div className="mb-3">
                        <label className="form-label">Title</label>
                        <Field type="text" name="title" className="form-control" />
                        <div className="text-danger">
                           <ErrorMessage name="title" />
                        </div>
                     </div>

                     <div className="mb-3">
                        <label className="form-label">Description</label>
                        <Field type="text" name="description" className="form-control" />
                        <div className="text-danger">
                           <ErrorMessage name="description" />
                        </div>
                     </div>

                     <div className="mb-3">
                        <label className="form-label">Upload PDF</label>
                        <input
                           type="file"
                           name="file"
                           accept="application/pdf"
                           className="form-control"
                           onChange={(event) => {
                           setFieldValue("file", event.currentTarget.files[0]);
                           }}
                        />
                        <div className="text-danger">
                           <ErrorMessage name="file" />
                        </div>
                     </div>

                     <div className="d-flex justify-content-start">
                        {loading ? (
                           <button className="btn btn-primary">
                              <Loading color="white" width={20} height={20} strokeWidth="6" />
                           </button>
                        ) : (
                           <button type="submit" className="btn btn-primary">
                              Create Document
                           </button>
                        )}
                     </div>
                     </Form>
                  )}
               </Formik>
               </div>
            </div>
         </div>
         </div>
      </div>
   ) ;
}
