import { Input } from '@mui/material';
import React, { useState } from 'react';

function Temp() {
    const[temp_data,setTemp_data]=useState("Santhosh")

    function change(){
       setTemp_data("shalom" )
    }
    return ( 
        <div>
            <Input onChange={(e)=>setTemp_data(e.target.value)} value={temp_data}/>
            <p onClick={change}>{temp_data}</p>
            <p onClick={change}>{temp_data}</p>
            <p onClick={change}>{temp_data}</p>
            <p onClick={change}>{temp_data}</p>
            <p onClick={change}>{temp_data}</p>
        </div>
     );
}

export default Temp;