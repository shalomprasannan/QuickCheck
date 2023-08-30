import { useState } from "react";
import NavBar from "../Components/NavBar";
import VmGetSnap from "../Components/VmGetSnap";
import VmTakeSnap from "../Components/vmTakeSnap";

const Vm = () => {
    const [showBool,setShowBool]=useState(true)
    return ( 
        <NavBar title={"SnapShots"} setShowBool={setShowBool}>
            {showBool? <VmTakeSnap/> :<VmGetSnap/>}
        </NavBar>
     );
}
 
export default Vm;