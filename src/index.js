import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import '../node_modules/socket.io/client-dist/socket.io.min.js';
import 'react-loading-skeleton/dist/skeleton.css'
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import UserContextProvider from './Context/UserContext.js';
import BranchContextProvider from './Context/BranchContext.js';
import CompanyContextProvider from './Context/CompanyContext.js';
import OrderContextProvider from './Context/OrderContext.js';
import QuantityContextProvider from './Context/QuantityContext.js';
import ReportContextProvider from './Context/ReportContext.js';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DocumentContextProvider from './Context/DocumentContext.js';


const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
						<QueryClientProvider client={queryClient}>
                        <UserContextProvider>
											<CompanyContextProvider>
												<BranchContextProvider>
													<OrderContextProvider>
														<QuantityContextProvider>
															<ReportContextProvider>
																<DocumentContextProvider>
																	<App />
																</DocumentContextProvider>
															</ReportContextProvider>
														</QuantityContextProvider>
													</OrderContextProvider>
												</BranchContextProvider>
											</CompanyContextProvider>
                        </UserContextProvider>
						</QueryClientProvider>
  // </React.StrictMode>
);






// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

