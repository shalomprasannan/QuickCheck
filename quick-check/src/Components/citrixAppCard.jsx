import { Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography as P, IconButton, Skeleton, LinearProgress } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import $ from 'jquery'

function CitrixAppCard(props) {

    const {app}=props
    const[expand,setExpand]=useState(false)
    const [appInfo,setAppInfo]=useState([])
    const handleExpand=()=>{
        if(!expand){
        $.ajax({
            url:'/api/XenAppInfo',
            method:"POST",
            data:`${app.Uid}`,
            success:(data)=>{
                console.log(data)
                let json=JSON.parse(data)
                if(!Array.isArray(json)){
                    setAppInfo([json])
                    return
                }
                setAppInfo(json)
            }
        })
    }
    setExpand(!expand)
    }


    return ( 
        <Grid item>
            <Card sx={{p:"1rem"}}>
                <Grid container direction={'column'} sx={{height:"100%"}} gap={1}>
                    <Grid item xs={3} container >
                        <Grid item container gap={3}>
                            <Grid item>
                                <LaptopMacIcon sx={{fontSize:"7rem"}} className=" text-gray-400" />
                            </Grid>
                            <Grid item alignSelf={"center"} sx={{textAlign:"left"}}>
                                <P variant='h6'>{app.AppName}</P>
                                {app.Sessions  !== undefined ? <P color="text.secondary">Total Sessions : {app.Sessions}</P>: <Skeleton variant="text" sx={{ fontSize: '1rem' }} />}
                                {app.Machines !== undefined ? <P color="text.secondary">Total VDA : {app.Machines} <IconButton onClick={handleExpand}><ExpandCircleDownIcon/></IconButton></P>:<Skeleton variant="text" sx={{ fontSize: '1rem' }} />}
                            </Grid>
                        </Grid>
                    </Grid>
                    {expand && <Grid item xs={8} sx={{p:"1rem",display: "block"}}>
                        <div className='border rounded-lg'>
                        <Table>
                            <TableHead sx={{backgroundColor:"#eee"}}>
                                <TableRow>
                                    <TableCell>Machine</TableCell>
                                    <TableCell>Registration State</TableCell>
                                    <TableCell>Sessions</TableCell>
                                    <TableCell>Restart</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            
                            {appInfo?.length>0 ? appInfo.map((vda)=>(
                                <TableRow>
                                <TableCell>{vda.MachineName}</TableCell>
                                <TableCell>{vda.RegistrationState}</TableCell>
                                <TableCell>{vda.Sessions}</TableCell>
                                <TableCell ><IconButton><PowerSettingsNewIcon/></IconButton></TableCell>
                            </TableRow>
                            )):<TableRow><TableCell colSpan={4} ><LinearProgress/></TableCell></TableRow>}

                            </TableBody>
                        </Table>
                        </div>
                    </Grid>}
                </Grid>
            </Card>
        </Grid>
);
}

export default CitrixAppCard;