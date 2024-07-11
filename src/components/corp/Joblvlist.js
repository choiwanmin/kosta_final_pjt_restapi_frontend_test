import { useEffect, useState } from "react";
import "./joblv.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Joblvlist() {
    const navigate = useNavigate();
    const [jlist, setJlist] = useState([]);
    const token = sessionStorage.getItem('token');
    const type = sessionStorage.getItem('type');

    const [dto, setDto] = useState({ joblvid: '', joblvnm: '' });
    const { joblvid, joblvnm } = dto;

    const onChange = (e) => {
        const { name, value } = e.target;
        setDto({
            ...dto,
            [name]: value
        });
    };
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER}/corp/joblvlist`, { headers: { auth_token: token } })
            .then(function (res) {
                // console.log(res.data.flag);
                // console.log(res.data.dlist);
                if (res.status === 200 && res.data.flag) {
                    setJlist(res.data.jlist);
                } else if (!res.data.flag) {
                    alert('잘못된 접근입니다.');
                    // alert('error')
                    navigate(-1);
                }
            })
    }, [token, type, navigate])

    const joblvaddbtn = () => {
        let joblvfdata = new FormData(document.getElementById('joblvf'));
        console.log(joblvfdata.get('deptnm'));
        console.log(joblvfdata.get('mgrid'));
        for (let key of joblvfdata.keys()) {
            console.log(key, ":", joblvfdata.get(key));
        }
        // try {
        axios.post(`${process.env.REACT_APP_SERVER}/admin/corp/joblvadd`, joblvfdata,
            { headers: { auth_token: token, "Content-Type": "multipart/form-data" } })
            .then(function (res) {//res.status:상태값, res.data:백에서 보낸 데이터
                if (res.status === 200) {
                    console.log(res.data.flag);
                    for (let key of joblvfdata.keys()) {
                        console.log(key, ":", joblvfdata.get(key));
                    }
                    if (res.data.flag) {
                        alert('직급 추가 성공');
                        document.getElementById('joblvsModalClose').click();
                        window.location.href = '/joblv/list';
                    } else {
                        alert('직급 추가 실패');
                    }
                } else {
                    alert('비정상 응답')
                }
            })
    }


    const [joblvsearchfdata, setJoblvsearchfdata] = useState({
        type: '1', // Default value for type, assuming '1' corresponds to '부서이름'
        val: ''     // Default value for input field
    });

    const JoblvSearchChange = (e) => {
        const { name, value } = e.target;
        setJoblvsearchfdata({
            ...joblvsearchfdata,
            [name]: value
        });
    };

    const JoblvSearchSubmit = (e) => {
        e.preventDefault();
        console.log(joblvsearchfdata);
        const { val, type } = joblvsearchfdata;

        // console.log(deptsearchfdata.get('val'));
        // console.log(deptsearchfdata.get('type'));
        // Handle form submission logic here, e.g., send search query to server
        axios.post(`${process.env.REACT_APP_SERVER}/corp/getjoblvby?val=${val}&type=${type}`, {
            headers: { auth_token: token },
            // params: { val, type }
        })
            .then(function (res) {
                // console.log(res.data.flag);
                // console.log(res.data.dlist);
                console.log(res.data.flag);
                if (res.status === 200 && res.data.flag) {
                    setJlist(res.data.jlist);
                } else if (!res.data.flag) {
                    alert('잘못된 접근입니다.');
                    // alert('error')
                }
            })
        console.log(joblvsearchfdata); // Example: Output form data to console
    };

    return (
        <div class="main_body">
            <div class="joblvsearch-body">
                {/* <form class="joblvlist_line" th:action="@{/corp/getdeptby}" method="post">
				<table class="m20 table_w100">
					<tr>
						<td>
							<select class="select_box" name="type">
								<option th:value="1" th:selected="${type == 1 }">부서이름</option>
								<option th:value="2" th:selected="${type == 2 }">부서장</option>
							</select>
						</td>
						<td class="joblvlist_search_wrapper">
							<input class="joblvlist_input" type="text" name="val" th:value="${param.val }" />&nbsp;
							<input type="submit" class="btn blue_btn list_search" value="검색" />
						</td>
					</tr>
				</table>
			</form> */}
                <form onSubmit={JoblvSearchSubmit} className="joblvlist_line">
                    <table className="m20 table_w100">
                        <tbody>
                            <tr>
                                <td>
                                    <select
                                        className="joblvselect_box"
                                        name="type"
                                        value={joblvsearchfdata.type}
                                        onChange={JoblvSearchChange}
                                    >
                                        <option value="1">직급번호</option>
                                        <option value="2">직급이름</option>
                                    </select>
                                </td>
                                <td className="joblvlist_search_wrapper">
                                    <input
                                        className="joblvlist_input"
                                        type="text"
                                        name="val"
                                        value={joblvsearchfdata.val}
                                        onChange={JoblvSearchChange}
                                    />&nbsp;
                                    <input
                                        type="submit"
                                        className="btn blue_btn list_search"
                                        value="검색"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>

            <div class="joblvlist_table w_bg">
                <div class="joblvlist_table_title">
                    <p>직급 목록</p>
                </div>
                <div class="joblvlist_table_wrapper">
                    <table class="joblvlist_rtable">
                        <thead>
                            <td>직급인덱스</td>
                            <td>직급번호</td>
                            <td>직급이름</td>
                        </thead>
                        <tbody class="joblvlist_list">
                            {
                                jlist && jlist.map(j => (
                                    <tr key={j.joblvidx}>
                                        <td>{j.joblvidx}</td>
                                        <td>{j.joblvid}</td>
                                        {/* <td>
                                            <a href="#" class="dept-detail-link" data-deptid={d.deptid}
                                                data-bs-toggle="modal" data-bs-target="#deptsModal">deptnm</a>
                                        </td> */}
                                        <td>{j.joblvnm}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="joblvlist_admin_menu">
                <button class="btn_square border_btn font_b24 cursor" data-bs-toggle="modal"
                    data-bs-target="#joblvsModal">직급추가</button>
                <button type="button" class="btn blue_btn" onClick="location.href='/admin/corp/'">joblv더미 데이터
                    생성</button>
            </div>

            {/* Deptadd Modal
		Modal */}
            {/* <div class="modal fade" id="deptsModal" tabindex="-1" aria-labelledby="deptsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deptsModalLabel">부서추가</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="deptform" style="display: none;">
                                <table>
                                    <tr>
                                        <td class="form_td">부서이름</td>
                                        <td class="form_td">
                                            <input type="text" name="deptnm" id="depnmid" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="form_td">부서장</td>
                                        <td class="form_td">
                                            <input type="text" name="mgrid" id="mgridid" />
                                        </td>
                                    </tr>
                                </table>
                                <div class="modal-footer">
                                    <button type="button" class="btn blue_btn" onclick="deptaddbtn()">부서추가</button>
                                    <button type="button" class="btn btn-secondary" id="deptsModalClose" data-bs-dismiss="modal">Close</button>
                                </div>
                            </form>
                           
                        </div>

                    </div>
                </div>
            </div> */}
            {/* Modal */}
            <div className="modal fade" id="joblvsModal" tabIndex="-1" aria-labelledby="joblvsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="joblvsModalLabel">직급 추가</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* <form id="deptf">
                                <div className="mb-3">
                                    <label htmlFor="deptnm" className="form-label">부서 이름</label>
                                    <input type="text" className="form-control" id="deptnm" value={deptnm} onChange={(e) => setDeptnm(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mgrid" className="form-label">부서 장</label>
                                    <input type="text" className="form-control" id="mgrid" value={mgrid} onChange={(e) => setMgrid(e.target.value)} />
                                </div>
                            </form> */}
                            <form id="joblvf">
                                <table>
                                    <tr>
                                        <td class="form_td">직급번호</td>
                                        <td class="form_td">
                                            <input type="text" name="joblvid" value={joblvid} onChange={onChange} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="form_td">직급이름</td>
                                        <td class="form_td">
                                            <input type="text" name="joblvnm" value={joblvnm} onChange={onChange} />
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn blue_btn" onClick={joblvaddbtn}>직급 추가</button>
                            <button type="button" className="btn btn-secondary" id="joblvsModalClose" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}