import React, { useContext } from "react";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const {backendURL,isLoggedIn,setIsLoggedIn,getUserData,userData}=useContext(AppContext);
  const [isCreateAccount, setIsCreateAccount] = useState(false);

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState("");
  const navigate=useNavigate();

  const onSubmitHandler=async(e)=>{
     e.preventDefault();
     axios.defaults.withCredentials=true;
     setLoading(true);

     try{
       if(isCreateAccount){
         //register API
        
         const response= await axios.post(`${backendURL}/register`,{name,email,password});
         
         if(response.status==201){
           navigate("/");
           toast.success("Account Crated Successfully");
         }

       }else{
          //login API Call

          const response=await axios.post(`${backendURL}/login`,{email,password});
          if(response.status==200){
            setIsLoggedIn(true);
            getUserData();
            navigate("/");
            toast.success("Logged in successfully !");
          }
       }
     }catch(error){
        console.log(error)
        toast.error(error.message)
     }finally{
       setLoading(false);
       setName('');
       setEmail('');
       setPassword('');
     }

  }

  
  return (
    <div className="flex justify-center items-center flex-col h-screen bg-gray-100 bg-gradient-to-b  from-pink-200 via-emerald-300 to-purple-400">
       
      <div className="w-full fixed top-0 shadow-md p-4">
        <Link to={'/'}>
        <div className=" flex items-center gap-2 pl-5">
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
      </div>
      
      
      {/* Card */}
      <div className="bg-white p-8 rounded-2xl flex flex-col gap-3 shadow-lg w-96">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isCreateAccount ? "Create account":"Login"} to <span className="text-amber-500">Authify</span>
        </h2>

        {isCreateAccount && (
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4">
          <FaUser className="text-gray-400 mr-2" />

          <input
            type="text"
            placeholder="Name"
            className="w-full outline-none font-medium text-gray-700"
            required
            onChange={(e)=>setName(e.target.value)}
            value={name}
          />
        </div>)}

        {/* Email */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4">
      
          <FaEnvelope className="text-gray-400 mr-2" />
          <input
            type="email"
            placeholder="Email"
            className="w-full outline-none font-medium text-gray-700"
            required
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-2">
          <FaLock className="text-gray-400 mr-2" />
          <input
            type="password"
            placeholder="Password"
            className="w-full outline-none font-medium text-gray-700"
            required
            onChange={(e)=>setPassword(e.target.value)} 
            value={password}
          />
        </div>

        {/* Forgot password */}
        {!isCreateAccount && (
          <div className="flex justify-end mb-6">
          <Link to="/reset-password" className="text-sm text-blue-700 font-semibold hover:underline">
            Forgot Password?
          </Link>
        </div>
       )}

        {/* Button */}
        <button onClick={onSubmitHandler} disabled={loading}  className="w-full cursor-pointer bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition duration-200">
            {loading?"Loading...":isCreateAccount ? "Sign Up":"Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">

          {isCreateAccount ?
          (
            <>
            Already have account ?{" "} 
            <Link to="#" onClick={()=>setIsCreateAccount(false)} className="text-blue-600 font-medium hover:underline">
            Log in
          </Link>
            </>
          ):(
            <>
            Don’t have an account ? {" "}
           <Link to="#" onClick={()=>setIsCreateAccount(true)} className="text-blue-500 font-medium hover:underline">
            Sign Up
           </Link>
            </>
          )  
        }

          

        </p>
      </div>
      
    </div>
  );
};

export default Login;
