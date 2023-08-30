import { Input, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Typography as P } from "@mui/material";
import React, { useState, useEffect } from 'react';

function convertWMIDateTime(wmiDateTime) {
    const ticks = parseInt(wmiDateTime.replace(/\/Date\((\d+)\)\//, '$1'));
    const lastBootTime = new Date(ticks);
    const dateOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateString = lastBootTime.toLocaleDateString('en-US', dateOptions);
    const timeString = lastBootTime.toLocaleTimeString('en-US', timeOptions);
    return dateString + ' ' + timeString;
  }

function Kbs(props) {
    const [search, setSearch] = useState("")

    const kbsArray = props.kbsArray && props.kbsArray.filter((kb) => {
        //returns matching services
        return kb.HotFixID.toLowerCase().includes(search.toLowerCase());
      });
    
      useEffect(() => {
        if (!props.kbsArray)
        {props.kbsQuery();}
       }, []);

    return ( 
        <React.Fragment>
            {props.kbsArray && <div>
                <Input placeholder="Search" onChange={(e)=>{setSearch(e.target.value)}} value={search}/>
                <TableContainer component={Paper} sx={{height: 400}}>
                    <Table stickyHeader sx={{height: "max-content"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell><P  className="font-black">Description</P></TableCell>
                                <TableCell><P  className="font-black">Hot-Fix ID</P></TableCell>
                                <TableCell><P  className="font-black">Installed on</P></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="h-[400] overflow-x-scroll">
                            {kbsArray.map((kb,index)=>(
                                <TableRow hover key={index}>
                                    <TableCell>{kb.HotFixID}</TableCell>
                                    <TableCell>{kb.Description}</TableCell>
                                    <TableCell>{kb.InstalledOn.DateTime ? kb.InstalledOn.DateTime : convertWMIDateTime(kb.InstalledOn)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}
            {props.Error &&  <Error error={props.Error}/> }
        </React.Fragment>
    );
}

export default Kbs;