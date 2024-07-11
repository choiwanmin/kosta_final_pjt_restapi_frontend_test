import { useEffect, useState } from "react";
import "./charts.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ChartModal from "./ChartModal";

export default function Chartmain() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('loginId');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/chart/list`, {
          params: { userid: username },
          headers: {
            'auth_token': token
          }
        });
        setTasks(response.data);
        console.log(response.data);
        console.log('data check');
      } catch (error) {
        console.log("Error fetching tasks: " + error);
      }
    };

    fetchTasks();
  }, [username, token]); // Added dependencies

  // 모달창 초기화
  const taskidinit = () => {
    // Initialize modal related states if needed
  };

  // 간트 체크박스
  const handleCheckboxChange = async (taskid) => {
    try {
      // Make an API call to update the task status
      const response = await axios.post('/auth/chart/updateStatus', { taskid });
      // Optionally update the task status in the state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.taskid === taskid ? { ...task, chartStatus: response.data.chartStatus } : task
        )
      );
    } catch (error) {
      console.log("Error updating task status: " + error);
    }
  };

  return (
    <div className="main_body">
      <div className="chart_head" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', verticalAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b>{username}</b>
          <b> 님 반갑습니다.</b>
        </div>
      </div>
      <div className="chart_body">
        <div className="chart_area">
          <div className="chart_area_head">
            <div style={{ paddingTop: '5px' }}>
              <p className="board_title" style={{ marginBottom: '20px' }}>일정 관리</p>
            </div>
            <div className="chart_menu">
              <button type="button" onClick={() => window.location.href = '/auth/chart/gantt'}>간트차트</button>
              <button type="button" onClick={() => window.location.href = '/auth/chart/calendar'}>달력</button>
              <button type="button" data-bs-toggle="modal" data-bs-target="#chartModal" onClick={()=> setSelectedTaskId(null)}>
                일정추가
              </button>
            </div>
          </div>
          <div className="chart_area_scroll">
            <table>
              <thead>
                <tr>
                  <th>분류</th>
                  <th style={{ width: '400px' }}>이름</th>
                  <th>시작일</th>
                  <th>마감일</th>
                  <th>완성률</th>
                  <th>간트</th>
                  <th>공유</th>
                  <th>수정</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr><td colSpan="9">No tasks available</td></tr>
                ) : (
                  tasks.map(task => (
                    <tr key={task.taskid}>
                      <td style={{ display: 'none' }}>{task.taskid}</td>
                      <td>{task.chartResource}</td>
                      <td style={{ width: '400px' }}>{task.title}</td>
                      <td>{task.st}</td>
                      <td>{task.ed}</td>
                      <td>{task.taskid !== 0 && <p>{task.percent}</p>}</td>
                      <td>{task.taskid !== 0 && (
                        <input
                          type="checkbox"
                          checked={task.chartStatus === 'yes'}
                          onChange={() => handleCheckboxChange(task.taskid)}
                          className="chart_edit_btn"
                        />
                      )}</td>
                      {/* 공유 버튼 */}
                      <td>{task.taskid !== 0 && (
                        <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="taskidshare" onClick={()=> setSelectedTaskId(task.taskid)}>
                          <i className="fa-solid fa-share-nodes"></i>
                        </button>
                      )}</td>
                      <td>{task.taskid !== 0 && (
                        <button type="button" data-bs-toggle="modal" data-bs-target="#chartModal" className="taskidset">
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      )}</td>
                      <td>{task.taskid !== 0 && (
                        <a href={`/auth/chart/del?id=${task.taskid}`}><i className="fa-solid fa-eraser"></i></a>
                      )}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <ChartModal taskid={selectedTaskId}></ChartModal>
          </div>
        </div>
      </div>
    </div>
  );
}
