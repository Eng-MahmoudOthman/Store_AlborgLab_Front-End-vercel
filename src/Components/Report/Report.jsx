import { Fragment, useContext } from 'react' ;
import {Link} from 'react-router-dom' ;
import { ReportContext } from '../../Context/ReportContext.js';
import Loading from '../Loading/Loading.jsx';




export default function Report() {
   const {
      getAllConsumption , 
      getCurrentConsumption , 
      getAllQuantity ,
      getExpiredQuantity ,
      getNotExpiredQuantity ,
      getExpiredQuantityCurrentMonth ,
      getOrdersPDF ,
      getReceivePDF ,
      getTransferPDF ,
      loading
   } = useContext(ReportContext) ;


   return (
      <Fragment>
         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Reports</li>
            </ol>
         </nav>
         <div className='container'>
            <h1 className='main-header mb-2'>إنشاء التقارير</h1>

            {loading? 
                  <div>
                     <p className='text-center fw-bold text-primary'>جارى إنشاء التقرير يرجى الانتظار لحظات</p> 
                     <p className='text-center fw-bold text-primary'>❤  😊 ممكن تذكر ربنا فيها ❤</p> 
                     <p className='text-center fw-bold text-primary'>قال رسول الله ﷺ: "ما يصيب المؤمن من نصب ولا وصب ولا همّ ولا حزن حتى الشوكة يشاكها إلا كفر الله بها من خطاياه"</p> 
                     <button className="btn bg-main w-100 mt-2 rounded-2 p-1"> <Loading type="oval" color="white"  width={25} height={25} strokeWidth="6"/></button>
                  </div>
               : 
                  <div className='container'>



                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getCurrentConsumption("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getCurrentConsumption("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الأستهلاك الحالى</button>
                        </div>
                     </div>




                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getAllConsumption("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getAllConsumption("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الأستهلاك الكلى</button>
                        </div>
                     </div>



                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getAllQuantity("download" , "")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getAllQuantity("seen" , "")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الاصناف</button>
                        </div>
                     </div>



                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getExpiredQuantity("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getExpiredQuantity("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الاصناف منتهية الصلاحية</button>
                        </div>
                     </div>



                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getNotExpiredQuantity("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getNotExpiredQuantity("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الاصناف غير منتهى الصلاحية </button>
                        </div>
                     </div>



                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getExpiredQuantityCurrentMonth("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getExpiredQuantityCurrentMonth("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد الاصناف المنتهية خلال شهر  </button>
                        </div>
                     </div>


                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getTransferPDF("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getTransferPDF("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد كل الاصناف المرسلة</button>
                        </div>
                     </div>


                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getReceivePDF("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getReceivePDF("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد كل الاصناف المستلمة</button>
                        </div>
                     </div>



                     <div className='row g-1 my-2'>
                        <div className="col-2">
                           <button onClick={()=>{getOrdersPDF("download")}} className='btn btn-danger btn-sm w-100' ><i class="fa-solid fa-download"></i></button>
                        </div>
                        <div className="col-2">
                           <button onClick={()=>{getOrdersPDF("seen")}} className='btn btn-success btn-sm w-100'><i class="fa-solid fa-eye"></i></button>
                        </div>
                        <div className="col-8">
                           <button className='btn bg-main btn-sm w-100'>جرد جميع الطلبيات </button>
                        </div>
                     </div>
                  </div>
            }
         </div>
      </Fragment>
   )
}
