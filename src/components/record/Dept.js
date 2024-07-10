import { useEffect, useState } from "react";
import "./record.css";
import axios from "axios";
import RecordTable from "./RecordTable";

export default function Dept(){
    const [preRecord, setPreRecord] = useState([]);
    const [memberRecord, setMemberRecord] = useState([]);
    let deptNum =sessionStorage.getItem("mgr_deptid");
    let token = sessionStorage.getItem("token");

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_SERVER}/auth/record/dept`,
        {   params:{dept:deptNum},
            headers:{auth_token:token}},
        )
     .then((res)=>{
        if(res.status === 200){
            setPreRecord(res.data.record);
            console.log(res.data)
            setMemberRecord(res.data.list);
        }
     })
    },[])

    return(
        <div class="main_body">
            <div class="record_dept_wrapper">
                <div class="title">
                    <span>이전 달 근무 통계</span>
                </div>
                    <ul class="record_box_wrapper">
                    <li class="record_data w_bg">
                        <img class="record_icon" 
                        src={process.env.PUBLIC_URL + '/img/timer.png'}/>
                        <div class="record_text_wrapper">
                            <p class="record_text_title">월 평균 근무 시간</p>
                            <p class="record_text_content">{preRecord.workAvgTime}</p>
                        </div>
                    </li>
                    <li class="record_data w_bg">
                        <img class="record_icon" src={process.env.PUBLIC_URL + '/img/timer.png'}/>
                        <div class="record_text_wrapper">
                            <p class="record_text_title">평균 잔업 시간</p>
                            <p class="record_text_content">{preRecord.overAvgTime}</p>
                        </div>
                    </li>
                    <li class="record_data w_bg">
                        <img class="record_icon" src={process.env.PUBLIC_URL + '/img/timer.png'}/>
                        <div class="record_text_wrapper">
                            <p class="record_text_title">지각자</p>
                            {preRecord && preRecord.danmem && preRecord.latemem.map((item, i) => (
                                <p class="record_text_content" key={i}>{item}</p>
                            ))}
                        </div>
                    </li>
                    <li class="record_data w_bg">
                        <img class="record_icon" src={process.env.PUBLIC_URL + '/img/timer.png'}/>
                        <div class="record_text_wrapper">
                           <p class="record_text_title">지각 주의자</p>
                           {preRecord && preRecord.danmem && preRecord.danmem.map((item, i) => (
                                <p class="record_text_content" key={i}>{item}</p>
                            ))}
                        </div>
                    </li>
                </ul>        
            </div>
            <RecordTable dept={deptNum} list={memberRecord}></RecordTable>
        </div>

    )
}