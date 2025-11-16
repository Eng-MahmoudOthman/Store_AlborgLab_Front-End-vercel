



export function logOut(navigate, user) {
   localStorage.clear() ;
   user.setUser({}) ;
   user.setUsers([]) ;
   user.setRole("") ;
   user.setLoggedUser({}) ; 
   user.setUserToken("") ;
   user.setError(null) ;
   user.setLoading(false) ; 
   user.setTeam([]) ; 
   user.socketDisConnect() ;
   // document.documentElement.style.setProperty("--main-color" , "#0554ff" ) ;
   document.documentElement.style.removeProperty("--main-color");

   navigate("/")
}



