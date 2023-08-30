import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, LinearProgress, Paper, TextField } from '@mui/material';
import React, { Component, useState } from 'react';

function Registry() {
    const [dialog,setDialog]=useState(false)

    const [form,setForm]=useState({jobTag:"",regKey:"",backupPath:"",machines:""})
    const handleChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }
    const{jobTag,regKey,backupPath,machines}=form
    return ( <>
    <div className="h-full">
        <Grid container sx={{alignItems:"center",justifyContent:"center"}} className="h-full">
        <Grid xs={3} item>
        <Paper sx={{p:"1rem"}}>
            <Grid container direction={"column"}>
            <TextField multiline placeholder='JobTag' name="jobTag" value={jobTag} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
            <TextField multiline rows={8} placeholder='Paste the Key here' name="regKey" value={regKey} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
            <TextField variant='standard' multiline placeholder="Backup Location" name="backupPath" value={backupPath} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
            <TextField multiline rows={4} placeholder="machines*" name="machines" value={machines} onChange={(e)=>handleChange(e)} sx={{pb:"1rem"}} />
            <Button variant="contained" onClick={()=>setDialog(true)}>Run it</Button>
            </Grid>
            <Dialog open={dialog} onClose={()=>setDialog(false)}>
                <DialogTitle>Do you want to Continue ?</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Do you really want to run this Registries on following machines ?<br/>
                    Enter "Yes" below to proceed
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    placeholder="Yes"
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>setDialog(false)}>Cancel</Button>
                <Button onClick={()=>setDialog(false)} >Proceed</Button>
                </DialogActions>
            </Dialog>
        </Paper>
        </Grid>
        </Grid>
        </div>
    </> );
}

export default Registry;