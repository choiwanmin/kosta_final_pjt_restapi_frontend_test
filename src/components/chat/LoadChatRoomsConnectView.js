import { useState } from "react";


export default function LoadChatRoomsConnect(){
    const[inputs, setInputs] = useState({});
    
    const token = sessionStorage.getItem('token');
    const loginId = sessionStorage.getItem('loginId');

    return(
        <div>
            
        </div>
    )
}