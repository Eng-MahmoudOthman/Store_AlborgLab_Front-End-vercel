
import axios from "axios";


const API_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/users`;



   const header = {
      token:`${process.env.REACT_APP_BEARER_TOKEN} ${localStorage.getItem("token")}`
   }


   

export const getInfo = async () => {
   const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/report/getInfoLogin`, {headers:header});
   return data.data ;
};
export const getUsers = async () => {
   const { data } = await axios.get(API_URL);

   return data ;
};

export const addUser = async (newUser) => {
   const { data } = await axios.post(API_URL, newUser);
   return data ;
};

export const updateUser = async ({ id, updateUser }) => {
   console.log("Done");
   const { data } = await axios.put(`${API_URL}/${id}`, updateUser,  {headers:header});   
   console.log("user" , data.user);
   return data.user ;
};

export const deleteUser = async (id) => {
   console.log("Done");
   
   const data= await axios.delete(`${API_URL}/${id}`  ,  {headers:header});
   
   console.log("data",data);
   return id ; // بنرجع id للحذف
};
