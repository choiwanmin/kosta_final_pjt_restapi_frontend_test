import "./record.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { workin, workout,myoff } from "./function/emp";
import { useDispatch, useSelector } from "react-redux";
import { changeFlag,changeOut,importNum,getMem,changeRes,changeDay1,changeDay2 } from "../../store.js";


export default function MyRecord(){
    let time = new Date();
    let dispatch = useDispatch();
    const [recordDate, setRecordDate] = useState("");
    const [year,setYear] = useState(time.getFullYear());
    const [currentMonth, setCurrentMonth] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [state, setState] = useState("근무시간입니다.");
    const [month,setMonth] = useState(time.getMonth());
    const member = sessionStorage.getItem("loginId");
    const token = sessionStorage.getItem("token");
    // 기록 조회용
    let flag =  useSelector((state)=>state.recordFlag);
    let out =  useSelector((state)=>state.recordOut);
    let num = useSelector((state)=>state.recordNum);
    const [list,setList] = useState([]);
    const [dateNum, setDateNum] = useState(0);

    // 휴가 데이터
    let off = useSelector((state)=>state.dayoff);

   useEffect(()=>{
    //일자 확인용
     const day = ('0' + time.getDate()).slice(-2);
     const nowMonth = ('0' + (time.getMonth() + 1)).slice(-2);
     const dateString = year + '.' + nowMonth + '.' + day + "일 ";
     const hours = ('0' + time.getHours()).slice(-2);
     const minutes = ('0' + time.getMinutes()).slice(-2);
     const timeString = hours + ':' + minutes;
     
     setRecordDate(dateString);
     stateUpdate(hours);
     setCurrentTime(timeString);
     setCurrentMonth(year + "." + month);
     
     const timer = setInterval(()=>{
        time = new Date();
        const hours = ('0' + time.getHours()).slice(-2);
        const minutes = ('0' + time.getMinutes()).slice(-2);
        const timeString = hours + ':' + minutes;
        stateUpdate(hours);
        setCurrentTime(timeString);
     },10000)

     //유저 확인용
     dispatch(getMem(member));
     axios.get(`${process.env.REACT_APP_SERVER}/auth/record/my`,{headers:{auth_token:token}})
     .then((res)=>{
        if(res.status === 200 && res.data.list != null){
            console.log(res.data)
            setList(res.data.list);
            dispatch(importNum(res.data.num));
            if(res.data.flag){
                dispatch(changeFlag())
            }
            if(res.data.out){
                dispatch(changeOut())
            }
        }
     })
    },[])

    const stateUpdate=(time)=>{
        if(time <= 9){
            setState('근무시간 전입니다.');
        }else if (time >= 12 && time <= 13) {
            setState('점심시간입니다.');
        }else if (time>=18) {
            setState('근무종료 시간입니다.');
        }else{
            setState('근무시간입니다.');
        }
    }

    // 유저 버튼 상호 작용
    const recordIn = () => {
        workin(member, dispatch);
    };
    const outRecord = () => {
        workout(member,num.num, dispatch);
    };
    // 휴가신청
    const res = (e)=>{
        dispatch(changeRes(e.target.value))
    }
    const date1 = (e)=>{
        dispatch(changeDay1(e.target.value))
    }
    const date2= (e)=>{
        dispatch(changeDay2(e.target.value))
    }
    const offSubmit=()=>{
        myoff(off)
    }
    const arrow = (num)=>{
        setDateNum(dateNum + num );
        setMonth(month + num);
    }

    useEffect(() => {
        if(month<1){
            setMonth(12);
            setYear(year-1);
        }else if(month>12){
            setMonth(1);
            setYear(year+1);
        }
        setCurrentMonth(year + "." + month);
        axios.get(`${process.env.REACT_APP_SERVER}/getmonth`,{
            params: {
                Members:member,
                count:dateNum
            }
        })
        .then((res)=>{
            if(res.status === 200 && res.data.list != null){
                setList(res.data.list);
            }
        })
    }, [dateNum,month]);

    return(
        <div className="main_body">
            <div className="record_top">
                <div className="record_top_wrapper">
                    <div className="record_msg">
                        <p className="font_b24 m_b2">{state}</p>
                        <p className="font_b24">{recordDate} {currentTime}</p>
                        <button className="btn_border round w_bg record_sta font_b24">{flag ? "출근완료" : "출근 전"}</button>
                    </div>
                    <div className="record_btn_wrapper">
                        {flag ? 
                        <button className="btn_square gray_btn font_b24 cursor record_marright">출근하기</button>:
                        <button onClick={recordIn} className="btn_square blue_btn font_b24 cursor record_marright">출근하기</button>}
                        
                        {flag && !out ? 
                         <button 
                         onClick={outRecord} 
                         className="btn_square blue_btn font_b24 cursor record_marright">퇴근하기</button>:
                         <button className="btn_square gray_btn font_b24 cursor record_marright">퇴근하기</button>}
                        <button className="btn_square border_btn font_b24 cursor"  data-bs-toggle="modal" data-bs-target="#exampleModal">휴가신청</button>
                    </div>
                </div>
            </div>
            {/* <!-- 기록 테이블 -->  */}
            <div className="record_table w_bg">
                <div className="record_table_title">
                    <p>근무기록 확인</p>
                    <div className="record_month font_b24">
                        {
                            dateNum <= -3 ? 
                            <div className="arrow left_arrow cursor arrow_off"></div>:
                            <div className="arrow left_arrow cursor" onClick={()=>arrow(-1)}></div>
                        }
                        
                        <span className="month">{currentMonth}</span>
                        {
                            dateNum >= 0 ? 
                            <div className="arrow right_arrow cursor arrow_off"></div>:
                            <div id="record_right" className="arrow right_arrow" onClick={()=>arrow(1)}></div>
                        }
                        
                        
                    </div>
                </div>
                <div className="record_table_wrapper">
                    <table className="record_rtable">
                        <thead>
                            <tr>
                                <th>일자</th>
                                <th>요일</th>
                                <th>근무시간</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody className="record_list">
                            {list.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.day}</td>
                                    <td>{item.dayOfWeek}</td>
                                    <td>{item.workHours}</td>
                                    <td>{item.state}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">휴가 신청</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    <form id="offform">
                        <table>
                            <tr>
                                <td  className="form_td">휴가 종류</td>
                                <td className="form_td"> 
                                    <select name="res" onChange={res}>
                                        <option value="대체휴무">대체휴무</option>
                                        <option value="연차">연차휴가</option>
                                        <option value="월차">월차</option>
                                        <option value="휴무">휴무</option>
                                        <option value="휴가">시즌 휴가</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="form_td">휴가 시작일</td>
                                <td className="form_td"> 
                                    <input type="date" name="date1" onChange={date1} />
                                </td>
                            </tr>
                            <tr>
                                <td className="form_td">휴가 종료일</td>
                                <td className="form_td"> 
                                    <input type="date" name="date2" onChange={date2} />
                                </td>
                            </tr>
                        </table>
                            <div className="modal-footer">
                                <button type="button" className="btn blue_btn" onClick={offSubmit}>제출하기</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}
