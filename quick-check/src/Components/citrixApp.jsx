import { CircularProgress, Grid } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import CitrixAppCard from './citrixAppCard';
import $ from 'jquery'
import { FixedSizeList} from 'react-window';
import { useCitrix } from '../Pages/CitrixContext';

function CitrixApp (props) {
    // const [apps,setApps]=useState([])
    const search=props.search
    const {apps,fetchApps,request}=useCitrix()
    useEffect(()=>{
        if(!apps.length){
        fetchApps()
        }
        return ()=>{
            if(request){
            request.abort()}
        }
    },[apps])
    
    return ( 
        <Grid container className='h-full overflow-y-auto' rowGap={2} columnGap={2} sx={{justifyContent:"center"}}>                
           {apps.length>0 ? apps.map((app)=>{
            if(app.AppName.toLowerCase().includes(search.toLowerCase())){
                return(
                <Grid item xs={6}>
                <CitrixAppCard app={app}/>
                </Grid>)}
    }):<CircularProgress/> }
            </Grid>
     );
}

export default CitrixApp;