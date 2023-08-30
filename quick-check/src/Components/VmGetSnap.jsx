import {Input,Button, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow,Typography as P,LinearProgress, Snackbar, Alert  } from "@mui/material";
import React,{useState,useEffect} from "react";
import $, { contains } from 'jquery'

function VmGetSnap() {

    const [snapshots,setSnapshots]=useState([])
    const [filter,setFilter]=useState([])
    const [checked,setChecked]=useState([])
    const [snack,setSnack]=useState("")
    const [checkAll,setCheckAll]=useState(false)
    var filteredVM=[]

    useEffect(()=>{
        $.get("/api/getSnap").then((data)=>{
            let json=JSON.parse(data)
            setSnapshots(json)
        })
    },[])
    
    const handleChange=(e)=>{
        setFilter({
            ...filter,
            [e.target.name]:e.target.value
        })
    }

    const handleCheck=(VMName)=>{
        if(checked.includes(VMName)){
            setChecked(prev=>{
                return prev.filter(Name => Name != VMName)
            })
        }else{
        setChecked([...checked,VMName])
        }
    }

    const handleDelete=()=>{
        console.log(checked)
        $.post('/api/deleteSnap',JSON.stringify(checked)).then((data)=>{
            let json =JSON.parse(data)
            //setChecked(json.Snaps)
            setSnack(json.Message)
            setSnapshots(prev=>{
                return prev.filter(Snap=>!(checked.includes(Snap.VMName)))
            })
        })
    }

    const checkFiltered=()=>{
        if(!checkAll){
        setChecked(filteredVM)
        setCheckAll(true)
        }
        else{
        setChecked([])
        setCheckAll(false)
        }

    }

    const rowRenderer=(row)=>{
        const checkStr=(property)=>{
            if(!filter[property]){
                return true
            }
            const regex=new RegExp(`^.*${filter[property]}.*$`,"gmi")
            return regex.test(row[property])
        }
        const Size=filter.Size ? filter.Size : 999999
        const Days=filter.Days ? filter.Days : -1
        if(checkStr("VMName") && checkStr("SName") && checkStr("SDesc") && checkStr("OS") && (row.Size < Size) && (row.Days > Days)){
            filteredVM.push(row.VMName)
            return(
            <TableRow size='small' >
                <TableCell > <Checkbox size="small" onChange={()=>{handleCheck(row.VMName)}} checked={checked.includes(row.VMName)}/> </TableCell>
                <TableCell >{row.VMName}</TableCell>
                <TableCell >{decodeURIComponent(row.SName)}</TableCell>
                <TableCell >{row.SDesc}</TableCell>
                <TableCell >{Math.round(row.Size,1)} GB</TableCell>
                <TableCell >{row.Days}</TableCell>
                <TableCell >{row.OS}</TableCell>
            </TableRow>
            )}
    }
    return ( 
        <Grid sx={{height:"100%",p:"2rem",display:"flex"}} direction="column" >
    <Paper sx={{width:"100%",height:"100%",overflowY:"scroll"}}>
        <Table sx={{height:"100%"}} stickyHeader size="small">
            <colgroup>
                <col style={{width:'5%'}}/>
                <col style={{width:'10%'}}/>
                <col style={{width:'10%'}}/>
                <col style={{width:'10%'}}/>
                <col style={{width:'10%'}}/>
                <col style={{width:'10%'}}/>
                <col style={{width:'20%'}}/>
            </colgroup>
            <TableHead>
                    <TableCell> <Checkbox size="small" onChange={checkFiltered} checked={checkAll}/> </TableCell>
                    <TableCell>VM Name</TableCell>
                    <TableCell>SnapShot Name</TableCell>
                    <TableCell>SnapShot Description</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Created before</TableCell>
                    <TableCell>OS</TableCell>
            </TableHead>
            <TableBody>
            {snapshots.length>0 && 
                <TableRow >
                    <TableCell ></TableCell>
                    <TableCell ><Input placeholder="VM Name" onChange={e=>handleChange(e)} name="VMName" value={filter.VMName}/></TableCell>
                    <TableCell ><Input placeholder="Snapshot Name" onChange={e=>handleChange(e)} name="SName" value={filter.SName}/></TableCell>
                    <TableCell ><Input placeholder="Snapshot Description" onChange={e=>handleChange(e)} name="SDesc" value={filter.SDesc}/></TableCell>
                    <TableCell ><Input placeholder="Size" onChange={e=>handleChange(e)} name="Size" value={filter.Size}/></TableCell>
                    <TableCell ><Input placeholder="Days" onChange={e=>handleChange(e)} name="Days" value={filter.Days}/></TableCell>
                    <TableCell ><Input placeholder="OS" onChange={e=>handleChange(e)} name="OS" value={filter.OS}/></TableCell>
                </TableRow>}
                {snapshots.length>0 ? snapshots.map((row)=>{
                    return rowRenderer(row)
                }):
                <TableRow>
                    <TableCell colSpan={7}><P variant="subtitle1" style={{textAlign:"center"}}>Fetching Snapshots...<br/>
                    It can take upto a minute, Please don't refresh the Page</P>
                    <LinearProgress color="warning"/>
                    </TableCell>
                </TableRow>
                }
            </TableBody>
        </Table>
    </Paper>
    <Button sx={{alignSelf:"auto"}} color="error" variant="contained" onClick={handleDelete}>Delete</Button>
    <Snackbar open={snack} autoHideDuration={6000} onClose={(e,reason)=>{reason != 'clickaway' && setSnack('')}}>
        <Alert onClose={(e,reason)=>{reason != 'clickaway' && setSnack('')}} severity="success" sx={{ width:"300px",height:"max-content" }}>
          {snack}
        </Alert>
      </Snackbar>
    </Grid>
    );
}

export default VmGetSnap;

