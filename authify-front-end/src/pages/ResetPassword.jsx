import React, { useContext, useEffect } from "react";
import Menubar from "../components/Menubar";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const [sendOtp, setsendOtp] = useState(false);
  const [loading, setloading] = useState(false);
  const [otp, setotp] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [email, setemail] = useState("");
  const navigate=useNavigate();
  const {backendURL,isLoggedIn,setIsLoggedIn}=useContext(AppContext);

  useEffect(()=>{
     if(isLoggedIn){
      toast.error("you are already logged in !!");
      navigate('/');
     }
  },[isLoggedIn,setIsLoggedIn])

  const isEmail=(value)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  const sendOtpHander = async() => {
     if(!isEmail(email)){
      toast.error("Enter a valid email..")
      return;
     }

     setloading(true);
     try{
       const response=await axios.post(`${backendURL}/send-reset-otp?email=${email}`);
       if(response.status==200){
         toast.success("Otp send successfully..")
         setsendOtp(true);
       }
     }catch(error){
       console.log(error)
       toast.error(error.response.data);
     }finally{
       
       setloading(false);
     }
  };

  const resetPasswordHander = async() => {
     if(otp.length<6){
      toast.error("Enter valid otp");
      return;
     }

     if(newPassword.length<6){
      toast.error("Passoword must be at least of lenght 6")
      return;
     }

     setloading(true);

     try{
       const response=await axios.post(`${backendURL}/reset-password`,{newPassword,otp,email});
       if(response.status==200){
         toast.success("password change successfully..")
         navigate('/login');
       }
     }catch(error){

       toast.error(error.message);
     }finally{
       setloading(false);
       setnewPassword("");
       setsendOtp(false);
     }

  };

  

  return (
    <>
      <div className="bg-gradient-to-b  from-pink-200 via-emerald-300 to-purple-400">
        <Menubar />
        <div className=" mt-1 h-[100vh]  flex items-center justify-center">
          <div className="w-92 shadow-lg absolute top-50 bg-white px-8 py-5 rounded-2xl flex flex-col gap-3">
            <div className="text-center text-2xl font-bold">
              Reset <span className="text-amber-500">Password</span>
            </div>

            <div
              className={
                sendOtp
                  ? "flex bg-gray-200 items-center gap-2 border rounded-lg px-3 py-2 mb-4"
                  : "flex items-center gap-2 border rounded-lg px-3 py-2 mb-4"
              }
            >
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Email"
                disabled={sendOtp}
                className="w-full outline-none font-medium text-gray-700"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            {sendOtp && (
              <>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full outline-none font-medium text-gray-700"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setnewPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    type="number"
                    placeholder="Enter otp"
                    className="w-full outline-none font-medium text-gray-700"
                    required
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 6) {
                        setotp(value);
                      }
                    }}
                  />
                </div>
              </>
            )}

            {!sendOtp ? (
              <>
                <button onClick={()=>{
                  sendOtpHander();
                }} className="w-full cursor-pointer bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition duration-200">
                  {loading ? "Sending otp..":"Send Otp"}
                </button>
              </>
            ) : (
              <>
                <button 
                onClick={()=>resetPasswordHander()}
                className="w-full cursor-pointer bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition duration-200">
                  {loading?"Resetting password...":"Reset Password"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
