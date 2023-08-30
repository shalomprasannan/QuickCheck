import { LinearProgress, Typography as P } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from 'react';


const Disk =(props)=>{
    
    const {Drives}=props

    useEffect(() => {
        if (!props.Drives)
        props.diskQuery()
    }, [Drives]);
    return(
        <div className=" grid grid-cols-3">
            {Drives && Drives.map((disk, index)=>{
                let free = Math.abs(disk.FreeSpaceGB/disk.TotalSpaceGB);
                return(
                <Box sx={{m:"20px"}} key={index}>
                    <P variant="body1">{disk.DriveLetter}\ 
                        <P color="GrayText" variant="caption"> • (  {Math.round(100-(free*100))}% used )</P>
                    </P>      
                    <LinearProgress color={100-(free*100)>90 ? "error":"primary"} variant="determinate" value={100-(free*100)} sx={{height:"15px"}}/>
                    <P variant="subtitle2" color="text.secondary">{Math.round(disk.FreeSpaceGB*10)/10} GB Free of {Math.round(disk.TotalSpaceGB*10)/10} GB</P>
                </Box>)})}
                {props.Error &&  <Error error={props.Error}/> }
        </div>
  )}

export default Disk;