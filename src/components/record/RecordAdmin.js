import "./record.css";

export default function RecordAdmin(){
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