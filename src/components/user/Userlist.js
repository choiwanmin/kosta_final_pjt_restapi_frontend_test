import { useEffect, useState } from 'react';
import './user.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Userlist() {
    const [list, setList] = useState([]);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER}/admin/user/userlist`, { headers: { auth_token: token } })
            .then(function (res) {
                if (res.status === 200) {
                    setList(res.data.list);
                } else {
                    alert('error')
                }
            })
    }, [token])

    return (
        <div class="main_body">
            <div class="usersearch-body">
                {/* <form class="userlist_line" th:action="@{/admin/user/getdeptby}" method="post"> */}
                <form class="userlist_line">
                    <table class="m20 table_w100">
                        <tr>
                            <td>
                                <select class="select_box" name="type">
                                    <option value="1">직원계정</option>
                                    <option value="2">부서이름</option>
                                    <option value="3">직원이름</option>
                                    <option value="4">직급이름</option>
                                    <option value="5">승인상태</option>
                                </select>
                            </td>
                            <td class="userlist_search_wrapper">
                                <input class="userlist_input" type="text" name="val" />&nbsp;
                                <input type="submit" class="btn blue_btn list_search" value="검색" />
                            </td>
                        </tr>
                    </table>
                </form>
            </div>

            <div class="userlist_table w_bg">
                <div class="userlist_table_title">
                    <p>직원 목록</p>
                </div>
                <div class="userlist_table_wrapper">
                    <table class="userlist_rtable">
                        <thead>
                            <td>이름</td>
                            <td>부서</td>
                            <td>직급</td>
                            <td>이메일</td>
                            <td>상태</td>
                        </thead>
                        <tbody class="userlist_list">
                            {/* <tr th:each="u:${ulist }">
							<td><a href="user/userinfo.html" th:href="@{/user/userinfo(id=${u.id})}"
									th:text="${u.usernm}">usernm</a>
							</td>
							<td th:text="${u?.memberdto?.deptid?.deptnm }"></td>
							<td th:text="${u?.memberdto?.joblvid?.joblvnm }"></td>
							<td th:text="${u?.memberdto?.email }"></td>
							<td th:if="${u.aprov == 0 }" th:text="승인대기상태"></td>
							<td th:if="${u.aprov == 1 }" th:text="재직상태"></td>
							<td th:if="${u.aprov == 2 }" th:text="휴직상태"></td>
							<td th:if="${u.aprov == 3 }" th:text="퇴직상태"></td>
						</tr> */}
                            {list && list.map((u) => (
                                <tr key={u.id}>
                                    <td><a href={`/user/userinfo/${u.id}`}>{u.usernm}</a></td>
                                    {/* <td>{u.memberdto?.deptid?.deptnm}</td>
                                    <td>{u.memberdto?.joblvid?.joblvnm}</td>
                                    <td>{u.memberdto?.email}</td> */}
                                    <td>
                                        {u.aprov === 0 && '승인대기상태'}
                                        {u.aprov === 1 && '재직상태'}
                                        {u.aprov === 2 && '휴직상태'}
                                        {u.aprov === 3 && '퇴직상태'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="userlist_admin_menu">
                {/* <button type="button" class="btn blue_btn" th:onclick="location.href='/admin/user/usertestadd'">user더미 데이터 생성</button> */}
                {/* <button type="button" class="btn blue_btn" onClick={ }>user더미 데이터 생성</button> */}
                {/* <form action="/admin/member/membertestadd" method="post"> */}
                <form>
                    <input type="text" name="dummyuserid" placeholder="userid 기입" /><br />
                    {/* <button type="button" class="btn blue_btn" onClick={ }>member더미 데이터 생성</button> */}
                </form>
            </div>
        </div>
    )
}