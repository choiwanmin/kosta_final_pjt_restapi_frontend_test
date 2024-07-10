import { useEffect, useState } from "react";
import axios from "axios";



export default function RecordTable(props){
    let time = new Date();
    const [recordDate, setRecordDate] = useState(props.list);
    const [year,setYear] = useState(time.getFullYear());
    const [month,setMonth] = useState(time.getMonth());
    const [dateNum, setDateNum] = useState(0);

    const arrow = (num)=>{
        setDateNum(dateNum + num );
        setMonth(month + num);
    }
    useEffect(()=>{
        if(month<1){
            setMonth(12);
            setYear(year-1);
        }else if(month>12){
            setMonth(1);
            setYear(year+1);
        }
        axios.get(`${process.env.REACT_APP_SERVER}/record/list`,
        {   params:{
            dept:props.dept,
            cnt:dateNum}},
        )
     .then((res)=>{
        if(res.status === 200){
            setRecordDate(res.data);
        }
     })
    },[arrow])



    return(
            <div class="record_table w_bg">
            <div class="record_table_title">
                <p>부서원 상세 근무기록</p>
                <div class="record_month font_b24">
                    {
                        dateNum <= -3 ? 
                        <div className="arrow left_arrow cursor arrow_off"></div>:
                        <div className="arrow left_arrow cursor" onClick={()=>arrow(-1)}></div>
                    }
                    <span class="month">{year}.{month}</span>
                    {
                        dateNum >= 0 ? 
                        <div className="arrow right_arrow cursor arrow_off"></div>:
                        <div id="record_right" className="arrow right_arrow" onClick={()=>arrow(1)}></div>
                    }
                </div>
            </div>
            <div class="record_table_wrapper">
                <table class="record_rtable">
                    <thead>
                        <td>이름</td>
                        <td>부서</td>
                        <td>직급</td>
                        <td>근무일</td>
                        <td>지각 횟수</td>
                        <td>총 근무시간</td>
                        <td>잔업 시간</td>
                    </thead>
                    <tbody class="record_list dept_record_list">
                        {recordDate.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.deptNum}</td>
                                <td>{item.joblv}</td>
                                <td>{item.totalRecords}</td>
                                <td>{item.lateCount}</td>
                                <td>{item.workTime}</td>
                                <td>{item.overWork}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}