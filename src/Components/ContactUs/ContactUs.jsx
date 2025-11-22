import { Fragment, useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import notification from '../../Utilities/notification.js';
import style from "./contactUs.module.css";
import Loading from '../Loading/Loading.jsx';




export default function ContactUs() {
   const [error , setError] = useState(null)
   const [loading , setLoading] = useState(false)
   
   
   async function submitComplaint(values , {resetForm}){
      setLoading(true)
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/users/complaint` , values)
      .then(({data})=>{
         setError(null) ;
         notification("success" , data.message )
         setLoading(false) ;
         resetForm()
      })
      .catch((error)=>{
         setError(error.response.data.message)
         console.log(error.response.data.message);
         setLoading(false)
      })
   }
   const validationSchema = Yup.object({
      message:Yup.string().required().trim() ,
      phone:Yup.string().trim() ,
   })
   const formik = useFormik({
      initialValues:{
         message:""  ,
         phone:""  ,
      } , validationSchema , 
      onSubmit:submitComplaint
   })

   return (
      <Fragment>
         <div className='container position-relative'>
            <section className='fixed-top'>
               <div className="text-center my-3">
                  <Link to="/" className={`btn ${style.btnBack}`}>
                     <i className="fas fa-arrow-right"></i>
                     رجوع إلى تسجيل الدخول
                  </Link>
               </div>
            </section>

            <section className={`${style.fixedBottom}`}>
               <div className="text-center my-3">
                  <Link to={`https://wa.me/201126999142`} className={`btn`}>
                     <img src="/WhatsApp.png" className='w-100' alt="WhatsApp" srcset="" />
                  </Link>
               </div>
            </section>

            <section>
               <div className={`${style.aboutContainer}`}>
               <h2>من نحن</h2>

               <p>
                  نحن فريق من <strong>الكيميائيين العاملين بفرع برج العياط</strong>، جمعنا هدف واحد:
                  <br />
                  <strong>تبسيط شغلنا اليومي، وترتيبه، وتحسين التجربة العملية لكل زميل بيستخدم النظام.</strong>
               </p>

               <p>
                  بدأت الفكرة من احتياج حقيقي داخل الشغل:
               </p>

               <ul>
                  <li className='p-0 m-0 '>🧪  تنظيم البيانات </li>
                  <li className='p-0 m-0'>🧪  متابعة المخزون</li>
                  <li className='p-0 m-0'>🧪  متابعة منتهية الصلاحية</li>
                  <li className='p-0 m-0'>🧪  ضبط الاستهلاك</li>
                  <li className='p-0 m-0'>🧪  سهولة جرد المخزن</li>
                  <li className='p-0 m-0'>🧪  طباعة تقارير للجرد والاستهلاك والطلبية </li>
                  <li className='p-0 m-0'>🧪  تسهيل التواصل بين الفريق</li>
               </ul>

               <p className='p-0 m-0'>
                  ومن هنا قررنا نطوّر أداة تساعدنا وتساعد زمايلنا، بأسلوب عملي وبسيط يناسب طبيعة
                  شغل المعامل والمخازن والفروع.
               </p>

               <p>
                  اشتغلنا على النظام <strong>بروح فريق واحد</strong> وبطريقة واضحة من غير تعقيد،
                  علشان أي حد يستخدم المنصة يحس إن شغله بقى:
                  <br />
                  <strong>أسهل – أسرع – أوضح.</strong>
               </p>

               <p>
                  إحنا <strong>مش شركة برمجيات</strong>، ومش خارجين عن سياسات المكان.
                  <br />
                  إحنا فريق عمل حابب يطوّر الأدوات اللي بيستخدمها، ويقدّم حاجة مفيدة لنفسه
                  وللزمايله— <strong>بسلاسة، وباحترام كامل لطبيعة الشغل وبدون أي تدخل في القرارات الإدارية أو التشغيلية.</strong>
               </p>

               <p>
                  ونشتغل دايمًا إن النظام يفضل:
                  <br />
                  <strong>واضح – محترم – داعم لشغلنا الحقيقي داخل الفرع.</strong>
               </p>
               <p>
                  بداية إنشاء المشروع:
                  <br />
                  <strong>تم إنشاء هذا العمل من الفترة 1-1-2024 الى الفترة  1-1-2025 <br/> تحت  إشراف مديرة أقليم القاهرة الكبرى الدكتورة : <strong> سوزان شاكر صموئيل  </strong>   <br/> وتحت الاشراف المباشر من الدكتور :<strong>عماد الدين على محمد </strong>  مدير منطقة الهرم والقائم  بأعمال مدير فرع العياط فى هذة الفترة  </strong>            
               </p>


               <p className={`${style.footerText}`}>
                  وبنرحّب بأي اقتراح أو فكرة تساعدنا نطوّره للأفضل.
               </p>
               </div>
            </section>

            <section className={`${style.systemSection} container`}>
               <h2 className={`${style.title}`}>ما الذي يقدمه لنا النظام؟</h2>
               <p className={`${style.intro}`}>
                  النظام اتعمل علشان يسهّل شغلنا ويخلّي يومنا في الفرع ماشي بسلاسة ومن غير لخبطة،
                  وبيوفر لنا مجموعة أدوات عملية بنستخدمها يوميًا، أهمها:
               </p>

               <div className={`${style.featuresGrid}`}>

                  {/* <!-- Organizing Data --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-database ${style.iconSystem}`}></i>
                     <h3>تنظيم البيانات</h3>
                     <p>تجميع كل البيانات المهمة في مكان واحد والوصول السريع ليها.</p>
                  </div>

                  {/* <!-- Inventory Tracking --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-warehouse ${style.iconSystem}`}></i>
                     <h3>متابعة المخزون</h3>
                     <p>معرفة المتاح، الناقص، والمستهلك بطريقة واضحة وسهلة.</p>
                  </div>

                  {/* <!-- Usage Management --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-file-invoice ${style.iconSystem}`}></i>
                     <h3>إدارة الاستهلاك</h3>
                     <p>تسجيل الاستهلاك اليومي أو الشهري والرجوع ليه في أي وقت.</p>
                  </div>

                  {/* <!-- Product Movement --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-arrows-spin ${style.iconSystem}`}></i>
                     <h3>متابعة حركة الأصناف</h3>
                     <p>تتبع الصنف من لحظة دخوله للفرع لحد استخدامه.</p>
                  </div>

                  {/* <!-- Reduce Errors --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-shield-halved ${style.iconSystem}`}></i>
                     <h3>تقليل الأخطاء البشرية</h3>
                     <p>معلومات واضحة ومنظمة تقلل نسب الخطأ مقارنة بالشغل اليدوي.</p>
                  </div>

                  {/* <!-- Team Communication --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-people-group ${style.iconSystem}`}></i>
                     <h3>تسهيل التواصل داخل الفريق</h3>
                     <p>عرض آخر التحديثات وتوضيح المهام بدون لخبطة.</p>
                  </div>

                  {/* <!-- Speed --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-bolt ${style.iconSystem}`}></i>
                     <h3>سرعة في الأداء</h3>
                     <p>خطوات أسرع بدل التدوين اليدوي والبحث المتكرر.</p>
                  </div>

                  {/* <!-- Easy UI --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-laptop-code ${style.iconSystem}`}></i>
                     <h3>واجهة بسيطة وسهلة</h3>
                     <p>تصميم يناسب أي مستوى خبرة في استخدام الكمبيوتر.</p>
                  </div>

                  {/* <!-- Expandable --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-layer-group ${style.iconSystem}`}></i>
                     <h3>قابل للتطوير</h3>
                     <p>إمكانية إضافة مميزات جديدة حسب طبيعة شغل الفرع.</p>
                  </div>

                  {/* <!-- NEW: Reports + Barcode --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-barcode ${style.iconSystem}`}></i>
                     <h3>تقارير + باركود الأصناف</h3>
                     <p>إصدار تقارير جرد وباركود كامل لكل صنف داخل أي طلبية.</p>
                  </div>

                  {/* <!-- NEW: Expiry Alerts --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-hourglass-end ${style.iconSystem}`}></i>
                     <h3>تنبيه انتهاء الصلاحية</h3>
                     <p>تنبيه أوتوماتيكي قبل انتهاء صلاحية الأصناف بشهر كامل.</p>
                  </div>

                  {/* <!-- NEW: Request & Lab Forms --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-file-lines ${style.iconSystem}`}></i>
                     <h3>جميع النماذج اليومية</h3>
                     <p>
                     نماذج الطلبيات، تقارير الباثولوجي، الوراقة، طلبية الباراسيتولوجي،
                     وكتيب الكيميائيين — كلهم في مكان واحد وسهل التحميل.
                     </p>
                  </div>

                  {/* <!-- NEW: Transfer Reports --> */}
                  <div className={`${style.featureBox}`}>
                     <i className={`fa-solid fa-right-left ${style.iconSystem}`}></i>
                     <h3>تقارير الترانسفير</h3>
                     <p>تسجيل عمليات نقل الأصناف واستلام الأصناف المحولة بشكل منظم وواضح.</p>
                  </div>
               </div>
            </section>

            <section className={`${style.supportSection}`} dir='rtl'>
               <h1>يرجى التواصل فورًا في الحالات التالية</h1>
               <div className={`${style.cards}`}>

                  <div className={`${style.card}`}>
                     <div className={`${style.icon}`}><i className="fas fa-user-shield"></i></div>
                     <h3>مشاكل الحساب</h3>
                     <ul>
                        <li>مشكلة في إنشاء حساب جديد</li>
                        <li>مشكلة في تسجيل الدخول</li>
                        <li>مشكلة في تفعيل الحساب</li>
                        <li>عدم وصول كود التفعيل</li>
                     </ul>
                  </div>

                  <div className={`${style.card}`}>
                     <div className={`${style.icon}`}><i className="fas fa-users"></i></div>
                     <h3>مشاكل فريق العمل</h3>
                     <ul>
                        <li>وجود مستخدم ضمن فريق العمل لا ينتمي للفرع</li>
                        <li>تعديل بيانات مستخدم</li>
                     </ul>
                  </div>

                  <div className={`${style.card}`}>
                     <div className={`${style.icon}`}><i className="fas fa-boxes"></i></div>
                     <h3>عمليات المخزن</h3>
                     <ul>
                        <li>مشاكل في الاستهلاك واستلام الطلبيات</li>
                        <li>مشاكل التحويل واستلام الأصناف</li>
                        <li>مشاكل تقارير الجرد</li>
                        <li>مشكلة في استلام الطلبيات</li>
                     </ul>
                  </div>

                  <div className={`${style.card}`}>
                     <div className={`${style.icon}`}><i className="fas fa-chart-line"></i></div>
                     <h3>التقارير والإضافة</h3>
                     <ul>
                        <li>مشاكل التقارير اليومية أو الشهرية</li>
                        <li>إضافة فرع جديد</li>
                        <li>إضافة صنف جديد</li>
                        <li>أي مشكلة أخرى تتطلب تدخل فوري</li>
                     </ul>
                  </div>
               </div>
            </section>

            <section>
               <div className='row m-2'>
                  <h2 className='main-header'>Contact Us</h2>
                  <div className={`${style.formContainer} col-md-8 offset-md-2`}>
                     <form action="" onSubmit={formik.handleSubmit} >
                        {error?<p className="text-danger">{error}</p> :""}
                        <div className="my-2">
                           <label htmlFor="message" className={`${style.mainColor} form-label main-color pb-2`}>Enter Your Message :</label>
                           <textarea 
                              name="message" 
                              id="message" 
                              cols="30" 
                              rows="10"
                              value={formik.values.message}
                              onChange={formik.handleChange} 
                              onBlur={formik.handleBlur}
                              className={`${style.formControl} ${style.textareaFormControl} form-control`}  
                           ></textarea>
                        </div>
                        <div className="my-2">
                           <label htmlFor="phone" className={`${style.mainColor} form-label main-color pb-2`}>Enter Contact Phone : </label>
                           <input type="tel"
                              name="phone" 
                              id="phone" 
                              cols="30" 
                              rows="10"
                              value={formik.values.phone}
                              onChange={formik.handleChange} 
                              onBlur={formik.handleBlur}
                              className={`${style.formControl} form-control`}  
                           />
                           
                        </div>
                        <div className="d-grid gap-2 col-8 mx-auto">
                           {loading ? 
                                 <button className={`${style.btn} btn bg-main  mt-2 text-white `}> <Loading color="white" width={40} height={30} strokeWidth="6"/></button>
                              : 
                                 <button disabled={!(formik.isValid && formik.dirty)} type="submit" className={`${style.btn} btn bg-main  mt-2 rounded-0`}>Send</button>
                           }
                        </div>
                     </form>
                  </div>
               </div>
            </section>
         </div>
      </Fragment>
   )
}
