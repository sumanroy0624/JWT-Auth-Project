import React, { useContext } from 'react'
import { AppConstants } from '../utils/Constants';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const {userData}=useContext(AppContext);
  return (
    <>
      <div className='flex flex-col gap-4 min-h-[100vh] items-center'>
        <img src="src/assets/app-development.png" alt="logo" height={120} width={120} />
        <div className='font-bold text-xl'>
          Hey {userData ? userData.name:"Developer"} <span>👋</span>
        </div>
        <h1 className='text-4xl font-bold text-center'>Welcome to our product</h1>
        <div className='max-w-[550px]'>
          <p className='text-md text-center'>Let's start with a quick product tour and  you can setup the authentication in no time!</p>
        </div>
        <button className='border transition duration-200 py-2 px-4 rounded-full text-gray-900 font-medium hover:bg-gray-800 hover:text-gray-300 '>
          Get Started
        </button>
      </div>

    </>
  )
}

export default Header;