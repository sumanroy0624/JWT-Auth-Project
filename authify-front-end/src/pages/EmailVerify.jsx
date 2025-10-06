import React, { useContext, useEffect, useState } from "react";
import Menubar from "../components/Menubar";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { isLoggedIn,getUserData,userData,backendURL} = useContext(AppContext);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setloading] = useState(false);
  
  useEffect(() => {
    if (userData.accountVerified || !isLoggedIn ) {
      navigate("/");
    }
  }, [isLoggedIn,userData]);

  // Handle OTP change

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  
  

  const handleSubmit = async() => {
    const code = otp.join("");
    
    if(code.length<6){
      toast.error("Please enter all six digits");
      return;
    }

    setloading(true);
    try{
       
      const response=await axios.post(`${backendURL}/verify-otp`,{otp:code});
      if(response.status==200){
        toast.success("otp verified successfully !");
        getUserData();
        navigate("/");
      }
      

    }catch(error){
       toast.error(error.response.data);
    }finally{
      setloading(false);
    }

  };

  const handleKeyDown = (e, index) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    document.getElementById(`otp-${index-1}`).focus();
  }

 };

const handlePaste = (e) => {
  e.preventDefault();
  const paste = e.clipboardData.getData("text").slice(0, 6).split("");
  const filled = [...paste, ...new Array(6 - paste.length).fill("")];
    setOtp(filled);
    const next = paste.length < 6 ? paste.length : 5;
    document.getElementById(`otp-${next}`).focus();
    
};





  return (
    <div className="min-h-screen bg-gray-100">
      <Menubar />

      {/* Centered Verify Box */}
      <div className="flex justify-center items-center h-[90vh]">
        <div className=" bg-white flex flex-col gap-4 p-8 rounded-2xl shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Your <span className="text-amber-600">Email</span>
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter the 6-digit code we sent to your email
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onKeyDown={(e)=>handleKeyDown(e,i)}
                onChange={(e) => handleChange(e.target.value, i)}
                onPaste={(e)=>handlePaste(e)}
                className="w-12 h-12 border-2 border-gray-300 text-center text-xl font-bold rounded-lg focus:outline-none focus:border-amber-500"
              />
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-amber-600 cursor-pointer text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition duration-200"
          >
            {loading ?"Verifying..." : "Verify"}
          </button>

          {/* Resend Option */}
          <p className="text-sm text-gray-500 mt-4">
            Didn’t receive the code?{" "}
            <a href="#" className="text-amber-500 hover:underline">
              Resend
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
