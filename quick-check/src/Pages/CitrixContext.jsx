import React, { createContext, useContext, useState } from 'react';
import $ from 'jquery'

const CitrixContext = createContext();


export function CitrixProvider({ children }) {
  const [apps,setApps]=useState([])
  let request
  const fetchApps=()=>{
    request=$.ajax({
      url:'/api/AllXenApp',
      success:(data)=>{
          let json=JSON.parse(data)
          console.log(json)
          setApps(json)
      }
    })
  }

    return (
        <CitrixContext.Provider value={{ apps, fetchApps, request }}>
          {children}
        </CitrixContext.Provider>
      );
    }


export function useCitrix() {
    return useContext(CitrixContext);
}