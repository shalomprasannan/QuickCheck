import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, Input, LinearProgress, Paper, TextField } from '@mui/material';
import React, { Component, useState } from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import $ from 'jquery'
import { useJobs } from '../Components/JobsContext';

function Copy() {
    const[dialog,setDialog]=useState(false)
    const [loading,setLoading]=useState(false)
    const {jobs,getJobs}=useJobs()
    const [form,setForm]=useState({JobTag:"",Source:"",Destination:"",Machines:"",Recurse:false,Rewrite:false})
    const handleChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }
    const handleCopy=()=>{
        setDialog(false)
        setLoading(true)
        $.ajax({
            url:'/api/copy',
            method:"POST",
            data:JSON.stringify(form),
            success:(data)=>{
                console.log(data)
                setLoading(false)
            }
        })
        getJobs()
    }

    const{JobTag,Source,Destination,Machines,Recurse,Rewrite}=form
    return ( <>
    <div className="h-full">
        <Grid container sx={{alignItems:"center",justifyContent:"center"}} className="h-full">
        <Grid xs={3} item>
        {loading && <LinearProgress />}
        <Paper sx={{padding:"1rem",width:"100%"}}>
            <FormControl sx={{justifyContent:"space-between"}}fullWidth >
                <TextField variant="standard" placeholder='Job Tag *' required name="JobTag" value={JobTag} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
                <TextField variant="standard" placeholder='Source Path *' required name="Source" value={Source} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
                <TextField variant="standard" placeholder='Destination Path *' required name="Destination" value={Destination} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
                <FormControlLabel
                    label="Recurse the folder"
                control= {<Checkbox  checked={Recurse} onChange={()=>setForm({...form,Recurse:!form.Recurse})} />} />
                <FormControlLabel
                    label="Rewrite existing"
                control= {<Checkbox  checked={Rewrite} onChange={()=>setForm({...form,Rewrite:!form.Rewrite})} />} />
                <TextField  placeholder='Machines*' required multiline rows={4} name="Machines" value={Machines} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
                <Button variant="contained" onClick={()=>setDialog(true)}>Start Copying</Button>
            </FormControl>
            <Dialog open={dialog} onClose={()=>setDialog(false)}>
                <DialogTitle>Do you want to Continue ?</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Do you want to Copy the files/folders <br/>
                    <RemoveCircleOutlineIcon color='warning' /> from {"this location"}<br/>
                    <RemoveCircleOutlineIcon color='warning'/> to {"these Machines"} ?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>setDialog(false)}>Cancel</Button>
                <Button onClick={()=>{handleCopy()}} >Proceed</Button>
                </DialogActions>
            </Dialog>
        </Paper>
        </Grid>
        </Grid></div>
    </> );
}

export default Copy;