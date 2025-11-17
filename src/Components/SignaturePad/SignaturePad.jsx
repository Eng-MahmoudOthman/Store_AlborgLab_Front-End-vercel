
import React, { Fragment, useContext, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { UserContext } from "../../Context/UserContext.js";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading.jsx";


function resizeBase64Image(base64Str, maxWidth = 150, maxHeight = 75) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);

      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // ↓ هنا بنعملها WebP عشان أصغر حجم
      resolve(canvas.toDataURL("image/webp", 0.7));
    };
  });
}


export default function SignaturePad({ userId }) {
   const sigRef = useRef(null);
   const [signature, setSignature] = useState(null);

   const {AddSignature , mainColor ,  loading} = useContext(UserContext) ;

   const handleSave = async () => {
      if(sigRef.current === null) return
      const base64 = sigRef.current.getCanvas().toDataURL("image/webp", 0.5);
      const signatureBase64 = await resizeBase64Image(base64, 150, 75);

      AddSignature(signatureBase64);
      setSignature(signatureBase64);
   };

   const handleClear = () => {
      setSignature(null);
   };

   return (
      <Fragment>
         <div className="container mt-4">
            <nav aria-label="breadcrumb" className='container bg-body-secondary'>
               <ol className="breadcrumb ">
                  <li className="breadcrumb-item p-0"><Link className="text-primary" to="/">Home</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Add Signature</li>
               </ol>
            </nav>
               <h1 className="main-header my-4">User Signature</h1>

            <div className="text-center my-5">

               {!signature && (
                  <SignatureCanvas
                     ref={sigRef}
                     penColor="black"
                     // penColor={mainColor || "black"}
                     canvasProps={{
                        width: 350,
                        height: 150,
                        className: "border border-dark rounded shadow"
                     }}
                  />
               )}

               {signature && (
                  <div>
                     <img
                        src={signature}
                        alt="signature"
                        style={{ width: 280, height: 120, border: "1px solid #444" }}
                     />
                  </div>
               )}

               <div style={{ marginTop: 10 }}>
                  { loading ?
                        <button onClick={handleSave} className="btn bg-main m-1 w-25">
                           <Loading color="white"  width={20} height={20} strokeWidth="6"/>
                        </button>
                     :
                     <>
                        <button onClick={handleSave} className="btn bg-main m-1">
                           Save Signature
                        </button>
                        <button onClick={handleClear} className="btn btn-danger m-1">
                           Delete
                        </button>
                     </>
                  }
               </div>
            </div>

         </div>
      </Fragment>

   );
}
