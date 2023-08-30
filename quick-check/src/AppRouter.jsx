import { BrowserRouter as Router,Route,Routes, Navigate, Outlet, useLocation, useNavigate} from 'react-router-dom';
import React, { Component, useEffect } from 'react';
import Computers from './Pages/computers';
import Reports from './Pages/reports';
import DailyCheck from './Pages/dailyCheck';
import Temp from './Pages/temp';
import Login from './Pages/login';
import { useState } from 'react';
import Cookies from 'universal-cookie'
import $ from 'jquery'
import Citrix from './Pages/citrix';
import Vm from './Pages/VM';
import { useAuth } from './Components/AuthProvider';
import UnivNavbar from './Pages/UnivNavbar';
import VmGetSnap from './Components/VmGetSnap';
import VmTakeSnap from './Components/vmTakeSnap';
import Copy from './Pages/Copy';
import Registry from './Pages/Registry';
import { JobsProvider } from './Components/JobsContext';



const AppRouter = () => {
  
  const{auth,handlelogin}=useAuth()
  const [isAuth,setIsAuth]=useState(auth)
  
  useEffect(() => {    
      setIsAuth(auth)
  }, [auth]);

  function PrivateRoute() {
    const location=useLocation()
    console.log(isAuth)
    return isAuth ? <Outlet/> : <Navigate to="/login" state={{path:location.pathname}} />;
  }
  

 

 
  return (
    <JobsProvider>
    <Router>
      <UnivNavbar>
      <Routes>
          <Route element={<PrivateRoute/>}>
            <Route path="computers" element={<Computers />} />
            <Route path="dailycheck" element={<DailyCheck />} />
            <Route path="Citrix" element={<Citrix />} />
            <Route path="Copy" element={<Copy />} />
            <Route path="Registry" element={<Registry />} />
            <Route path="vm" >
              <Route path="manage" element={<VmGetSnap/>} />
              <Route path="create" element={<VmTakeSnap/>} />
            </Route>
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Navigate to="/computers" />} />
      </Routes>
      </UnivNavbar>
    </Router>
    </JobsProvider>
  );
};

export default AppRouter;
