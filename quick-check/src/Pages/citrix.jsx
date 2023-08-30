import { Box, Button, ButtonGroup, Card, IconButton, Input, ToggleButton, ToggleButtonGroup, Typography as P, Grid, Switch, CircularProgress, LinearProgress, Badge, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { Component, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CitrixVda from '../Components/citrixVda';
import CitrixUser from '../Components/citrixUser';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CitrixAppCard from '../Components/citrixAppCard';
import CitrixMachines from '../Components/citrixMachines';
import CitrixApp from '../Components/citrixApp';
import { CitrixProvider } from './CitrixContext';



function Citrix() {
    const [search,setSearch]=useState('')

    const renderSwitch=(param)=>{
        switch(param) {
            case 'App':
                return <CitrixApp  search={search} />;
            case 'Vda':
                return <CitrixVda search={search} />;
            case 'User':
                return <CitrixUser search={search} />;
            case 'AllVda':
                return <CitrixMachines search={search} />;
        }
      }



    const [value,setValue]=useState('AllVda');

    return (
        <CitrixProvider>
        <div className="flex flex-col w-full h-full">
        <Box className="p-2 border-b-2 bg-white flex">
            <Box className=" ml-auto">
                <Input placeholder='Search' onChange={(e)=>{setSearch(e.target.value)}} value={search} className=" self-center"/> 
                <IconButton ><SearchOutlinedIcon variant="primary"/></IconButton>
            </Box>
            <ToggleButtonGroup color="primary" value={value} onClick={(e)=>{setValue(e.target.value)}} className="mr-auto ml-10 my-auto h-8" >
                <ToggleButton value="App" >App</ToggleButton>
                <ToggleButton value="User" >User</ToggleButton>
                <ToggleButton value="Vda">Vda</ToggleButton>
                <ToggleButton value="AllVda" sx={{textTransform:"none"}}>All Vda</ToggleButton>
            </ToggleButtonGroup>
        </Box>
        <Box className="flex justify-center p-4 h-full overflow-hidden mb-4 mt-4 items-start">
            {renderSwitch(value)}
        </Box>
        </div>
        </CitrixProvider>
    )
}

export default Citrix;