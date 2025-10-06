import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import EmailVerify from './pages/EmailVerify';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/email-verify' element={<EmailVerify/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>
          <Route path='*' element={<ErrorPage/>}/>
          
      </Routes>
    </div>
  )
}

export default App