import React,{useState,useEffect} from 'react';
import { Button, FormControl, IconButton, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import $ from 'jquery'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

function DailyCheck() {

    const [data,setData] = useState([])
    const [selectedDrive, setSelectedDrive] = useState('C:');
    const [diskPercentage, setdiskPercentage] = useState(10);
    const [rebootDays, setRebootDays] = useState(30);
    const [searchMachine, setSearchMachine] = useState('');


    const healthQuery=(ComputerName)=>{
        //this function is not been called from Kbs component
        $.post('/api/healthQuery',ComputerName).then((data)=>{
            let json=JSON.parse(data)
            setData(json)
        })
    }

    useEffect(() => {
        $.post('/api/healthQuery').then((dat)=>{
            let json=JSON.parse(dat)
            console.log(dat)
            setData(json)
        })
     }, []);


    const rowRenderer=(row)=>{
        if(Array.isArray(row.Disks)){
            
            const regex=new RegExp(`^.*${searchMachine}.*$`,"gmi")
            for (const disk of row.Disks){
                var percentage=Math.round(disk.FreeSpaceGB/disk.TotalSpaceGB*100)
                var checkpercent = diskPercentage ? diskPercentage : 101
                if((percentage < checkpercent) && (disk.DriveLetter == selectedDrive) && (row.Uptime > rebootDays) && (regex.test(row.Computername))){
                    return(
                    <TableRow key={row.Computername}>
                        <TableCell size="small">{row.Computername}</TableCell>
                        <TableCell size="small">{row.Uptime} days</TableCell>
                        <TableCell size="small">{row.Status}</TableCell>
                        <TableCell size="small">{disk.DriveLetter} {disk.FreeSpaceGB} GB<br/>{percentage+"% free"}</TableCell>
                        <TableCell size="small">{row.LastUpdated}</TableCell>
                        <TableCell size="small"><Button name={row.Computername} onClick={(e)=>{healthQuery(e.target.name)}}>Sync</Button></TableCell>
                    </TableRow>)
                }
            }
        }
    }
    return ( 
        <div className='p-4 h-full relative'>
            <div style={{backgroundColor:"white",position:"fixed",top:"0px",right:"0px",zIndex:10,}}>
                    <a download="somedata.csv" href="#" onclick="return ExcellentExport.csv(this, 'datatable');"><SystemUpdateAltIcon/></a>
            </div>
        <Paper className="relative h-full overflow-hidden">

    <TableContainer className="h-full" >
        <Table stickyHeader className="h-full overflow-scroll" id="datatable">
            <TableHead>
            <TableRow>
                <TableCell>MachineName</TableCell>
                <TableCell>Uptime</TableCell>
                <TableCell>Health Status</TableCell>
                <TableCell>Disk Alerts</TableCell>
                <TableCell>Last Fetched</TableCell>
                <TableCell>Fetch Again</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            <TableRow>
                <TableCell>
                    <Input placeholder='Search' onChange={(e)=>setSearchMachine(e.target.value)} value={searchMachine}/> 
                </TableCell>
                <TableCell>
                    <Input placeholder='Filter Above' 
                        onChange={(e)=>{/^\d{0,3}$/.test(e.target.value) && setRebootDays(e.target.value)}} 
                        value={rebootDays} type="number"
                        sx={{width:"5rem"}}/>
                </TableCell>
                <TableCell>...</TableCell>
                <TableCell>
                    <FormControl sx={{width:"5rem",mr:"1rem",height:"2rem"}} >
                        <InputLabel sx={{mb:"0.5rem"}} >Drive</InputLabel>
                        <Select
                            sx={{height:"2rem"}}
                            value={selectedDrive}
                            onChange={(event) => setSelectedDrive(event.target.value)}
                        >
                            <MenuItem value="C:">C:</MenuItem>
                            <MenuItem value="D:">D:</MenuItem>
                            <MenuItem value="E:">E:</MenuItem>
                        </Select>
                    </FormControl>
                    <Input placeholder='Below %' 
                    onChange={(e)=>{/^\d{0,2}$/.test(e.target.value) && setdiskPercentage(e.target.value)}} 
                    value={diskPercentage} type='number'
                    sx={{width:"5rem"}}/>
                </TableCell>
                <TableCell>...</TableCell>
                <TableCell>...</TableCell>
            </TableRow>
            {data.map((row) => (
                rowRenderer(row)
            ))}
            </TableBody>
        </Table>
      </TableContainer>
      </Paper>
      </div>
    );
}

export default DailyCheck;