import "./record.css";

export default function RecordAdmin(){
    let token = sessionStorage.getItem("token");

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
    const [overWork, setoverWork] = useState([
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
        ["Copper", 8.94, "#b87333", null],
        ["Silver", 10.49, "silver", null],
        ["Gold", 19.3, "gold", null],
        ["Platinum", 21.45, "color: #e5e4e2", null],
      ]);

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
        ["Copper", 8.94, "#b87333", null],
        ["Silver", 10.49, "silver", null],
        ["Gold", 19.3, "gold", null],
        ["Platinum", 21.45, "color: #e5e4e2", null],
      ];
    const options = {
        title: "전 달 초과근무 통계",
        width: 700,
        height: 400,
        bar: { groupWidth: "50%" },

      };


    useEffect(()=>{
        let maxmonth = 0;
        axios.get(`${process.env.REACT_APP_SERVER}/auth/record/admin`,
            { headers:{auth_token:token}},
            )
         .then((res)=>{
            if(res.status === 200){
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
                console.log(res.data)
            }
         })
    },[])
  
//   $(document).ready(function(){
//     $.ajax({
//         url: "/auth/record/over",
//         type:"get",   
//             dataType:'json',
//         success: function(res){
//            less30 = res.overAvgTime[0].less30;
//            less1 = res.overAvgTime[0].less1hour;
//            less2 = res.overAvgTime[0].less2hours;
//            over2 = res.overAvgTime[0].over2hours;
//         },
//         error:function(){			//응답 에러일때
//           console.log('error');
//         }
//     });
//     $.ajax({
//       url: "/auth/record/deptlist",
//       type:"get",   
//       dataType:'json',
//       success: function(res){
//         for(let dept of res.deptlist){
//            var option = $(`<option value="${dept.deptid}">${dept.deptnm}</option>`);
//           $('#dept_list').append(option);  
//         }
//       },
//       error:function(){			//응답 에러일때
//         console.log('error');
//       }
//   });
//   });
  
  // 사내 전체 추가 근무 통계
//   function drawOverChart() {
//       // Create the data table for Anthony's pizza.
//       var data = new google.visualization.DataTable();
//       data.addColumn('string', '횟수');
//       data.addColumn('number', '번');
//       data.addRows([
//         ['30분 미만', less30],
//         ['30분 이상 1시간 미만', less1],
//         ['1시간 이상 2시간 미만', less2],
//         ['2시간 초과', over2]
//       ]);
  
//       // Set options for Anthony's pie chart.
//       var options = { width:700,
//                      height:400};
  
//       // Instantiate and draw the chart for Anthony's pizza.
//       var chart = new google.visualization.BarChart(document.getElementById('over_chart_div'));
//       chart.draw(data, options);
//     }
  
  
//       data.addColumn('string', 'Month');
//       for(let dept in chartObj){
//         if(months.length<chartObj[dept].length){
//           for(let a = 0 ; a<chartObj[dept].length;a++){
//             months.push(chartObj[dept][a].month)
//           }
//         }
//         data.addColumn('number', dept);
//       }
  
//     months.forEach(function(month) {
//       let rowData = [month];
//         // 각 부서에 대한 데이터 추가
//         for (let dept in chartObj) {
//             var workhours = 0; 
//             // 해당 월의 데이터가 있으면 값 추가
//             var deptData = chartObj[dept];
//             for (var i = 0; i < deptData.length; i++) {
//                 if (deptData[i].month === month) {
//                     workhours = deptData[i].workhours;
//                     break;
//                 }
//             }
//             rowData.push(workhours); // 해당 부서의 월별 근무 시간을 배열에 추가
//         }
//             data.addRow(rowData);
//         });
  
//       var materialOptions = {
//         width: 700,
//         height: 400,
//         // colors: ['#a4d4ff', '#dc3912', '#ff9900'],
//       };
//     }
  
  
    
//   //부서 근태 조회(관리자용)
//   function dept_admin(num){
//       let dept = $("select[name=dept] option:selected").val();
//       arrow_btn(num)
//         $.ajax({
//             url:"/auth/record/list",  //서버주소
//             type:"get",   				//전송방식
//             dataType:'json',			//응답데이터 형태
//             data:{dept:dept,cnt:cnt},
//             success:function(res){		//응답 정상일때
//           deptTable_draw(res)
//             },
//             error:function(){			//응답 에러일때
//                 console.log('error');
//             }
//         });
//     }

    return(
        <div class="main_body">
            {/* <!-- 차트 테이블 --> */}
            <div class="chart_wrapper">
            <div class="chart">
                <p class="chart_title">부서 근무 시간 평균 통계</p>
                <div class="chart_can" id="chart_div"></div>
            </div>
            <div class="chart">
                <p class="chart_title">이전 달 초과근무 통계</p>
                <div class="chart_can" id="over_chart_div"></div>
            </div>
            </div>
        
            <div class="dept_select_wrapper">
            <div class="dept_text">부서 선택하기</div>
            <select id="dept_list" name="dept" onchange="dept_admin(0)"> </select>
            </div>
            {/* <!-- 부서별 조회 테이블 --> */}
            <div class="record_table w_bg">
            <div class="record_table_title dept_table">
                <div class="record_month font_b24">
                    <div id="record_left" class="arrow left_arrow cursor" onclick="dept_admin(-1)"></div>
                    <span class="month">2022.07</span>
                    <div id="record_right" class="arrow right_arrow arrow_off" onclick="dept_admin(+1)"></div>
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
                        <tr></tr>  
                    </tbody>
                </table>
            </div>
         </div>
        </div>
    )
}