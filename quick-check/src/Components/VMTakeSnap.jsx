import { Button, Checkbox, CircularProgress, Dialog, FormControl, FormControlLabel, Grid, Input, InputLabel, LinearProgress, Paper, TextField, Typography as P } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import $ from 'jquery'

function VmTakeSnap() {
    const state={
        SName:"",
        SDesc:"",
        FlagMemory:false,
        FlagDeleteExist:false,
        machines:"",
        loading:false
    }
    const[form,setForm]=useState(state)
    const[message,setMessage]=useState({})
    const{SName,SDesc,FlagMemory,FlagDeleteExist,machines,loading}=form

    const handleString=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }
    const handleCheckbox=(e)=>{
        setForm({...form,[e.target.name]:!form[e.target.name]})
    }
    const handleSubmit=()=>{
        setForm({...form,loading:true})
        setMessage({})
        $.post('/api/CreateSnap',JSON.stringify(form)).then(
            (data)=>{
                const json=JSON.parse(data)
                console.log(json)
                setForm(state)
                setMessage({notInVMware:json.notInVmware,success:json.success})
            })
    }
    const handleClear=()=>{
        setForm(state)
        setMessage({})
    }
    return ( 
    <div className="h-full">
        {loading && <LinearProgress />}
        <Grid container sx={{alignItems:"center",justifyContent:"center"}} className="h-full">
        <Grid xs={3} item>
        <Paper className="p-4">
            <Grid container direction="column" gap={2}>
                <TextField sx={{width:"100%"}} placeholder="i.e., 'June 23 Patching'" label="Snapshot Name" variant="standard" value={SName} onChange={e=>handleString(e)} name="SName" />
                <TextField sx={{width:"100%"}} placeholder="i.e., 'Requested by CRM team'" multiline rows={5} label="Description" value={SDesc} onChange={e=>handleString(e)} name="SDesc" />
                <Grid container direction={"column"}>
                <FormControlLabel
                label ="Take Snapshot with Memory"
                checked={FlagMemory}
                onChange={e=>handleCheckbox(e)} 
                name="FlagMemory" 
                control={<Checkbox/>} />

                <FormControlLabel
                label ="Delete existing Snapshots"
                checked={FlagDeleteExist}
                onChange={e=>handleCheckbox(e)}
                name="FlagDeleteExist"
                control={<Checkbox/>} />

                <TextField placeholder="Seperated by Comma (,) i.e., VM01,VM02" multiline rows={3} label="Machine Names" onChange={e=>handleString(e)} name="machines" value={machines}/>
                </Grid>
                <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                <Button sx={{width:"max-content",textTransform:"none"}} color="warning" onClick={handleClear}>Clear Form</Button>
                <Button sx={{width:"max-content",textTransform:"none"}} variant="contained" onClick={handleSubmit}>Take Snapshot</Button>
                </div>
                <Dialog open={Object.keys(message).length>0} onClose={()=>setMessage({})} fullWidth maxWidth="sm">
                {Object.keys(message).length>0 &&
                    <Grid container direction={"column"} sx={{wordBreak:"break-word",height:"100px",overflowY:"auto"}}>
                        {<P variant="paragraph" > <b>Successfully taken : </b> {message.success.length>0 ? message.success.join(","):message.success}<br/><br/></P>}
                        {<P variant="paragraph"><b>Not existing VMs : </b> {message.notInVMware.length>0 ? message.notInVMware.join(","):message.notInVMware}</P>}
                    </Grid>}
                </Dialog>
            </Grid>
        </Paper>
        </Grid>
        </Grid>
    </div>
    );
}

export default VmTakeSnap;