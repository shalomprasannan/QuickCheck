import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Card, CardContent, Typography } from '@mui/material';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';

export default function Error(props) {
return(
        <Card className='h-full w-full'>
                <ReportProblemRoundedIcon sx={{width:"70%",height:"70%"}} color="disabled"/>
                <Typography variant="h5"> {props.error} </Typography>
        </Card>)
}