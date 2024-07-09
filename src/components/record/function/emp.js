import axios from "axios";
import { changeFlag,changeOut,importNum } from "../../../store.js";

// 출근 버튼
const workin=(mem,dispatch)=>{
    axios.post(`${process.env.REACT_APP_SERVER}/record/in`,{},{
        params: {
            Members: mem
        }
    })
    .then((res)=>{
        if(res.status === 200){
            dispatch(changeFlag());
            dispatch(importNum(res.data.num));
        }
    })
    .catch((error) => {
        console.error('Error during workin:', error);
    });
}

// //퇴근 버튼 클릭
const workout=(mem,num,dispatch)=>{
    axios.post(`${process.env.REACT_APP_SERVER}/out`,{},{
        params: {
            Members: mem,
            memberid:num
        }
    })
    .then((res)=>{
        if(res.status === 200){
            dispatch(changeOut())
        }
    })
    .catch((error) => {
        console.error('Error during workin:', error);
    });
}

// 휴가 기록하기
const myoff=(data)=>{
    axios.post(`${process.env.REACT_APP_SERVER}/offday`,{},{
        params: {
            members: data.members,
            res: data.res,
            date1:data.date1, 
            date2:data.date2
        }
    })
    .then((res)=>{
        if(res.status === 200){
            document.querySelectorAll('.btn-close')[0].click();
        }
    })
    .catch((error) => {
        console.error('Error during off:', error);
    });
}

export {workin,workout,myoff}