import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from '@mui/material';
import { useJobs } from '../Components/JobsContext';
import WorkIcon from '@mui/icons-material/Work';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useEffect } from 'react';

export default function Jobs(props) {
  const open=props.job
  const setOpen=props.setJob
  const {jobs,getJobs,stopJobs,clearJob}=useJobs()

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    getJobs()
  },[])
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">Jobs</DialogTitle>
        <DialogContent dividers={true} >
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            {jobs?.Message && jobs.Message}
            <List>
            {Array.isArray(jobs) && jobs.map((job)=>(
                <>
                <ListItem
                sx={{overflowX:"hidden"}}
                    secondaryAction={
                    <Tooltip title={(job.inst_Status.IsCompleted) ?"Delete":"stop"}>
                        {(job.inst_Status.IsCompleted) ? <IconButton edge="end" aria-label="delete" className="hover:text-red-600" onClick={()=>{clearJob(job.Id)}}>
                             <DoNotDisturbAltIcon /> </IconButton>
                             :<IconButton edge="end" aria-label="delete" className="hover:text-red-600" onClick={()=>{stopJobs(job.Id)}}>
                                <StopCircleIcon/>
                                </IconButton> }
                    </Tooltip>
                    }
                >
                    <ListItemAvatar>
                    <Avatar>
                        <WorkIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary={job?.Name && job.Name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Status: {((job.Status == "Running") && (job.inst_Status.IsCompleted)) ? "Completed" : job.Status}
                        </Typography><br/>
                        <p><b>{job?.Source && job.Source}</b> to <b>{job?.Destination && job.Destination}</b></p>
                        <p>Machines : {Array.isArray(job.Machines) ? job.Machines.join(", ") : job?.Machines}</p>
                        <p>{job.LiveUpdates.map((update)=>(
                          <Tooltip title={update.Reason} arrow>
                        <span style={{color:update.Status=="Success" ? "green" : "red"}}>
                          {update.Machine}, </span>
                          </Tooltip>))}</p>
                      </React.Fragment>
                    }
                     />
                </ListItem>
                <Divider variant="inset" component="li" />
                </>))}
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
