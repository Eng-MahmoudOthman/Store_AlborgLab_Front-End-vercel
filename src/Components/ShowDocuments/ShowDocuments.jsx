
import { Fragment, useContext, useEffect } from 'react' ;
import { Link } from 'react-router-dom';
import { DocumentContext } from '../../Context/DocumentContext.js';
import CustomTitle from '../CustomTitle/CustomTitle.jsx';
import Loading from '../Loading/Loading.jsx';
import TimeAgo from '../TimeAgo/TimeAgo.jsx';
import style from "./showDocuments.module.css" ;


export default function ShowDocuments() {
      const {getDocuments , documents , documentsCount , loading } = useContext(DocumentContext)  ; 
   
      function handleSearch(search){
         if(search.length >= 3){
            getDocuments(search.toLowerCase())
         }else if(search.length === 0){
            getDocuments("")
         }
      } ;


      useEffect(() => {
         getDocuments("") ;
      }, [])


   return (
      <Fragment>
         <CustomTitle title="Documents Dashboard" />

         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Documents</li>
            </ol>
         </nav>

         <div className='container'>
            <h1 className='main-header my-4'>Documents</h1>

            <div className="mb-1">
               <form >
                  <div className='position-relative'>
                     <input  type="search" onChange={(e) => handleSearch(e.target.value)}  className='form-control' id='search' placeholder='Search Documents more than 3 char'  name="search" />
                  </div>
               </form>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
               <p className='m-0 p-0 mx-3'><i className="fa-solid fa-mug-saucer mx-2"></i> Documents Count  : <span className='fw-bold text-success'>{documents.length || 0}</span> From <span className='fw-bold text-danger'>{documentsCount}</span></p>
            </div>


            {loading? 
                  <Loading type="large" color="gray"/> 
               : 
               <>
                  {documents.length? 
                     documents.map((ele)=>
                        <div key={ele._id} className={`${style.card} border border-2 rounded-2 m-3 p-2  position-relative overflow-hidden `}>
                           <div className={``}>
                              <p className='m-0 p-0 d-flex justify-content-between'><span className='fw-bold'>Num: {ele.itemNumber || 1000}</span> <TimeAgo  showTimeOnly={true} createdAt={ele.createdAt} /></p>
                              <p className='m-0 p-0'><span className='fw-bold'>Title: </span>{ele.title}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>Description: </span>{ele.description}</p>
                              <p className='m-0 p-0 '><span className='fw-bold'>Created At : </span>{new Date(ele.createdAt).toISOString().slice(0, 10)}</p>
                           </div>

                           <div className={`${style.sidIcon} text-center rounded-2 position-absolute text-primary bg-primary-subtle`}>
                              <p className='m-0 p-0 my-3'>
                                 <a href={ele.pdf?.secure_url} target='_blank' rel='noopener noreferrer'>
                                    <i className="fa-solid fa-download text-success"></i>
                                 </a>
                              </p>                             
                           </div>
                        </div>
                     )
                  : <p className='text-danger fw-bold'>Documents List Is Empty</p>

                  }
               </>
            }
         </div>
      </Fragment>
   )
}
