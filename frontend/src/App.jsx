import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Homepage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import ActivityPage from './pages/ActivityPage';
import PerformancePage from './pages/PerformancePage'

import { Toaster } from "react-hot-toast";

const App = () => {

  const { authUser, checkAuth } = useAuthStore();
  const location = useLocation(); 

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });
  
  return (
    <div >

       {/* Conditionally render Navbar based on the current path */}
       {location.pathname !== '/record-activity' && <Navbar />}{/* Don't show Navbar on ActivityPage */}

       {/* console.log("Current Path:", location.pathname); */}

      <Routes>

        {/* if user is not logged in then he should first see login page */}
        <Route path='/' element={authUser ? <Homepage/> : <Navigate to="/login" />}/>

        {/* if user is logged in then he should not see signup page */}
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/" />}/>  

        {/* if user is logged in then he should not see login page */}
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>

        {/* if user is not logged in then he should first see login page */}
        <Route path='/profile' element={authUser ? <ProfilePage/>  : <Navigate to="/login" />}/>


         {/* Record Activity: only visible if logged in */}
         <Route path='/record-activity' element={authUser ? <ActivityPage /> : <Navigate to="/login" />} />

         {/* analytics page/performance page */}
         <Route path='/analytics' element={<PerformancePage />} />

      </Routes>

      <Toaster />

    </div>
  )
}

export default App
