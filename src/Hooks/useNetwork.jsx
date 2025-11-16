import React, { useEffect, useState } from 'react'

export default function useNetwork() {

   const [network , setNetwork] = useState(false) ;

   useEffect(() => {
      detectOnline()
   }, [])



   function detectOnline (){
      window.addEventListener("online" , function (){
         setNetwork(true)
      })
      window.addEventListener("offline" , function (){
         setNetwork(false)
      })
   }

   
   return (
      <>
         {/* {network? "" : <><div className="network fixed-bottom text-danger"><i className="fa-solid fa-wifi p-1 "></i> Network Offline</div></>} */}
      </>
   )
}
