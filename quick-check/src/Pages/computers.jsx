import React, { useState, useEffect} from 'react';
import $ from 'jquery'
import TextField from '@mui/material/TextField';
import { Box, Button, ButtonGroup, Card, CardActionArea, CardContent, CardMedia, Chip, CircularProgress, IconButton, Input, LinearProgress, Tooltip, Typography as P } from '@mui/material';
import computer from '../Data/computer';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import {Link} from 'react-router-dom'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Disk from '../Components/disks';
import Kbs from '../Components/kbs';
import Services from '../Components/Services';
import Error from '../Components/error';
import { Stack } from '@mui/system';

function convertWMIDateTime(wmiDateTime) {
    const ticks = parseInt(wmiDateTime.replace(/\/Date\((\d+)\)\//, '$1'));
    const lastBootTime = new Date(ticks);
    const dateOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateString = lastBootTime.toLocaleDateString('en-US', dateOptions);
    const timeString = lastBootTime.toLocaleTimeString('en-US', timeOptions);
    return dateString + ' ' + timeString;
  }
  

const Computers = () =>{
    const [computer,setComputer] = useState({
                                        info:{},
                                        Drives:[],
                                        Service:[],
                                        kbsArray:[]})
    const [tab, setTab] = React.useState(null);
    const [search, setSearch] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const {ComputerName,IPAddress,OperatingSystem,Build,LastBootTime,SerialNo,LoggedOnUsers,Model}=computer.info

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const kbsQuery=()=>{
        setIsLoading(true)
        console.log("inside kbs Query")
        //this function is not been called from Kbs component
        $.post('/api/kbsQuery',ComputerName).then((data)=>{
            let json=JSON.parse(data)
            console.log(json)
            setComputer({...computer,
                kbsArray:[...json.KbsArray]})
            setIsLoading(false)
        })
    }
    const diskQuery=()=>{
        setIsLoading(true)
        $.post('/api/diskQuery',ComputerName).then((data)=>{
            let json=JSON.parse(data)
            console.log(json)
            setComputer({...computer,
                Drives:[...json.Drives]})
            setIsLoading(false)
        })
    }
    const servicesQuery=()=>{
        setIsLoading(true)
        $.post('/api/servicesQuery',ComputerName).then((data)=>{
            let json=JSON.parse(data)
            console.log(json)
            setComputer({...computer,
                Service:[...json.Services]})
            setIsLoading(false)
        })
    }

    const computerQuery=() => {
        setComputer({...computer,error:""})
        setIsLoading(true)
        $.post('/api/ComputerQuery',search).then((data)=>{
            let json= JSON.parse(data)
            setIsLoading(false)
            console.log(json)
            if(json.Error && json.Error.length>0){
                console.log(json.Error)
                setComputer({info:{...json},error :json.Error})
                return}
            setComputer({info:{...json}})
        })
       } 
    return (
    <div className="flex flex-col w-full h-full">
        <Box className="p-2 border-b-2 bg-white">
            <Input placeholder='Search' onChange={(e)=>{setSearch(e.target.value)}} value={search}/> 
            <IconButton onClick={computerQuery}><SearchOutlinedIcon/></IconButton>
        </Box>
        {isLoading ? <LinearProgress/>:''}
        <Box className="flex items-center justify-center p-4 h-full overflow-auto">

            {/* main card starts here */}
            {Object.values(computer.info).some(data => data) ? <Card variant="outlined" className={"box-border "+ (tab ? "w-full h-full flex-row " : "flex-col ")} sx={{display:"flex"}}>
                <Box className="flex flex-col border-r-2">
                    <Box className="flex w-max">
                        <CardContent className="text-left">
                            {ComputerName && <P variant="h5">{ComputerName}</P>}
                            {OperatingSystem && <P variant='subtitle1'>{OperatingSystem}</P>}
                            {IPAddress && <P variant='subtitle2'>IPAddress : {Array.isArray(IPAddress) ? IPAddress.join(', ') : IPAddress}</P>}
                            {Build && <P variant='subtitle2'>Build : {Build}</P>}
                            {LastBootTime && <P variant="subtitle2">Last Boot Time : {convertWMIDateTime(LastBootTime)}</P>}
                            { SerialNo && <Tooltip title={SerialNo}>
                                <P variant="subtitle2" className="truncate max-w-xs">Serial No : {SerialNo}</P>
                            </Tooltip>}
                            {LoggedOnUsers && <Tooltip title={Array.isArray(LoggedOnUsers) ? LoggedOnUsers.join(", ") : LoggedOnUsers}>
                                <P variant="subtitle2" className="truncate max-w-xs">Logged On Users : {Array.isArray(LoggedOnUsers) ? LoggedOnUsers.join(", ") : LoggedOnUsers} </P>
                            </Tooltip> }
                            {Model && <Chip color="primary" label={Model} className="mt-4"/>}
                        </CardContent>
                        <CardMedia
                            component="img"
                            sx={{ width: 150,alignSelf:"flex-start" }}
                            image={OperatingSystem.match(/(2012 R2|2012|2016|2008 R2|2008|2019)/)[0]+".png"}
                        />
                    </Box>
                </Box>
                {/* Tabs starts here */}
                <Box className="w-full">
                    <TabContext value={tab||false}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}  aria-label="lab API tabs example">
                                <Tab label="KBs" value="1" />
                                <Tab label="Disks" value="2" />
                                <Tab label="Services" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Kbs {...computer} kbsQuery={kbsQuery}/>
                        </TabPanel>
                        <TabPanel value="2" className='text-left'>
                            <Disk {...computer} diskQuery={diskQuery}/>
                        </TabPanel>
                        <TabPanel value="3">
                            <Services {...computer} servicesQuery={servicesQuery}/>
                        </TabPanel>
                        
                    </TabContext>
                </Box>
            </Card>:((!Object.keys(computer.info).some(data => data)) && isLoading && <CircularProgress/>)}
            {/* main card ends here */}
            {(Object.keys(computer.info).some(data => data))&& (!Object.values(computer.info).some(data => data)) &&  <Card className='h-full w-full'>
                    <ReportProblemRoundedIcon sx={{width:"70%",height:"70%"}} color="disabled"/>
                    <P variant="h5"> There is an error </P>
                </Card> }
        </Box>
    </div>
)}

export default Computers;