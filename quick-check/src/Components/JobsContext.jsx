import React, { createContext, useContext, useEffect, useState } from 'react';
import $ from 'jquery'

const JobsContext = createContext();


export function JobsProvider({ children }) {
  const [jobs,setJobs]=useState()
  var request
  useEffect(()=>{
    if(!jobs){
        getJobs()
        return ()=>{
            request.abort()
        }
    }
  },[jobs])

  const getJobs=()=>{
    request=$.ajax({
      url:'/api/jobs/get',
      method:'GET',
      success:(data)=>{
          let json=JSON.parse(data)
          if(json.Message == undefined){
            json=Array.isArray(json) ? json : [json]
          }
          console.log(json)
          setJobs(json)
      }
    })
  }

  const stopJobs=(id)=>{
    request=$.ajax({
      url:'/api/jobs/stop',
      method:'POST',
      data:id,
      success:(data)=>{
          let json=JSON.parse(data)
          if(json.Message == undefined){
            json=Array.isArray(json) ? json : [json]
          }
          console.log(json)
          setJobs(json)
      }
    })
  }
  const clearAllJobs=()=>{
    $.ajax({
        url:'/api/jobs/clearAll',
        success:(data)=>{
            let json=JSON.parse(data)
            console.log(json)
            setJobs(json)
        }
    })
  }
  const clearJob=(id)=>{
    // $.ajax({
    //     url:'/api/jobs/clearOne',
    //     data:id,
    //     success:(data)=>{
    //         let json=JSON.parse(data)
    //         if(json.Message == undefined){
    //             json=Array.isArray(json) ? json : [json]
    //           }
    //         console.log(json)
    //         setJobs(json)
    //     }
    // })

    $.post('/api/jobs/clearOne',id).then((data)=>{
        let json=JSON.parse(data)
            if(json.Message == undefined){
                json=Array.isArray(json) ? json : [json]
              }
            console.log(json)
            setJobs(json)
    })
  }
  

    return (
        <JobsContext.Provider value={{ jobs,getJobs,stopJobs,clearJob,clearAllJobs}}>
          {children}
        </JobsContext.Provider>
      );
    }


export function useJobs() {
    return useContext(JobsContext);
}