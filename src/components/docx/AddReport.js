import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../../store";
// import "./modal.css"; // modal.css 파일 import
import { useSelector } from "react-redux";

export default function AddReport() {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(""); //제목 입력
    const [writer, setWriter] = useState("");
    const [enddt, setEndDt] = useState("");
    const [taskplan, setTaskPlan] = useState("");
    const [taskprocs, setTaskProcs] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [userArr, setUserArr] = useState([]); //검색된 멤버 리스트
    const userList = useSelector((state) => state.modalArr);
    const [searchName, setSearchName] = useState("");
    const [searchType, setSearchType] = useState(1);

    const handleCheckboxChange = (userId) => {
        const isChecked = selectedMembers.includes(userId); //이미 선택된 유저 체크
        if (isChecked) {
            setSelectedMembers(selectedMembers.filter((id) => id !== userId)); //이미 체크 된 유저 체크 해재
        } else {
            setSelectedMembers([...selectedMembers, userId]); //선택 추가
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //폼 데이터 백단 전송
        const formData = {
            title: title,
            writer: writer,
            enddt: enddt,
            taskplan: taskplan,
            taskprocs: taskprocs,
            selectedMembers: selectedMembers,
        };
        console.log(formData); //폼데이터 콘솔 출력
        //axios 요청
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
                                className="tablinks btn btn-outline-primary"
                                onClick={() => { }}
                                id="report"
                            >
                                보고서
                            </button>
                            <button
                                className="tablinks btn btn-outline-primary"
                                onClick={() => { }}
                                id="vacation"
                            >
                                휴가 신청서
                            </button>
                            <button
                                className="tablinks btn btn-outline-primary"
                                onClick={() => { }}
                                id="meeting"
                            >
                                회의록
                            </button>
                        </div>
                    </div>
                </div>

                {/* 보고서 작성 양식 */}
                <div id="report" className="tabcontent">
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
                                value={writer}
                                onChange={(e) => setWriter(e.target.value)}
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
                            onFocus={(e) => (e.target.initialSelect = e.target.selectedIndex)}
                            onChange={(e) => (e.target.selectedIndex = e.target.initialSelect)}
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
                </div>

                {/* 휴가 신청서 작성 양식 */}
                <div id="vacation" className="tabcontent">
                    {/* 휴가 신청서 작성 폼 */}
                </div>

                {/* 회의록 작성 양식 */}
                <div id="meeting" className="tabcontent">
                    {/* 회의록 작성 폼 */}
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