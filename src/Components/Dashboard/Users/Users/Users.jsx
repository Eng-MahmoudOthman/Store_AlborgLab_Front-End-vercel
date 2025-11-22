import { Fragment, useContext, useEffect } from 'react' ;
import { UserContext } from '../../../../Context/UserContext.js';
import Loading from '../../../Loading/Loading.jsx';
import TimeAgo from '../../../TimeAgo/TimeAgo.jsx';
import Swal from 'sweetalert2';
import { BranchContext } from '../../../../Context/BranchContext.js';
import { CompanyContext } from '../../../../Context/CompanyContext.js';
import CustomTitle from '../../../CustomTitle/CustomTitle.jsx';
import { Link } from 'react-router-dom';
import SendMessageUsers from '../SendMessageUsers/SendMessageUsers.jsx';
import style from "./users.module.css" ;






export default function Users() {

   const {getAllUsers , confirmedUser , updateBranchUser ,  blockedUser,  deleteUser , users , loading , confirmedLoading , blockedLoading , deleteLoading} = useContext(UserContext)
   const{getAllBranches } = useContext(BranchContext);
   const{getCompanies , companies} = useContext(CompanyContext);



   function handleSearch(search){
      if(search.length >= 3){
         getAllUsers(search.toLowerCase()) ;
      }else if(search.length === 0){
         getAllUsers("") ;
      }
   } ;

   function handleConfirmedUser(id , confirmed , role){
      if(role === "admin") return ;
      confirmedUser(id , confirmed )
   } ;


   function handleBlockedUser(id , blocked , role){
      if(role === "admin") return ;
      blockedUser(id , blocked )
   } ;

   function handleDeletedUser(id  , role){
      if(role === "admin") return ;

      Swal.fire({
         title:"Delete this user? Are you sure?" ,
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
      }).then((result) => {
         if (result.isConfirmed) {
            deleteUser(id) ;
            Swal.fire({
               title: "Deleted!",
               text: "Your file has been deleted.",
               icon: "success"
            });
         }
      });
   } ;




   async function handleBranchUser(id , role) {
      if (role === "admin") return;

      const companyOptions = {};
      companies.forEach((company) => {
         companyOptions[company._id] = company.name;
      });

      // 2️⃣ اختر الشركة
      const { value: companyId } = await Swal.fire({
         title: "اختر الشركة",
         input: "select",
         inputOptions: companyOptions,
         inputPlaceholder: "اختر شركة",
         showCancelButton: true,
         confirmButtonText: "التالي",
         cancelButtonText: "إلغاء",
      });

      if (!companyId) return;

      
      // 3️⃣ لما المستخدم يختار الشركة، نجيب فروعها
      const branches = await getAllBranches(companyId , "true"); // الدالة دى بترجع فروع الشركة المختارة

      if (!branches || branches.length === 0) {
         return Swal.fire("مافيش فروع تابعة للشركة دى!");
      }

      const branchOptions = {};
      branches.forEach((branch) => {
         branchOptions[branch._id] = `${branch.name} `;
      });

      // 4️⃣ نفتح SweetAlert جديد لاختيار الفرع
      const { value: branchId } = await Swal.fire({
         title: "اختر الفرع",
         input: "select",
         inputOptions: branchOptions,
         inputPlaceholder: "اختر فرع",
         showCancelButton: true,
         confirmButtonText: "تأكيد",
         cancelButtonText: "إلغاء",
      });

      if (!branchId) return;

      // 5️⃣ لو اختار فرع، نفذ المطلوب
      const selectedBranch = branches.find((b) => b._id === branchId);
      await updateBranchUser(id , branchId)
      Swal.fire(`تم اختيار الفرع: ${selectedBranch.name}`);
   }



   useEffect(() => {
      getAllUsers("") ;
      getCompanies() 
   }, [])


   return (
      <Fragment>
         <CustomTitle title="Users Dashboard" />

         <nav aria-label="breadcrumb" className='container bg-body-secondary'>
            <ol className="breadcrumb ">
               <li className="breadcrumb-item"><Link className="text-primary" to="/">Home</Link></li>
               <li className="breadcrumb-item"><Link className="text-primary" to="/Dashboard">Dashboard</Link></li>
               <li className="breadcrumb-item active" aria-current="page">Users Dashboard</li>
            </ol>
         </nav>

         <div className='container'>
            <h1 className='main-header my-4'>Users</h1>

            <div className="mb-1">
               <form >
                  <div className='position-relative'>
                     <input  type="search" onChange={(e) => handleSearch(e.target.value)}  className='form-control' id='search' placeholder='Search Users more than 3 char'  name="search" />
                  </div>
               </form>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
               <p><i className="fa-solid fa-mug-saucer mx-2"></i> Users Count  : {users.length || 0}</p>
               <p data-bs-toggle="modal" data-bs-target="#sendMessageUsers" className=' mx-3 btn btn-outline-success'>Send Message</p>
            </div>
            <SendMessageUsers/>

            {loading? 
                  <Loading type="large" color="gray"/> 
               : 
               <>
                  {users.length? 
                     users.map((ele)=>
                        <div key={ele._id} className={`${style.card} border border-2 rounded-2 m-3 p-2  position-relative overflow-hidden `}>
                           <div className={``}>
                              <p className='m-0 p-0 d-flex justify-content-between'><span className='fw-bold'>Num: {ele.itemNumber || 1000}</span> <TimeAgo  showTimeOnly={true} createdAt={ele.createdAt} /></p>
                              <p className='m-0 p-0'><span className='fw-bold'>Name: </span>{ele.name}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>ID: </span>{ele.employeeCode}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>Phone: </span>{ele.phone}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>Email: </span>{ele.email}</p>
                              <p className='m-0 p-0'><span className='fw-bold'>Branch: </span>{ele.branch?.name}</p>
                              <p className='m-0 p-0 '>Created At : {new Date(ele.createdAt).toISOString().slice(0, 10)}</p>
                           </div>

                           <div className={`${style.sidIcon} text-center rounded-2 position-absolute text-danger bg-danger-subtle`}>
                              <p onClick={()=>{handleConfirmedUser(ele._id , !ele.confirmed , ele.role)}}  className='m-0 p-0 my-3'>
                                 {
                                    confirmedLoading?
                                    <Loading type="icon" color="gray"/> 
                                    :
                                    <i className={`fa-solid fa-circle-user ${ele.confirmed? "text-success" : "text-danger"}`} ></i>
                                 }
                              </p>


                              {
                                 blockedLoading?
                                    <p className='m-0 p-0 my-3'> <Loading type="icon" color="gray" /> </p> 
                                 :
                                    <p onClick={()=>{handleBranchUser(ele._id)}} className='m-0 p-0 my-3'><i className="fa-solid fa-code-branch text-success"></i></p>
                              }


                              {
                                 blockedLoading?
                                    <p className='m-0 p-0 my-3'> <Loading type="icon" color="gray" /> </p> 
                                 :
                                 <>
                                    {ele.blocked? 
                                          <p onClick={()=>{handleBlockedUser(ele._id , !ele.blocked , ele.role)}} className='m-0 p-0 my-3'><i className="fa-solid fa-user-xmark"></i></p> 
                                       : 
                                          <p onClick={()=>{handleBlockedUser(ele._id , !ele.blocked , ele.role)}} className='m-0 p-0 my-3'><i className="fa-solid fa-user-check text-success"></i></p>
                                    }
                                 </>
                              }

                              
                              {
                                 deleteLoading?
                                    <p className='m-0 p-0 my-3'> <Loading type="icon" color="gray" /> </p>
                                 :
                                    <p onClick={()=>{handleDeletedUser(ele._id , ele.role)}}><i className="fa-solid fa-trash"></i></p>
                              }
                           </div>
                        </div>
                     )
                     : ""
                  }
               </>

            
            }


         </div>
      </Fragment>
   )
} ;
