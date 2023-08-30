import { IconButton, Input, LinearProgress, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState, useEffect} from 'react';
import { FixedSizeList } from 'react-window';

import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StopIcon from '@mui/icons-material/Stop';
import WebhookIcon from '@mui/icons-material/Webhook';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function Services(props) {
    const [search, setSearch] = useState("")
    
    const ServicesArray = props.Service && props.Service.filter((service) => {
        //returns matching services
        return service.DisplayName.toLowerCase().includes(search.toLowerCase());
      });

    useEffect(() => {
        if (!props.Service){
            props.servicesQuery();
        }
     }, []);

    const ItemRenderer = (Service) => ({ index, style}) => {
        var Status = Service[index].Status
        return(
        <ListItem key={index} style={style} className="hover:bg-[#eee]">
            <ListItemIcon>
                <WebhookIcon color={(Status == "Stopped")? "Secondary" : "primary"}/>
            </ListItemIcon>
            <ListItemText 
                primary={Service[index].DisplayName} 
                secondary={Status} />
            <IconButton disabled={(Status=="Running")}>
                <PlayArrowIcon className="hover:text-[#40e980]"/>
            </IconButton>
            <IconButton disabled={(Status=="Stopped")}>
                <StopIcon className="hover:text-[#e94080]"/>
            </IconButton>
            <IconButton>
                <RestartAltIcon className="hover:text-[#4080e9]"/>
            </IconButton>
        </ListItem>
        )
    }

    return ( 
        <div>
            <Input placeholder='Search' onChange={(e)=>{setSearch(e.target.value)}} value={search} />

            {ServicesArray && <FixedSizeList
                height={400}
                itemCount={ServicesArray.length}
                itemSize={50}
                fullwidth
                style={{overflowX:"hidden"}}
                >
                {ItemRenderer(ServicesArray)}
            </FixedSizeList>}
            {props.Error &&  <Error error={props.Error}/> }
        </div>
     );
}

export default Services;