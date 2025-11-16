import QRCode from 'qrcode'

export default async function generateQRCode(data = ""){
   const qr = await QRCode.toDataURL(JSON.stringify(data), {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 2,
      color: {
         dark:"#a1c", // Should be Color Hex
         light:"#fff"
      }
      });
   console.log(qr);
   return qr
}
