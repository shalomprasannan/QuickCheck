import React, { createContext, useContext, useState } from 'react';
import Cookies from 'universal-cookie';
import $ from 'jquery'
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(false);

  async function handlelogin(user,pass){  
    const cookies = new Cookies();
    let username= user? user:cookies.get('SessionUser')
    let password= pass? pass :cookies.get('SessionId')

    if ( username && password){
      const data=await $.post('/api/login',{username:username,password:password})
      let json=JSON.parse(data)
      if(!json.Error){
        console.log("true in handlelogin")
        cookies.set("SessionUser",json.username)
        cookies.set("SessionId",json.password)
        setAuth(true)
      }
      else{
        cookies.remove("SessionUser")
        cookies.remove("SessionId")
        setAuth(false)
      }
    }
    else{console.log("provide the credentials");return}
  }

  const handleLogout=()=>{
    const cookies= new Cookies();
    setAuth(false)
    cookies.remove("SessionUser")
    cookies.remove("SessionId")
  }
  return (
    <AuthContext.Provider value={{ auth, setAuth,handlelogin,handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}