import React, { useContext, useEffect, useRef, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Menubar = () => {
  const navigate=useNavigate();
  const {userData,backendURL,setUserData,setIsLoggedIn}=useContext(AppContext);
  const [dropdownOpen,setDropdownOpen]=useState(false);
  const dropdownRef=useRef(null);

  useEffect(()=>{
    const handleClickOutside=(e)=>{
       if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
         setDropdownOpen(false);
       }
    };

    document.addEventListener("mousedown",handleClickOutside);
    return ()=> document.removeEventListener("mousedown",handleClickOutside);
  },[]);


  const sendVerificationOtp=async()=>{
    
    try{
       axios.defaults.withCredentials=true;
       const resp=await axios.post(`${backendURL}/send-otp`);
       if(resp.status==200){
         navigate('/email-verify')
         toast.success("otp has been sent successfully");
       }else{
         toast.error("unable to sent otp");

       }
    }catch(error){
        toast.error(error.response.data.message);
    }
  }
  
  

  const logoutHandler=async()=>{
    try{
       axios.defaults.withCredentials=true; 
       const response=await axios.post(`${backendURL}/logout`)

       if(response.status==200){
          setIsLoggedIn(false);
          setUserData(false);
          navigate('/');
          toast.success("logout successsful");
       }
    }catch(error){
       toast.error(error.response.data.message);
    }
  }

  

  return (
    <nav className="flex items-center justify-between px-10 py-3 my-3 shadow-md">
      {/* Logo Section */}
      <Link to="/">
      <div className="flex items-center gap-2">
        
        <img
          src="/src/assets/home.png"
          alt="logo"
          width={36}
          height={36}
          className="rounded-md"
        />
        <span className="font-extrabold text-2xl tracking-wide text-gray-900">
          Authify
        </span>
        
      </div>
      </Link>


       {/* Login Button */}

      {userData ? (
        <div className='relative' ref={dropdownRef}>
            <div className="bg-gray-800 cursor-pointer text-2xl select-none w-12 h-12 text-gray-200 rounded-full flex justify-center items-center"
            onClick={()=>setDropdownOpen((prev)=>!prev)}
            >
             {userData.name[0].toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className='absolute shadow-md text-start bg-gray-200 font-medium rounded-sm
               w-fit p-1 top-[50px] right-0 z-10'>
                {!userData.accountVerified && 
                (
                  <div onClick={sendVerificationOtp} className="py-1 px-2 cursor-pointer">
                    Verify email
                  </div>
                )
                }
                <div className="py-1 px-2 cursor-pointer gray-red-900">{userData.name}</div>
                <div className="py-1 px-2 cursor-pointer gray-red-900">{userData.email}</div>
                <div onClick={logoutHandler} className="py-1 px-2 cursor-pointer text-red-500">Log out</div>


              </div>
            )}

        </div>
      ):(
        <button className="flex items-center gap-2 px-5 py-2 borde text-neutral-800 border font-medium rounded-full transition duration-200 hover:bg-gray-800 hover:text-gray-300" 
      onClick={()=>navigate('/login')}>
        <span>Login</span>
        <BsArrowRight className="text-lg" />
      </button>
     )}
      

      
    </nav>
  );
};

export default Menubar;
