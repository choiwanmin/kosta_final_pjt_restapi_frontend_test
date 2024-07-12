import { useEffect, useState } from "react";
import React from "react";
import "./record.css";
import RecordTable from "./RecordTable";
import { Chart } from "react-google-charts";
import axios from "axios";


export default function RecordAdmin(){
    let token = sessionStorage.getItem("token");
    const [depts, setDepts] = useState([]);
    const [deptnum, setDeptNum] = useState(0);

    // chart var
    const [deptWorkdata, setDeptwork] = useState(["부서"],[]);
    const dataArr = [["Month"]];
    const daptOptions = {
      titleTextStyle: {
        fontSize: 24
      },
      title: '월'
    }

    // overwork bar data
    const [overWork, setoverWork] = useState([]);
    const data = [
        [
          "Element",
          "Time",
          { role: "style" },
          {
            sourceColumn: 0,
            role: "annotation",
            type: "string",
            calc: "stringify",
          },
        ],
        ["30분 미만", 5, "#6a98dc", null],
        ["1시간 미만", 10.49, "#98dedb", null],
        ["2시간 미만", 19.3, "#d16b6b", null],
        ["2시간 초과", 21.45, "#c80000", null],
    ];
    const options = {
        title: "전 달 초과근무 통계",
        width: 700,
        height: 400,
        bar: { groupWidth: "50%" },

      };

      const deptSelect = (e)=>{
        setDeptNum(e.target.value)
      }
    useEffect(()=>{
        let maxmonth = 0;
        axios.get(`${process.env.REACT_APP_SERVER}/auth/record/admin`,
            { headers:{auth_token:token}},
            )
         .then((res)=>{
            if(res.status === 200){
              console.log(res.data)
                for(let a in res.data){
                    dataArr[0].push(a)
                    // console.log(res.data[a])
                    for(let month of res.data[a]){
                        const monthNumber = parseInt(month.month, 10);
                        if(monthNumber>maxmonth){
                            maxmonth = monthNumber
                        }
                    }
                }
                for (let i = 1; i <= maxmonth; i++) {
                    let row = [`${i}월`];

                    Object.keys(res.data).forEach((key) => {
                      let found = false;
                      if (res.data[key]) {
                        res.data[key].forEach((work) => {
                          if (parseInt(work.month, 10) === i) {
                            row.push(work.workhours);
                            found = true;
                          }
                        });
                      }
                      if (!found) {
                        row.push(0);
                      }
                    });
                    dataArr.push(row);
                }
                setDeptwork(dataArr)
            }
         });
         //overWork avg chart
         axios.get(`${process.env.REACT_APP_SERVER}/over`,{})
         .then((res)=>{
            if(res.status === 200){
                data[1][1]=res.data.overAvgTime[0].less30
                data[2][1]=res.data.overAvgTime[0].less1hour
                data[3][1]=res.data.overAvgTime[0].less2hours
                data[4][1]=res.data.overAvgTime[0].over2hours
                setoverWork(data);
            }
         })
         axios.get(`${process.env.REACT_APP_SERVER}/deptlist`,{})
         .then((res)=>{
            if(res.status === 200){
               setDepts(res.data.deptlist);
               console.log(res.data  )
            }
         })
    },[])

      return(
        <div class="main_body">
            {/* <!-- 차트 테이블 --> */}
            <div class="chart_wrapper">
            <div class="chart">
            <p class="chart_title">부서 근무 시간 평균 통계</p>
                <Chart 
                    chartType="Line"
                    width="700px"
                    height="400px"
                    data={deptWorkdata}
                    options={daptOptions}
                />
            </div>
            <div class="chart">
                <p class="chart_title">이전 달 초과근무 통계</p>
                <Chart
                chartType="BarChart"
                data={overWork}
                options={options}
                />
            </div>
            </div>
            <div class="dept_select_wrapper">
            <div class="dept_text">부서 선택하기</div>
            <select name="dept" onChange={deptSelect}>
              <option>부서 선택</option>
              {depts.map((dept, i) => (
                <option value={dept.deptid}>{dept.deptnm}</option>
              ))}
            </select>
            </div>
            {/* <!-- 부서별 조회 테이블 --> */}
            <RecordTable  dept={deptnum} list={[]}></RecordTable>     

        </div>
    )
}