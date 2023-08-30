import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { blue, pink, purple } from '@mui/material/colors';
import { ButtonGroup, Grid } from '@mui/material';

function NavBar(props) {
    return (
      <Grid direction="column" className="h-full">
        <Grid item xs>
      <AppBar position="static">
        <Toolbar >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.title}
          </Typography>
          <ButtonGroup color='inherit'>
            <Button onClick={()=>{props.setShowBool(true)}}>Take New</Button>
            <Button onClick={()=>{props.setShowBool(false)}}>Delete</Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
      </Grid>
      <Grid item xs sx={{height:"calc(100% - 4rem)"}}>
      {props.children}
    </Grid>
    </Grid>
     );
}

export default NavBar;
