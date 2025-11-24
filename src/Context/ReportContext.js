import { createContext , useContext, useState } from "react";
import { UserContext } from "./UserContext.js";
import axios from "axios";
import notification from "../Utilities/notification.js";




export const ReportContext = createContext();


export default function ReportContextProvider(props){
      const[loading , setLoading] = useState(false)
      const[loginData , setLoginData] = useState({}) ;
      const[adminData , setAdminData] = useState({}) ;
      const [showPopup, setShowPopup] = useState(false);

      const {userToken} = useContext(UserContext) ;
      const header = {
         token:`${process.env.REACT_APP_BEARER_TOKEN} ${userToken || localStorage.getItem("token")}`
      }
   
   
      async function getAllConsumption(status) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/consumption`, {headers: header , responseType: "blob"});
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Consumption List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getCurrentConsumption(status) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/consumption?consumed=false`, {headers: header , responseType: "blob"});
   
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
   
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Consumption List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getAllQuantity(status , category) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/allItemsQuantity?category=${category}`, {headers: header , responseType: "blob"});
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               if(!newTab){
                  notification("error", "المتصفح منع فتح الصفحة. افتح البوب أبس (Popups) من الإعدادات");
                  return;
               }
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Quantity List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getExpiredQuantity(status) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/expiredQuantity`, {headers: header , responseType: "blob"});
   
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
   
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Expired List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getNotExpiredQuantity(status) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/notExpiredQuantity`, {headers: header , responseType: "blob"});
   
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Quantity List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getExpiredQuantityCurrentMonth(status) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/preExpiredQuantity`, {headers: header , responseType: "blob"});
   
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
   
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Quantity List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getOrdersPDF(status) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/getOrders`, {headers: header , responseType: "blob"});
   
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
   
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Order List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getSpecificOrderPDF(status , id) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/${id}`, {headers: header , responseType: "blob"});
   
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
   
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Order Not Exist")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getTransferPDF(status , filter) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/getTransfer?status=${filter}` , {headers: header , responseType: "blob"});
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
   
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Transfer List is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getReceivePDF(status , filter) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/getReceive?status=${filter}` , {headers: header , responseType: "blob"});
            if(status === "download"){
               // إنشاء رابط مؤقت للملف
               fileURL = URL.createObjectURL(response.data);
               // توليد التاريخ الحالي بصيغة YYYY-MM-DD
               const date = new Date().toISOString().split("T")[0];
               const fileName = `consumption-report-${date}.pdf`;
               // إنشاء عنصر تحميل
               const link = document.createElement("a");
               link.href = fileURL;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               notification("success" , `تم تحميل التقرير بنجاح (${fileName})`) ;
            }else if (status === "seen"){
               newTab = window.open();
               fileURL = URL.createObjectURL(response.data);
               newTab.location.href = fileURL;
            }
   
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            console.error("Error loading report:", error);
            notification("error" , "Receive Is Empty")
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getOrderBarcodePDF(orderId) {
         setShowPopup(true);
         setLoading(true);
         let newTab;
         let fileURL;
         try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/barcode/${orderId}` , {headers: header , responseType: "blob"});
            // إنشاء رابط مؤقت للملف
            fileURL = URL.createObjectURL(response.data);
            // توليد التاريخ الحالي بصيغة YYYY-MM-DD
            const date = new Date().toISOString().split("T")[0];
            const fileName = `Barcode-${date}.pdf`;
            // إنشاء عنصر تحميل
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            notification("success" , `تم تحميل الباركود بنجاح (${fileName})`) ;
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
         } catch (error) {
            // console.error("Error loading report:", error);
            console.error("Error loading report:", error.message);
            notification("error" , error.message)
            if (newTab) newTab.close();
         } finally {
            setLoading(false);
         }
      } ;
      async function getInfoLogin() {
         setShowPopup(true);
         setLoading(true);
         try {
            const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/getInfoLogin`, {headers: header});
            if(data.message === "success"){
               setLoginData(data?.data) ;
            }
         } catch (error) {
            console.error("Error loading report:", error);
         } finally {
            setLoading(false);
         }
      } ;
      async function getAdminData(status) {
         setShowPopup(true);
         setLoading(true);
         try {
            const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/getAdminData`, {headers: header});
            if(data.message === "success"){
               setAdminData(data?.data) ;
            }
         } catch (error) {
            console.error("Error loading report:", error);
         } finally {
            setLoading(false);
         }
      } ;

   return (
      <>
         <ReportContext.Provider value={{
               getAllConsumption , 
               getCurrentConsumption ,
               getAllQuantity ,
               getExpiredQuantity ,
               getNotExpiredQuantity ,
               getExpiredQuantityCurrentMonth ,
               getOrdersPDF , 
               getSpecificOrderPDF ,
               getTransferPDF ,
               getReceivePDF ,
               getOrderBarcodePDF ,
               getInfoLogin ,
               getAdminData ,


               loading , 
               setLoading ,

               showPopup, 
               setShowPopup ,

               loginData , 
               setLoginData ,

               adminData , 
               setAdminData ,
            }}>
            {props.children}
         </ReportContext.Provider>
      </>
   )
}