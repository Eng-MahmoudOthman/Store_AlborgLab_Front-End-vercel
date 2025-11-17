import { RouterProvider , createHashRouter } from 'react-router-dom';
import './App.css';
import { useContext, useEffect } from 'react';
import { UserContext } from './Context/UserContext.js';
import { jwtDecode } from 'jwt-decode';


import Layout from './Components/Layout/Layout.jsx';
import Login from './Components/Login/Login.jsx';
import NotFound from './Components/NotFound/NotFound.jsx';
import ProtectedRoute from './MiddleWare/ProtectedRoute/ProtectedRoute.jsx';

import ForgetPassword from './Components/ForgetPassword/ForgetPassword.jsx';
import isTokenValid from './Utilities/checkToken.js';
import GuestRoute from './MiddleWare/GuestRoute/GuestRoute.jsx';
import ConfirmedAccount from './Components/ConfirmedAccount/ConfirmedAccount.jsx';
import Home from './Components/Home/Home.jsx';
import Register from './Components/Register/Register.jsx';
import YourTeam from './Components/YourTeam/YourTeam.jsx';
import Setting from './Components/Setting/Setting.jsx';
import DevelopedInformation from './Components/DevelopedInformation/DevelopedInformation.jsx';
import ChangeColor from './Components/ChangeColor/ChangeColor.jsx';
import UserProfile from './Components/UserProfile/UserProfile.jsx';
import UpdateUserProfile from './Components/UpdateUserProfile/UpdateUserProfile.jsx';
import ChangeUserImage from './Components/ChangeUserImage/ChangeUserImage.jsx';
import ChangePassword from './Components/ChangePassword/ChangePassword.jsx';
import Orders from './Components/Orders/Orders.jsx';
import SpecificUser from './Components/SpecificUser/SpecificUser.jsx';
import ExpireDate from './Components/ExpireDate/ExpireDate.jsx';
import Consumption from './Components/Consumption/Consumption.jsx';
import Inventory from './Components/Inventory/Inventory.jsx';
import ListUserChat from './Components/ListUserChat/ListUserChat.jsx';
import ClientChatting from './Components/ClientChatting/ClientChatting.jsx';
import Report from './Components/Report/Report.jsx';
import Transfer from './Components/TransferPages/Transfer/Transfer.jsx';
import UsersList from './Components/UsersList/UsersList.jsx';
import UsersSummary from './Components/UsersSummary/UsersSummary.jsx';
import Receive from './Components/ReceivePages/Receive/Receive.jsx';
import Dashboard from './Components/Dashboard/Dashboard/Dashboard.jsx';
import Users from './Components/Dashboard/Users/Users.jsx';
import Branches from './Components/Dashboard/Branches/Branches/Branches.jsx';
import Items from './Components/Dashboard/Items/Items/Items.jsx';
import Documents from './Components/Dashboard/Documents/Documents/Documents.jsx';
import ShowDocuments from './Components/ShowDocuments/ShowDocuments.jsx';
import SignaturePad from './Components/SignaturePad/SignaturePad.jsx';
import ContactUs from './Components/ContactUs/ContactUs.jsx';


// const socket = io(process.env.REACT_APP_BASE_URL) ;



let routers = createHashRouter([
// let routers = createBrowserRouter([
	{path:"/" , element:<Layout /> , children:[
		{index:true , element:<GuestRoute><Login/></GuestRoute>} , 
		{path:"register" , element:<GuestRoute><Register/></GuestRoute>} , 
		{path:"ContactUs" , element:<ContactUs/>} , 

		{path:"ConfirmedAccount/:id" , element:<ConfirmedAccount/>} , 
		{path:"ForgetPassword" , element:<ForgetPassword/>} , 
		{path:"DevelopedInformation" , element:<DevelopedInformation/>} , 

		{path:"home" , element:<ProtectedRoute><Home/></ProtectedRoute>} , 
		{path:"ChangeColor" , element:<ProtectedRoute><ChangeColor/></ProtectedRoute>} , 
		{path:"YourTeam" , element:<ProtectedRoute><YourTeam/></ProtectedRoute>} , 
		{path:"Setting" , element:<ProtectedRoute><Setting/></ProtectedRoute>} , 
		{path:"UserProfile" , element:<ProtectedRoute><UserProfile/></ProtectedRoute>} , 
		{path:"UpdateUserProfile" , element:<ProtectedRoute><UpdateUserProfile/></ProtectedRoute>} , 
		{path:"ChangeUserImage" , element:<ProtectedRoute><ChangeUserImage/></ProtectedRoute>} , 
		{path:"ChangePassword" , element:<ProtectedRoute><ChangePassword/></ProtectedRoute>} ,  
		{path:"Orders" , element:<ProtectedRoute><Orders/></ProtectedRoute>} , 
		{path:"SpecificUser/:id" , element:<ProtectedRoute><SpecificUser/></ProtectedRoute>} , 
		{path:"Consumption" , element:<ProtectedRoute><Consumption/></ProtectedRoute>} , 
		{path:"Inventory" , element:<ProtectedRoute><Inventory/></ProtectedRoute>} , 
		{path:"ExpireDate" , element:<ProtectedRoute><ExpireDate/></ProtectedRoute>} , 
		{path:"ListUserChat" , element:<ProtectedRoute><ListUserChat/></ProtectedRoute>} , 
		{path:"Report" , element:<ProtectedRoute><Report/></ProtectedRoute>} , 
		{path:"Transfer" , element:<ProtectedRoute><Transfer/></ProtectedRoute>} , 
		{path:"UsersList" , element:<ProtectedRoute><UsersList/></ProtectedRoute>} , 
		{path:"UsersSummary" , element:<ProtectedRoute><UsersSummary/></ProtectedRoute>} , 
		{path:"Receive" , element:<ProtectedRoute><Receive/></ProtectedRoute>} , 
		{path:"showDocuments" , element:<ProtectedRoute><ShowDocuments/></ProtectedRoute>} , 
		{path:"SignaturePad" , element:<ProtectedRoute><SignaturePad/></ProtectedRoute>} , 
		{path:"ClientChat/:receiver" , element:<ProtectedRoute><ClientChatting/></ProtectedRoute>} , 
		{path:"*" , element:<NotFound />} , 
	]} ,

	{path:"Dashboard/" ,element:<Layout /> , children:[
		{index:true , element:<ProtectedRoute><Dashboard/></ProtectedRoute>} , 
		{path:"Users" , element:<ProtectedRoute><Users/></ProtectedRoute>} , 
		{path:"Branches" , element:<ProtectedRoute><Branches/></ProtectedRoute>} , 
		{path:"Items" , element:<ProtectedRoute><Items/></ProtectedRoute>} , 
		{path:"Documents" , element:<ProtectedRoute><Documents/></ProtectedRoute>} , 
		{path:"*" , element:<NotFound />} ,
	]} , 
])










function App() {
	const {
		setRole , 
		setUserToken , 
		setLoggedUser , 
		getUserTeam , 
		socketConnect ,
		loggedUser
	} = useContext(UserContext) ;



	useEffect(() => {
		const token = localStorage.getItem("token") ;
		if(token){
			if(!loggedUser){
				//& Get Token in Local Storage And Save in Use State :
				// const token = localStorage.getItem("token") ;
				if(token && isTokenValid(token)){
					setUserToken(token) ;
					try {
							const decoded = jwtDecode(token) ;

							//& Get User Team When Refresh :
							getUserTeam(decoded.branchId) ;

							//& Set Main Color From Database :
							document.documentElement.style.setProperty("--main-color" , decoded.color ) ;

							//& Set User Role :
							setLoggedUser(decoded);
							
							setRole(decoded.role);
						} 
					catch (err) {
						console.error("Error decoding token", err);
						localStorage.removeItem("token");
						setUserToken(null);
					}
				} else{
					localStorage.removeItem("token") ;
				} ;
			}
		}
	}, [setRole , setUserToken , setLoggedUser])

	return (
		<>
			<RouterProvider router={routers} ></RouterProvider>
		</>
	);
}

export default App;
