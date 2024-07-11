import { useEffect, useState } from 'react';
import './user.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Userlist() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const token = sessionStorage.getItem('token');
    const type = sessionStorage.getItem('type');


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER}/admin/user/userlist`, { headers: { auth_token: token } })
            .then(function (res) {
                if (res.status === 200 && res.data.flag) {
                    // console.log(res.data.ulist);
                    setList(res.data.ulist);
                } else if (!res.data.flag) {
                    alert('잘못된 접근입니다.');
                    // alert('error')
                    navigate(-1);
                }
            })
    }, [token, type, navigate])

    const [usersearchfdata, setUsersearchfdata] = useState({
        type: '1', // Default value for type, assuming '1' corresponds to '부서이름'
        val: ''     // Default value for input field
    });

    const UserSearchChange = (e) => {
        const { name, value } = e.target;
        setUsersearchfdata({
            ...usersearchfdata,
            [name]: value
        });
    };

    const UserSearchSubmit = (e) => {
        e.preventDefault();
        console.log(usersearchfdata);
        const { val, type } = usersearchfdata;

        // console.log(deptsearchfdata.get('val'));
        // console.log(deptsearchfdata.get('type'));
        // Handle form submission logic here, e.g., send search query to server
        axios.post(`${process.env.REACT_APP_SERVER}/admin/user/getuserby?val=${val}&type=${type}`, {}, {
            headers: { auth_token: token },
            // params: { val, type }
        })
            .then(function (res) {
                // console.log(res.data.flag);
                // console.log(res.data.list);
                console.log(res.data.flag);
                if (res.status === 200 && res.data.flag) {
                    setList(res.data.ulist);
                } else if (!res.data.flag) {
                    alert('잘못된 접근입니다.');
                    // alert('error')
                }
            })
        console.log(usersearchfdata); // Example: Output form data to console
    };

    return (
        <div class="main_body">
            <div class="usersearch-body">
                {/* <form class="userlist_line" th:action="@{/admin/user/getdeptby}" method="post"> */}
                {/* <form class="userlist_line"> */}
                <form onSubmit={UserSearchSubmit} className="userlist_line">
                    <table class="m20 table_w100">
                        <thead>
                            <tr>
                                <td>
                                    <select class="userselect_box" name="type" value={usersearchfdata.type} onChange={UserSearchChange}>
                                        <option value="1">직원계정</option>
                                        <option value="2">부서이름</option>
                                        <option value="3">직원이름</option>
                                        <option value="4">직급이름</option>
                                        <option value="5">승인상태</option>
                                    </select>
                                </td>
                                <td class="userlist_search_wrapper">
                                    <input class="userlist_input" type="text" name="val" value={usersearchfdata.val}
                                        onChange={UserSearchChange} />&nbsp;
                                    <input type="submit" class="btn blue_btn list_search" value="검색" />
                                </td>
                            </tr>
                        </thead>
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
                            <tr>
                                <th>이름</th>
                                <th>부서</th>
                                <th>직급</th>
                                <th>이메일</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody class="userlist_list">
                            {
                                list && list.map(u => (
                                    <tr key={u.id}>
                                        <td><Link to={'/user/info/' + u.id}> {u.usernm}</Link></td>
                                        <td>{u.memberdto?.deptid?.deptnm}</td>
                                        <td>{u.memberdto?.joblvid?.joblvnm}</td>
                                        <td>{u.memberdto?.email}</td>
                                        <td>
                                            {u.aprov === 0 && '승인대기상태'}
                                            {u.aprov === 1 && '재직상태'}
                                            {u.aprov === 2 && '휴직상태'}
                                            {u.aprov === 3 && '퇴직상태'}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div >
            <div class="userlist_admin_menu">
                {/* <button type="button" class="btn blue_btn" th:onclick="location.href='/admin/user/usertestadd'">user더미 데이터 생성</button> */}
                {/* <button type="button" class="btn blue_btn" onClick={ }>user더미 데이터 생성</button> */}
                {/* <form action="/admin/member/membertestadd" method="post"> */}
                <form>
                    <input type="text" name="dummyuserid" placeholder="userid 기입" /><br />
                    {/* <button type="button" class="btn blue_btn" onClick={ }>member더미 데이터 생성</button> */}
                </form>
            </div>
        </div >
    )
}