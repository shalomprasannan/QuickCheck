import { Button, Card, CardMedia, Grid, Input } from '@mui/material';
import React, { Component, useState } from 'react';
import $ from 'jquery'
import Cookies from 'universal-cookie'
import { Navigate,useLocation } from 'react-router-dom';
import { useAuth } from '../Components/AuthProvider';
import { useEffect } from 'react';

function Login() {
    const location=useLocation()
    const {auth,setAuth,handlelogin}=useAuth()
    const redirectPath=location.state?.path || "/computers"
    if (redirectPath)
    {
        console.log(redirectPath)
    }
    

      useEffect(()=>{
        handlelogin()
      },[auth])
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    return ( <>
    {!auth?
    <Grid container sx={{width:'100%',height:'100%',justifyContent:"center",p:'6rem'}}>
        <Grid item xs={3}>
            <Card sx={{height:'100%'}} className='flex flex-col justify-evenly'>
                <CardMedia
                    sx={{ maxWidth: 345 }}
                    component="img"
                    height="140"
                    image="https://picsum.photos/500/300"
                />
                <div style={{height:'100%',padding:'1rem'}} className='flex flex-col justify-evenly'>
                    <Input placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <Input placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} type='Password' />
                <Button onClick={()=>handlelogin(username,password)}>Login</Button>
                </div>
            </Card>    
        </Grid>
    </Grid>:<Navigate to={redirectPath} replace/>}
    </>
    );
}

export default Login;