import { Fragment, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTitle from '../CustomTitle/CustomTitle.jsx';
import { UserContext } from '../../Context/UserContext.js';
import isTokenValid from '../../Utilities/checkToken.js';


export default function DevelopedInformation() {
      const {loggedUser ,  userToken} = useContext(UserContext) ;

      const [copied, setCopied] = useState(false);
      const textToCopy = process.env.REACT_APP_FRONT_URL;
   
      const handleCopy = async () => {
         try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000); // يرجع الزر تاني بعد ٢ ثانية
         } catch (err) {
            console.error("Failed to copy: ", err);
         }
      };




      const developedTeam = [
         { name: "Eman Magdy Sayed", phone: "01141636114"  , title:"Flutter Developer" }, 
         { name: "Zahraa Zein Haussen", phone: "01097673566"  , title:"UI-UX Design" }, 
         { name: "Mahmoud Othman Abo Baker", phone: "01126999142"  , title:"Full Stack Developer" }, 
         
      ];
      return (
         <Fragment>
            <CustomTitle title="Developers " />
            <nav aria-label="breadcrumb" className='container bg-body-secondary'>
               <ol className="breadcrumb ">
                  <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link className="text-primary" to="/Setting">Setting</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Developed Information</li>
               </ol>
            </nav>


            <div className="container ">
               <h1 className='main-header'>Developed Team</h1>
               <div className='under-header'></div>
               
               <div className="container my-4">
                  <section dir='rtl' style={{backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: 800, margin: 'auto', fontFamily: '"Segoe UI", sans-serif', color: '#333'}}>
                     <h2 style={{textAlign: 'center', color: '#2c3e50', marginBottom: '1rem'}}>كلمة شكر وتقدير</h2>
                     <p style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
                        يتقدم فريق العمل المكون من كيميائيين برج العياط وهم :
                     </p>
                     <ul style={{listStyle: 'none', padding: 0, fontSize: '1.0rem'}}>
                        <li>🔹 <strong>إيمان مجدي سيد</strong></li>
                        <li>🔹 <strong>زهراء زينهم حسين</strong></li>
                        <li>🔹 <strong> <a href="https://portfoliomahmoud-othman.vercel.app/">محمود عثمان أبو بكر</a></strong> <span style={{color: '#888'}}>(مصمم الموقع)</span></li>
                     </ul>
                  </section>

                  {developedTeam.map((ele)=>
                     <div key={ele.name} className="card shadow-sm border-0 m-2">
                        <div className="card-body">
                           <h5 className="card-title fw-bold">{ele.name}</h5>
                           <p className="card-text ms-3 mb-1" >
                              <i className="fa-solid fa-phone me-2"></i>  Phone : {ele.phone}   
                           </p>
                           <p className="card-text ms-3 mb-1">
                              <i className="fa-solid fa-user me-2"></i> Role : {ele.title}
                           </p>
                           <p className="card-text ms-3 mb-1  my-1" >
                              <Link className="text-white btn btn-success w-50" to={`https://wa.me/2${ele.phone}`} target="_blank" rel="noopener noreferrer">
                                 <i className="fa-brands fa-whatsapp fs-5 fw-bold"></i>
                              </Link>
                           </p>
                        </div>
                     </div>
                  )}
               </div>



               <div className="row align-item-center">
                  <div className="col-md-10 text-center mt-4 offset-md-1 ">
                     <div className='w-100 text-center mb-4'>
                        <img src="/qrcode.png" className='w-50 barcode-box rounded-2 p-4' alt="qrCode" />
                     </div>
                     <Link to={process.env.REACT_APP_FRONT_URL} target='_blank' className='text-primary'>Website Link Click Here !</Link>
                  </div>

                  <div className="text-center">
                     <p>{textToCopy}</p>
                     <button onClick={handleCopy} className="btn btn-success">
                        {copied ? "✔️ تم النسخ" : "📋 نسخ الرابط "}
                     </button>
                  </div>

                  {loggedUser && userToken && isTokenValid(userToken) ? 
                        "" 
                     :
                        <div className='text-center'>
                           <Link to="/" className='btn bg-main my-4 '><i className="fa-regular fa-circle-left"></i> الرجوع لصفحة تسجيل الدخول</Link>
                        </div>
                  }
               </div>

               <div className='text-center my-4'>
                  <Link to="/QrCode.pdf" download  className="btn bg-main w-50">
                     Download Qr Code 
                  </Link>
               </div>
            </div>


         </Fragment>
      )
   }
   