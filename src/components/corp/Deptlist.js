import { useEffect, useState } from "react";
import "./dept.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Deptlist() {
    // // 부서 추가 폼 모달 열기
    // $(document).ready(function () {
    //     $('.btn_square').click(function () {
    //         // Show modal content
    //         $('#deptsModal .modal-body').html();
    //         $('#deptsModal .modal-footer').html();

    //         // Show the modal
    //         $('#deptsModal').modal('show');

    //         $('#deptsModalLabel').html('부서추가');

    //         // Change the style of the form
    //         $('#depteditform').hide();
    //         $('#deptform').show();

    //     });

    //     $('.btn-close').click(function () {
    //         // Clear previous modal content
    //         $('#deptsModal .modal-body').empty();
    //         $('#deptsModal .modal-footer').empty();

    //         // Change the style of the form
    //         $('#depteditform').show();
    //         $('#deptform').hide();

    //     });
    // });

    // 부서 추가하기
    // const deptaddbtn = () => {
    //     let formData = new FormData(document.getElementById('deptform'));

    //     $.ajax({
    //         type: 'POST',
    //         url: '/admin/corp/deptadd', // URL to submit the form data
    //         data: formData,
    //         success: (response) => {
    //             alert('부서가 추가되었습니다!'); // Show success message
    //             // Optionally, you can handle UI updates or other actions on success
    //             $('#deptnmid').val("");
    //             $('#mgridid').val("");
    //             $(".btn-close").click(); // Close the modal
    //             window.location.href = '/corp/deptlist'; // Redirect to department list page
    //         },
    //         error: (xhr, status, error) => {
    //             alert('부서 추가 중 오류가 발생했습니다.'); // Show error message
    //             console.error(xhr); // Log the error for debugging
    //             // Optionally, you can handle specific errors or do additional error handling here
    //         }
    //     });
    // };


    const navigate = useNavigate();
    const [dlist, setDlist] = useState([]);
    const token = sessionStorage.getItem('token');
    const type = sessionStorage.getItem('type');

    const [dto, setDto] = useState({ deptnm: '', mgrid: '' });
    const { deptnm, mgrid } = dto;

    const onChange = (e) => {
        const { name, value } = e.target;
        setDto({
            ...dto,
            [name]: value
        });
    };
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER}/corp/deptlist`, { headers: { auth_token: token } })
            .then(function (res) {
                // console.log(res.data.flag);
                // console.log(res.data.dlist);
                if (res.status === 200 && res.data.flag) {
                    setDlist(res.data.dlist);
                } else if (!res.data.flag) {
                    alert('잘못된 접근입니다.');
                    // alert('error')
                    navigate(-1);
                }
            })
    }, [token, type, navigate])

    const deptaddbtn = () => {
        let deptfdata = new FormData(document.getElementById('deptf'));
        // deptfdata.append('deptnm', dto.deptnm);
        // deptfdata.append('mgrid', dto.mgrid);

        console.log(deptfdata.get('deptnm'));
        console.log(deptfdata.get('mgrid'));
        for (let key of deptfdata.keys()) {
            console.log(key, ":", deptfdata.get(key));
        }
        // try {
        axios.post(`${process.env.REACT_APP_SERVER}/admin/corp/deptadd`, deptfdata,
            { headers: { auth_token: token, "Content-Type": "multipart/form-data" } })
            .then(function (res) {//res.status:상태값, res.data:백에서 보낸 데이터
                if (res.status === 200) {
                    console.log(res.data.flag);
                    for (let key of deptfdata.keys()) {
                        console.log(key, ":", deptfdata.get(key));
                    }
                    if (res.data.flag) {
                        alert('부서 추가 성공');
                        document.getElementById('deptsModalClose').click();
                        window.location.href = '/dept/list';
                    } else {
                        alert('부서 추가 실패');
                    }
                } else {
                    alert('비정상 응답')
                }
            })
        // } catch (error) {
        //     alert('부서 추가 중 오류가 발생했습니다.');
        //     console.error('Error:', error);
        //     // Optionally handle specific errors or add more detailed error messages
        // }
    }

    const [deptsearchfdata, setDeptsearchfdata] = useState({
        type: '1', // Default value for type, assuming '1' corresponds to '부서이름'
        val: ''     // Default value for input field
    });

    const DeptSearchChange = (e) => {
        const { name, value } = e.target;
        setDeptsearchfdata({
            ...deptsearchfdata,
            [name]: value
        });
    };

    const DeptSearchSubmit = (e) => {
        e.preventDefault();
        console.log(deptsearchfdata);
        const { val, type } = deptsearchfdata;

        // console.log(deptsearchfdata.get('val'));
        // console.log(deptsearchfdata.get('type'));
        // Handle form submission logic here, e.g., send search query to server
        axios.post(`${process.env.REACT_APP_SERVER}/corp/getdeptby?val=${val}&type=${type}`, { headers: { auth_token: token },
            // params: { val, type }
        })
            .then(function (res) {
                // console.log(res.data.flag);
                // console.log(res.data.dlist);
                console.log(res.data.flag);
                if (res.status === 200 && res.data.flag) {
                    setDlist(res.data.dlist);
                } else if (!res.data.flag) {
                    alert('잘못된 접근입니다.');
                    // alert('error')
                }
            })
        console.log(deptsearchfdata); // Example: Output form data to console
    };

    return (
        <div class="main_body">
            <div class="deptsearch-body">
                {/* <form class="deptlist_line" th:action="@{/corp/getdeptby}" method="post">
				<table class="m20 table_w100">
					<tr>
						<td>
							<select class="select_box" name="type">
								<option th:value="1" th:selected="${type == 1 }">부서이름</option>
								<option th:value="2" th:selected="${type == 2 }">부서장</option>
							</select>
						</td>
						<td class="deptlist_search_wrapper">
							<input class="deptlist_input" type="text" name="val" th:value="${param.val }" />&nbsp;
							<input type="submit" class="btn blue_btn list_search" value="검색" />
						</td>
					</tr>
				</table>
			</form> */}
                <form onSubmit={DeptSearchSubmit} className="deptlist_line">
                    <table className="m20 table_w100">
                        <tbody>
                            <tr>
                                <td>
                                    <select
                                        className="deptselect_box"
                                        name="type"
                                        value={deptsearchfdata.type}
                                        onChange={DeptSearchChange}
                                    >
                                        <option value="1">부서이름</option>
                                        <option value="2">부서장</option>
                                    </select>
                                </td>
                                <td className="deptlist_search_wrapper">
                                    <input
                                        className="deptlist_input"
                                        type="text"
                                        name="val"
                                        value={deptsearchfdata.val}
                                        onChange={DeptSearchChange}
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

            <div class="deptlist_table w_bg">
                <div class="deptlist_table_title">
                    <p>부서 목록</p>
                </div>
                <div class="deptlist_table_wrapper">
                    <table class="deptlist_rtable">
                        <thead>
                            <td>부서번호</td>
                            <td>부서이름</td>
                            <td>부서장</td>
                        </thead>
                        <tbody class="deptlist_list">
                            {
                                dlist && dlist.map(d => (
                                    <tr key={d.deptid}>
                                        <td>{d.deptid}</td>
                                        <td>{d.deptnm}</td>
                                        {/* <td>
                                            <a href="#" class="dept-detail-link" data-deptid={d.deptid}
                                                data-bs-toggle="modal" data-bs-target="#deptsModal">deptnm</a>
                                        </td> */}
                                        <td>{d.mgrid?.userid?.usernm}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="deptlist_admin_menu">
                <button class="btn_square border_btn font_b24 cursor" data-bs-toggle="modal"
                    data-bs-target="#deptsModal">부서추가</button>
                <button type="button" class="btn blue_btn" onClick="location.href='/admin/corp/depttestadd'">dept더미 데이터
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
            <div className="modal fade" id="deptsModal" tabIndex="-1" aria-labelledby="deptsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deptsModalLabel">부서 추가</h5>
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
                            <form id="deptf">
                                <table>
                                    <tr>
                                        <td class="form_td">부서이름</td>
                                        <td class="form_td">
                                            <input type="text" name="deptnm" value={deptnm} onChange={onChange} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="form_td">부서장</td>
                                        <td class="form_td">
                                            <input type="text" name="mgrid" value={mgrid} onChange={onChange} />
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn blue_btn" onClick={deptaddbtn}>부서 추가</button>
                            <button type="button" className="btn btn-secondary" id="deptsModalClose" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}