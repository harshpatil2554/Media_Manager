"use client"


import { onAuthStateChange } from '@/lib/helpers/auth/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { loadUserData } from '@/lib/helpers/user/data';
import { useRouter } from 'next/navigation';

//  name , email , id  , avatar , lastSeen , 


const AppContext = createContext();

export const useAppContext=()=>{
    return useContext(AppContext);
}

export function AppContextProvider({children}) {
  const router=useRouter()
    const [authUser,setAuthUser]=useState(null)

    const [isLoading,setIsLoading]=useState(true)
    const [data,setData]=useState(null)


    const handleAuthStateChange=async (u)=>{

      
      
      
      if(data!=null && u==null){ // means user logged out
        console.log('user is logging out ...');
        setData(
          {isLoggedIn:false}
        )
        
      }
      
      
      
      setAuthUser(u);
     
    }




    const loadData=async ()=>{
      try {
          const d=await loadUserData(authUser.uid)
          
          if(d!=null){
             setData(
              {
                ...d,isLoggedIn:true
              }
             );
            }else{
              setData({
                isLoggedIn:false
              })
            }
            

          
      } catch (error) {
        console.log('error in loading data',error);
        setData({
          isLoggedIn:false
        })
      }
      
     }




    
     

useEffect(()=>{
  if(authUser!=null) {
    loadData();
}

    setData({isLoggedIn:false})

setIsLoading(false)

},[authUser])



    useEffect(()=>{
   const listener=   onAuthStateChange(handleAuthStateChange) 

    return  ()=> listener()
    },[])









  return (
    <AppContext.Provider value={{ authUser,setAuthUser  , isLoading , data,setData}}>
      {children}
    </AppContext.Provider>
  );
}