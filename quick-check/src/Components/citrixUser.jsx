import { Card, Grid, IconButton, Typography as P, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { Component } from 'react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BadgeIcon from '@mui/icons-material/Badge';

function CitrixUser() {
    return ( 
        <Grid container sx={{justifyContent:"center",alignItems:"center"}} direction={"column"} gap={4}>
                <Grid item xs={4}>
                    <Card sx={{textAlign:"left",p:"1rem"}}>
                    <Grid container>
                        <Grid item xs={8}>
                        <P variant="h6">Username : in_shalomp</P>
                        <P variant="subtitle1">Full Name : Shalom Rupan P</P>
                        <P>Account : Not Locked</P>
                        <P>Sessions : 3</P>
                        </Grid>
                        <Grid item xs={4}>
                        <BadgeIcon sx={{height:"80%",width:"80%"}}/>
                        </Grid>
                    </Grid>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <Table>
                            <TableHead sx={{backgroundColor:"#eee"}}>
                                <TableRow>
                                    <TableCell>Machine</TableCell>
                                    <TableCell>Application</TableCell>
                                    <TableCell>Reset Profile</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>XAVDA05</TableCell>
                                    <TableCell>Outlook CS -2016</TableCell>
                                    <TableCell sx={{textAlign:"center"}}><IconButton><ManageAccountsIcon/></IconButton></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>XAVDA05</TableCell>
                                    <TableCell>Outlook CS -2016</TableCell>
                                    <TableCell sx={{textAlign:"center"}}><IconButton><ManageAccountsIcon/></IconButton></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>XAVDA05</TableCell>
                                    <TableCell>Outlook CS -2016</TableCell>
                                    <TableCell sx={{textAlign:"center"}}><IconButton><ManageAccountsIcon/></IconButton></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </Grid>
            </Grid>
     );
}

export default CitrixUser;