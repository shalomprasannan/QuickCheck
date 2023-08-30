import { Button } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { Component, useState } from 'react';
import {Link, NavLink} from 'react-router-dom'
import { useAuth } from '../Components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Jobs from './Jobs';
import { JobsProvider } from '../Components/JobsContext';

function UnivNavbar({children}) {
    const [link,setLink]=useState("")
    const {handleLogout,auth}=useAuth()
    const navigate=useNavigate()
    const logout=()=>{
        handleLogout()
        navigate("login")
    }
    const [jobDialog,setJobDialog]=useState(false)

    return ( 
    <>
    <Box className=" border-b-2" sx={{backgroundColor: 'rgba(255,255 ,255, 0.7)', position:"fixed",width:"100%",zIndex:100}}>
    <Stack direction={"row"} sx={{justifyContent:"end"}} >
        <NavLink to={"Computers"} className={({ isActive}) =>  isActive && setLink("Computers")} ><Button size="small" sx={{py:"0px"}} variant={link == "Computers" ? "outlined":"text"} >Computers</Button></NavLink>
        <NavLink to={"/vm/Create"} className={({ isActive}) =>  isActive && setLink("/vm/create")} ><Button size="small" sx={{py:"0px"}} variant={link == "/vm/create" ? "outlined":"text"} >New Snap</Button></NavLink>
        <NavLink to={"/vm/manage"} className={({ isActive}) =>  isActive && setLink("/vm/manage")} ><Button size="small" sx={{py:"0px"}} variant={link == "/vm/manage" ? "outlined":"text"} >Manage Snap</Button></NavLink>
        <NavLink to={"/citrix"} className={({ isActive}) =>  isActive && setLink("citrix")} ><Button size="small" sx={{py:"0px"}} variant={link == "citrix" ? "outlined":"text"} >Citrix</Button></NavLink>
        <NavLink to={"/Dailycheck"} className={({ isActive}) =>  isActive && setLink("Dailycheck")} ><Button size="small" sx={{py:"0px"}} variant={link == "Dailycheck" ? "outlined":"text"} >DailyCheck</Button></NavLink>
        <NavLink to={"/Copy"} className={({ isActive}) =>  isActive && setLink("Copy")} ><Button size="small" sx={{py:"0px"}} variant={link == "Copy" ? "outlined":"text"} >Copy</Button></NavLink>
        <Button size="small" sx={{py:"0px"}} onClick={()=>setJobDialog(!jobDialog)} >Jobs</Button>
        <NavLink to={"/Registry"} className={({ isActive}) =>  isActive && setLink("Registry")} ><Button size="small" sx={{py:"0px"}} variant={link == "Registry" ? "outlined":"text"} >Registry</Button></NavLink>
        {auth 
        ?<Button onClick={logout} size="small" sx={{py:"0px"}}> Logout</Button>
        :<NavLink to={"login"} className={({ isActive}) =>  isActive && setLink("login")} ><Button size="small" sx={{py:"0px"}} variant={link == "login" ? "outlined":"text"} >Login</Button></NavLink>}
    </Stack>
    </Box>
    <div className="pt-6" style={{height:"100%"}}>{children}</div>
    {jobDialog && <Jobs job={jobDialog} setJob={setJobDialog}/>}
    </>
     );
}

export default UnivNavbar;