import { createContext, useState } from "react";
import { AppConstants } from "../utils/Constants";
import axios from "axios";
import { toast } from "react-toastify";

import { useEffect } from "react";
export const AppContext=createContext();

export const AppContextProvider=(props)=>{
  const backendURL=AppConstants.BACKEND_URL;
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [userData,setUserData]=useState(false);

const getUserData=async()=>{
  try{
    const response=await axios.get(backendURL+"/profile");
    if(response.status==200){
      setUserData(response.data);
    }else{
      toast.error("unable to retrieve the profile");
    }
  }catch(error){
    toast.error(error.message);
  }
}

  const contextValue={
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  }

  const getAuthState=async()=>{
    
    if(!isLoggedIn) return;
    
    axios.defaults.withCredentials=true
    try{
       const resp= await axios.get(`${backendURL}/is-authenticated`);
       if(resp.status==200 && resp.data==true){
        setIsLoggedIn(true);
        await getUserData();
       }else{
        setIsLoggedIn(false);
       }

    }catch(error){
        if(error.response){
          const msg=error.response.data ?.message || "Authenticatio check failed";
          toast.error(msg);
        }else{
          toast.error(error.message);
        }
        setIsLoggedIn(false);
    }
  }

  useEffect(()=>{
     getAuthState();
  },[])
  
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}
