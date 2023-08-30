import { Badge, Box, Card, Grid, IconButton, LinearProgress, Typography as P, Switch } from '@mui/material';
import React, { Component } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

function CitrixVda() {
    const Drive=(props)=>{
        const {free,total,Drive}=props
        let freeper = Math.abs(free/total);
            return(
            <Box sx={{m:"10px"}}>
                <P variant="body1">{Drive}\ 
                    <P color="GrayText" variant="caption"> • (  {Math.round(100-(freeper*100))}% used )</P>
                </P>      
                <LinearProgress color={100-(freeper*100)>90 ? "error":"primary"} variant="determinate" value={100-(freeper*100)} sx={{height:"15px"}}/>
                <P variant="caption" color="text.secondary">{Math.round(free*10)/10} GB Free of {Math.round(total*10)/10} GB</P>
            </Box>)
    }
    return (
        <Grid container xs className='h-full items-center justify-center'>
            <Grid item xs={6}>
            <Badge anchorOrigin={{vertical:"top",horizontal:"left"}} color="success" badgeContent="WinRM" sx={{ "& .MuiBadge-badge": {width:"5rem",top:"-10px",left:"40px",borderRadius:"10px 10px 0px 0px"},width:"100%"}}>
                <Card sx={{width:"100%"}} className="text-left p-4">
                    <Grid container>
                        <Grid item xs={6}>
                            <P variant="h5" className="pb-4">XAVDA05 <IconButton><PowerSettingsNewIcon className='text-red-700'/></IconButton></P>
                            <P variant="subtitle1" color="GrayText">Rebooted 20 Days before</P>
                            <P variant="subtitle1" color="GrayText">Connected Sessions : 15</P>
                            <P variant="subtitle1" color="GrayText" className="mr-8" >Registered <VerifiedIcon className="text-green-600" sx={{fontSize:"1rem"}} /></P>
                            <P variant="subtitle1" color="GrayText">Maintenance <ToggleOffIcon/></P>
                        </Grid>
                        <Grid item xs={6}>
                            <Drive free={12} total={125} Drive={"C:"}/>
                            <Drive free={23} total={80} Drive={"D:"}/>
                        </Grid>
                    </Grid>
                </Card>
            </Badge>
            </Grid>
        </Grid>
    )
    }

export default CitrixVda;