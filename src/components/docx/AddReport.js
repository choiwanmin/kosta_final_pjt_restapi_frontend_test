import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../../store";
// import "./modal.css"; // modal.css 파일 import
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddReport() {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(""); //제목 입력
    const [writer, setWriter] = useState("");
    const [enddt, setEndDt] = useState("");
    const [note, setNote] = useState(""); // 휴가 신청서에서 taskplan을 note로 변경
    const [taskplan, setTaskPlan] = useState("");
    const [taskprocs, setTaskProcs] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [userArr, setUserArr] = useState([]); //검색된 멤버 리스트
    const userList = useSelector((state) => state.modalArr);
    const [searchName, setSearchName] = useState("");
    const [searchType, setSearchType] = useState(1);
    const [currentUser, setCurrentUser] = useState(""); // 현재 사용자 ID
    const [formType, setFormType] = useState("보고서");
    const navigate = useNavigate();

    // useEffect를 사용하여 컴포넌트가 마운트될 때 현재 사용자 정보를 가져오도록 설정
    useEffect(() => {
        const loginId = sessionStorage.getItem("loginId");
        setCurrentUser(loginId);
    }, []);

    const handleCheckboxChange = (userId) => {
        setSelectedMembers((prevSelectedMembers) =>
            prevSelectedMembers.includes(userId)
            ? prevSelectedMembers.filter((id) => id !== userId)
            : [...prevSelectedMembers, userId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //폼 데이터 백단 전송
        const formData = new FormData();
        //axios 요청
        const token = sessionStorage.getItem('token');
        const loginId = sessionStorage.getItem('loginId');
        formData.append('title', title);
        formData.append('writer', loginId);
        formData.append('enddt', enddt);
        formData.append('taskplan', taskplan);
        formData.append('taskprocs', taskprocs);
        formData.append('senior', selectedMembers.join(',')); // Ensure 'senior' is correctly appended
        formData.append('status', 1);
        formData.append('formtype', formType);
        axios.post(`${process.env.REACT_APP_SERVER}/auth/docx/addreport` , formData, {
            headers: {
                auth_token: token
            },
        })
        .then(response =>{
            console.log(response)
            if(response.status === 200 && response.data){
                if(response.data) {
                    console.log("통과")
                    navigate('/docxlist')
                }
            }
        })
        .catch(error => {
            console.error("Error submit form : " , error);
            alert("해당 글을 등록하는데 실패 했습니다.");
        });
    };

    const handleVacationSubmit = (e) => {
        e.preventDefault();
        //폼 데이터 백단 전송
        //axios 요청
        const formData = new FormData(e.target);
        // formData.append('formtype', '휴가 신청서');
        const token = sessionStorage.getItem('token');
        const loginId = sessionStorage.getItem('loginId');
        formData.append('title', title);
        formData.append('writer', loginId);
        formData.append('enddt', enddt);
        formData.append('note', note);
        formData.append('senior', selectedMembers.join(',')); // Ensure 'senior' is correctly appended
        formData.append('status', 1);
        // formData.append('formtype', formType);
        axios.post(`${process.env.REACT_APP_SERVER}/auth/docx/addvacation`, formData, {
            headers: {
                auth_token: token
            },
        })
            .then(response => {
                console.log(response)
                if(response.status === 200 && response.data){
                    if(response.data) return navigate('/docxlist')
                }
            })
            .catch(error => {
                console.error('Error submit vacation form : ', error);
                alert('휴가 신청서를 등록하는데 실패했습니다.');
            });
    };

    const searchMembers = () => {
        axios.get(`${process.env.REACT_APP_SERVER}/member/getdeptby`, {
            params: {
                val: searchName,
                type: searchType,
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    setUserArr(res.data.mlist);
                    console.log(res.data.mlist)
                } else {
                    alert("멤버 검색 error");
                }
            })
            .catch((err) => {
                console.error("Error fetching members : ", err);
                alert("Error fetching members");
            });
    };

    return (
        <div className="main_body">
            <div className="record_table w_bg">
                <div className="row">
                    <div className="col-12">
                        <h3 className="font_b24 m_b2">문서 작성폼</h3>
                        {/* Tab 링크들 */}
                        <div className="tab">
                        <button
                                className={`tablinks btn btn-outline-primary ${formType === '보고서' ? 'active' : ''}`}
                                onClick={() => setFormType('보고서')}
                            >
                                보고서
                            </button>
                            <button
                                className={`tablinks btn btn-outline-primary ${formType === '휴가 신청서' ? 'active' : ''}`}
                                onClick={() => setFormType('휴가 신청서')}
                            >
                                휴가 신청서
                            </button>
                        </div>
                    </div>
                </div>

                {/* 보고서 작성 양식 */}
                <div className="tabcontent">
                {formType === '보고서' && (
                    <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            작성글 제목
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="writer" className="form-label">
                            작성자
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="writer"
                            value={currentUser} //현재 로그인 유저 
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="enddt" className="form-label">
                            기한
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="enddt"
                            value={enddt}
                            onChange={(e) => setEndDt(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="taskplan" className="form-label">
                            업무 계획
                        </label>
                        <textarea
                            className="form-control"
                            id="taskplan"
                            rows="4"
                            value={taskplan}
                            onChange={(e) => setTaskPlan(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="taskprocs" className="form-label">
                            업무 진행 과정
                        </label>
                        <textarea
                            className="form-control"
                            id="taskprocs"
                            rows="4"
                            value={taskprocs}
                            onChange={(e) => setTaskProcs(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="senior" className="form-label">
                            결제 권한
                        </label>
                        <select className="form-select" multiple>
                            {selectedMembers.map((userId) => (
                                <option key={userId} value={userId}>
                                    {userId}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="taskidshare"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                        >
                            <i className="fa-solid fa-user-plus"></i>
                        </button>
                    </div>
                    <select
                        style={{ display: "none" }}
                        name="status"
                        // onFocus={(e) => (e.target.initialSelect = e.target.selectedIndex)}
                        // onChange={(e) => (e.target.selectedIndex = e.target.initialSelect)}
                        readOnly
                    >
                        <option value="1" selected>
                            미승인
                        </option>
                        <option value="2">승인</option>
                        <option value="3">보류</option>
                    </select>
                    <input type="hidden" name="formtype" value="보고서" />
                    <button type="submit" className="btn btn-primary">
                        등록
                    </button>
                </form>
                )}

                {formType === '휴가 신청서' && (
                        <form onSubmit={handleVacationSubmit}>
                            {/* 휴가 신청서 폼 */}
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    작성글 제목
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="writer" className="form-label">
                                    작성자
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="writer"
                                    name="writer"
                                    readOnly // 현재 로그인한 사용자의 ID로 설정되어야 함
                                    value={currentUser} // 필요하면 state로 관리
                                />
                            </div>
                            <div className="mb-3">
                        <label htmlFor="enddt" className="form-label">
                            기한
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="enddt"
                            value={enddt}
                            onChange={(e) => setEndDt(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="note" className="form-label">
                            휴가 사유
                        </label>
                        <textarea
                            className="form-control"
                            id="note"
                            rows="4"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="senior" className="form-label">
                            결제 권한
                        </label>
                        <select className="form-select" multiple>
                            {selectedMembers.map((userId) => (
                                <option key={userId} value={userId}>
                                    {userId}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="taskidshare"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                        >
                            <i className="fa-solid fa-user-plus"></i>
                        </button>
                    </div>
                    <select
                        style={{ display: "none" }}
                        name="status"
                        // onFocus={(e) => (e.target.initialSelect = e.target.selectedIndex)}
                        // onChange={(e) => (e.target.selectedIndex = e.target.initialSelect)}
                        readOnly
                    >
                        <option value="1" selected>
                            미승인
                        </option>
                        <option value="2">승인</option>
                        <option value="3">보류</option>
                    </select>
                    <input type="hidden" name="formtype" value="휴가 신청서" />
                    <button type="submit" className="btn btn-primary">
                        등록
                    </button>
                        </form>
                    )}    
                </div>

                <div className="mt-4">
                    <button className="btn btn-secondary" onClick={() => { }}>
                        홈 버튼
                    </button>
                    <a href="/auth/docx/list" className="btn btn-secondary">
                        리스트 페이지
                    </a>
                </div>
            </div>

            {/* 멤버 선택 모달 */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered mem_modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                멤버 선택
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form className="list_line">
                                <table className="m20 table_w100">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select className="select_box" onChange={(e) => setSearchType(e.target.value)}>
                                                    <option value="1">부서 이름</option>
                                                    <option value="2">직원 이름</option>
                                                    <option value="3">직급</option>
                                                </select>
                                            </td>
                                            <td className="list_search_wrapper">
                                                <input
                                                    className="list_input"
                                                    type="text"
                                                    onChange={(e) => setSearchName(e.target.value)}
                                                />
                                                <button type="button" className="btn blue_btn list_search" onClick={searchMembers}>
                                                    검색
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                            <form className="modal_list" action="/member/test">
                                <div className="modal_table_wrapper">
                                    <table className="table_w100 modal_table">
                                        <thead className="list_line">
                                            <tr>
                                                <th>
                                                    <input type="checkbox" />
                                                </th>
                                                <th className="w40 f600">Name</th>
                                                <th className="f600">E-mail</th>
                                            </tr>
                                        </thead>
                                        <tbody className="modal_body">
                                            {userArr.map((item, i) => (
                                                <tr key={i} className="list_line">
                                                    <td className="list_ch list_flex">
                                                        <input
                                                            type="checkbox"
                                                            value={item.userid.id}
                                                            id={item.userid.id}
                                                            checked={selectedMembers.includes(item.userid.id)}
                                                            onChange={() => handleCheckboxChange(item.userid.id)}
                                                        />
                                                    </td>
                                                    <td className="form_td">
                                                        <p className="f600 list_name">{item.userid.usernm}</p>
                                                        <p className="f600 list_id">{item.userid.id}</p>
                                                        <div className="list_pos">
                                                            <span className="list_dept">{item.deptid.deptnm}</span>
                                                            <span className="list_lv">{item.joblvid.joblvnm}</span>
                                                        </div>
                                                    </td>
                                                    <td className="form_td list_flex">{item.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn blue_btn" data-bs-dismiss="modal">
                                        선택
                                    </button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}