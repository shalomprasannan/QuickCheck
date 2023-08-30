import {Typography as P, Badge, Box, Card, CircularProgress, Grid, IconButton, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import $ from 'jquery';

import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

function CitrixMachines() {

    

    function CircularProgressWithLabel(props) {
        const disk=props.disk
        const percent=100-(disk.FreeSpaceGB/disk.TotalSpaceGB*100)
        
        return (
            <React.Fragment>
                <Tooltip title={Math.round(disk.FreeSpaceGB)+"GB Free of "+Math.round(disk.TotalSpaceGB)+"GB"}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={percent} color={(percent<90)?"primary":"error"} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <P variant="caption" component="div" color="text.secondary">
                {`${Math.round(percent)}%`}
              </P>
            </Box>
          </Box>
          </Tooltip>
          <P variant="caption" component="div" color="text.secondary" className=" text-center">
                {disk.DriveLetter}
              </P>
          </React.Fragment>
        );
      }


      function RenderDisks(props) {
        const [drives, setDrives] = useState([]);
        const [errorFlag,setErrorFlag]=useState(false)

        useEffect(() => {
            const computername = props.name.replace("M1\\", '');
            let request = $.ajax({url: '/api/diskQuery',
            method: 'POST',
            data: computername,
            success: (data) => {
                const drives = JSON.parse(data);
                if (drives.Drives.length>0) {
                    setErrorFlag(false)
                    setDrives(drives.Drives);
                }
                else{
                    setErrorFlag(true)
                }
            }
         })
            // let request=$.post('/api/diskQuery', computername).then((data) => {
            // const drives = JSON.parse(data);
            // if (drives.Drives.length>0) {
            //     setErrorFlag(false)
            //     setDrives(drives.Drives);
            // }
            // else{
            //     setErrorFlag(true)
            // }
            // })
            console.log(request)
            return () => {
                if (request) {
                    request.abort();
                }
              };
        }, []);
        return(
        <div style={{display:"flex"}}>
            {drives.length>0 && drives.map((disk)=>(
                <CircularProgressWithLabel disk={disk} />
                ))}
                {!errorFlag && drives.length==0 && <CircularProgress/>}
                {errorFlag && <p>error</p>}
            </div>
        );

    }
    const[vdas,setVdas]=useState()

    useEffect(() => {
        $.post('/api/AllVda').then((data)=>{
            const json=JSON.parse(data)
            setVdas(json)
        })
     }, []);

     function rebootVda(machine){
        console.log(machine+"before post")
        $.post("/api/reboot",machine).then((data)=>{
            console.log(data)
        })
     }

    return ( 
        <React.Fragment>
        <Grid container gap={2} sx={{alignItems:"start",justifyContent:"center"}} className="h-full">
        <Grid item xs={5} className="h-full">
        <Badge anchorOrigin={{vertical:"top",horizontal:"left"}} color="info" badgeContent="MOC" sx={{ "& .MuiBadge-badge": {paddingTop:"5px",width:"3rem",top:"-10px",left:"25px",borderRadius:"10px 10px 0px 0px"},width:"100%",height:"100%"}}>
            <Card className="h-full overflow-y-auto overflow-x-hidden">
                {vdas ? "" :<LinearProgress />}
                <div className="h-full overflow-y-scroll">
                <Table stickyHeader>
                    <TableHead>
                        <TableCell>Machine</TableCell>
                        <TableCell>Drives</TableCell>
                        <TableCell>Sessions</TableCell>
                        <TableCell>Reboot</TableCell>
                    </TableHead>
                    <TableBody>
                        {vdas && vdas.Moc.map((row,index)=>(
                            <TableRow key={index}>
                            <TableCell><div style={{display:"flex"}}>{row.MachineName} {(row.RegistrationState == "Registered")?<VerifiedIcon color="success" sx={{fontSize:"1rem"}}/>:<NewReleasesIcon color="warning" sx={{fontSize:"1rem"}}/>}</div></TableCell>
                            <TableCell>
                                <RenderDisks name={row.MachineName} />
                                </TableCell>
                            <TableCell>{row.Sessions}</TableCell>
                            <TableCell sx={{ align:"center"}}><IconButton onClick={(e)=>{rebootVda(row.MachineName)}}><PowerSettingsNewIcon className='text-red-700'/></IconButton></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </Card>
            </Badge>
        </Grid>
        <Grid item xs={5} className="h-full">
        <Badge anchorOrigin={{vertical:"top",horizontal:"left"}} color="info" badgeContent="ROC" sx={{ "& .MuiBadge-badge": {paddingTop:"5px",width:"3rem",top:"-10px",left:"25px",borderRadius:"10px 10px 0px 0px"},width:"100%",height:"100%"}}>
            <Card className='h-full'>
            {vdas ? "" :<LinearProgress />}
            <div className="h-full overflow-y-auto">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                        <TableCell>Machine</TableCell>
                        <TableCell>Drives</TableCell>
                        <TableCell>Sessions</TableCell>
                        <TableCell>Reboot</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vdas && vdas.Roc.map((row,index)=>(
                            <TableRow key={index}>
                            <TableCell><div style={{display:"flex"}}>{row.MachineName} {(row.RegistrationState == "Registered")?<VerifiedIcon color="success" sx={{fontSize:"1rem"}}/>:<NewReleasesIcon color="warning" sx={{fontSize:"1rem"}}/>}</div></TableCell>
                            <TableCell><RenderDisks name={row.MachineName} /></TableCell>
                            <TableCell>{row.Sessions}</TableCell>
                            <TableCell sx={{padding:'0px', align:"center"}}><IconButton><PowerSettingsNewIcon className='text-red-700'/></IconButton></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </Card>
            </Badge>
        </Grid>
        </Grid>
        </React.Fragment>
     );
}

export default CitrixMachines;