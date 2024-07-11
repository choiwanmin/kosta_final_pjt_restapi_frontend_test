import { useEffect, useState } from "react";
import "./member.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Userinfo() {
    const navigate = useNavigate();
    const { userid } = useParams();
    const [user, setUser] = useState({});
    const [aprovStr, setAprovStr] = useState('');
    const [originalUser, setOriginalUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const { id, usernm, type, aprov } = user;
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER}/auth/user/userinfo/` + userid, { headers: { auth_token: token } })
            .then(function (res) {
                if (res.status === 200) {
                    setUser(res.data.user);
                    setOriginalUser(res.data.user);
                    setAprovStr(res.data.aprovStr);
                } else {
                    alert('error')
                }
            })
    }, [token, userid]);

    const editpgbtn = () => {
        setIsEditing(!isEditing);
    };

    const onChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const editbtn = () => {
        axios.put(`${process.env.REACT_APP_SERVER}/user/useredit`, {},
            { headers: { auth_token: token }, params: { id: id, usernm: usernm, type: type, aprov: aprov, aprovStr: aprovStr } })
            .then(function (res) {
                if (res.status === 200) {
                    if (res.data.flag) {
                        alert('수정 완료');
                        // navigate('/user/info' + { id });
                        // setIsEditing(!isEditing);
                        setIsEditing(false);
                    } else {
                        alert('수정 실패');
                        setIsEditing(!isEditing);
                    }
                } else {
                    alert('비정상 응답')
                }
            })
    }

    const aprovbtn = (userId, action) => {
        axios.get(`${process.env.REACT_APP_SERVER}/admin/user/useraprov?id=${userId}&aprov=${action}`, {
            headers: { auth_token: token }
        })
            .then(res => {
                if (res.status === 200) {
                    // Update UI based on response
                    let txt1 = '';
                    let txt2 = '';
                    if (res.data.aprov === 1) {
                        txt1 = '재직상태';
                        txt2 = '휴직처리';
                    } else if (res.data.aprov === 2) {
                        txt1 = '휴직상태';
                        txt2 = '승인처리';
                    } else if (res.data.aprov === 3) {
                        txt1 = '퇴직상태';
                        txt2 = '승인처리';
                    }
                    // Update DOM elements (if necessary)
                    // document.getElementById('aprovid').innerHTML = txt1;
                    // document.getElementById('aprovbtnid1').value = txt2;
                    alert(`${userId}의 승인 상태가 변경되었습니다.`);
                    navigate(0);
                } else {
                    alert('비정상 응답');
                }
            })
            .catch(err => {
                console.error('Error updating approval status:', err);
                alert('Error updating approval status');
            });
    };


    const backbtn = () => {
        setIsEditing(false);
    }
    const resetbtn = () => {
        setUser(originalUser);
    };

    // const pwdeditbtn = () => {
    //     axios.put(`${process.env.REACT_APP_SERVER}//user/userpwdedit?id=${id}`, {
    //         headers: { auth_token: token },
    //         params: { id: id, usernm: usernm, type: type, aprov: aprov, aprovStr: aprovStr }
    //     })
    //         .then(res => {

    //         })
    // }
    const userinfopgbtn = (userid) => {
        navigate('/user/info/' + userid);
    }

    const memberinfopgbtn = () => {
        navigate('/');
    }

    return (
        <div class="main_body">
            <div class="usersearch-body">
                <div class="memberinfo_admin_menu">
                    <button type="button" className="btn blue_btn" onClick={() => userinfopgbtn(user.id)}>
                        로그인 정보
                    </button>
                    <button type="button" className="btn blue_btn" onClick={memberinfopgbtn}>
                        개인정보
                    </button>
                </div>
            </div>
            <div class="memberinfo_table w_bg">
                <div class="memberinfo_table_title">
                    <p>내 로그인 정보 페이지</p>
                </div>
                <div class="memberinfo_table_wrapper">
                    <table class="info-table">
                        <tbody>
                            <tr>
                                <th>사용자 계정</th>
                                {!isEditing ? (
                                    <>
                                        <td>{id}</td>
                                    </>
                                ) : (
                                    <td><input type="text" name="id" id="idid" value={id} onChange={onChange} /></td>
                                )}
                            </tr>
                            <tr>
                                <th>사용자 이름</th>
                                {!isEditing ? (
                                    <>
                                        <td>{usernm}</td>
                                    </>
                                ) : (
                                    <td><input type="text" name="usernm" id="usernmid" value={usernm} onChange={onChange} /></td>
                                )}
                            </tr>
                            <tr>
                                <th>사용자 유형</th>
                                {!isEditing ? (
                                    <>
                                        <td>{type}</td>
                                    </>
                                ) : (
                                    <td>
                                        {/* <input type="text" name="type" id="typeid" value={type} onChange={onChange} /> */}
                                        <select name="type" id="typeid" value={user.type} onChange={onChange}>
                                            <option value="emp">직원</option>
                                            <option value="admin">관리자</option>
                                        </select>
                                    </td>
                                )}
                            </tr>
                            <tr>
                                <th>사용자 승인 상태</th>
                                {!isEditing ? (
                                    <>
                                        <td>{aprovStr}</td>
                                    </>
                                ) : (
                                    <td>
                                        <>
                                            {aprovStr}
                                            <br />
                                        </>
                                        {sessionStorage.getItem('type') === 'admin' && (
                                            <>
                                                {user.aprov === 0 || user.aprov === 2 || user.aprov === 3 ? (
                                                    <>
                                                        <input
                                                            type="button"
                                                            id="aprovbtnid1"
                                                            value="승인처리"
                                                            onClick={() => aprovbtn(user.id, '1')}
                                                        />
                                                        <br />
                                                    </>
                                                ) : null}
                                                {user.aprov === 1 && (
                                                    <>
                                                        <input
                                                            type="button"
                                                            value="휴직처리"
                                                            onClick={() => aprovbtn(user.id, '2')}
                                                        />
                                                        <br />
                                                    </>
                                                )}
                                                <>
                                                    <input
                                                        type="button"
                                                        value="퇴사처리"
                                                        onClick={() => aprovbtn(user.id, '3')}
                                                    />
                                                    <br />
                                                </>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>

                    {/* <!-- Password Change Modal --> */}
                    <div class="modal fade" id="passwordChangeModal" tabindex="-1"
                        aria-labelledby="passwordChangeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="passwordChangeModalLabel">비밀번호 변경</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="passwordChangeForm" class="needs-validation" novalidate>
                                        <div class="mb-3">
                                            <label for="oldpwd" class="form-label">현재 비밀번호</label>
                                            <input type="password" class="form-control" id="oldpwd" name="oldpwd"
                                                placeholder="현재 비밀번호를 입력해주세요." required />
                                            <div class="invalid-feedback">현재 비밀번호를 입력해주세요.</div>
                                            {/* {errors.oldpwd && <div className="alert alert-danger">{errors.oldpwd}</div>} */}
                                        </div>
                                        <div class="mb-3">
                                            <label for="newpwd" class="form-label">새 비밀번호</label>
                                            <input type="password" class="form-control" id="newpwd" name="newpwd"
                                                placeholder="새 비밀번호를 입력해주세요." required />
                                            {/* {errors.newpwd && <div className="alert alert-danger">{errors.newpwd}</div>} */}

                                        </div>
                                        <div class="mb-3">
                                            <label for="confirmPassword" class="form-label">새 비밀번호 확인</label>
                                            <input type="password" class="form-control" id="confirmPassword"
                                                name="confirmPassword" placeholder="새 비밀번호를 다시 한번 입력해주세요." required />
                                            {/* {errors.confirm_pwd && <div className="alert alert-danger">{errors.confirm_pwd}</div>} */}
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">취소</button>
                                            {/* <button type="button" class="btn btn-primary" onClick={pwdeditbtn}>변경</button> */}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div class="memberinfo_admin_menu"
                        th:if="${session.loginId == user.id} or ${session.type == 'admin'}"> */}
                    <div class="memberinfo_admin_menu">
                        {!isEditing && sessionStorage.getItem('type') === 'admin' && (
                            <button type="button" className="btn blue_btn" id="usereditpgbtnid" onClick={editpgbtn}>
                                내로그인정보수정페이지이동버튼
                            </button>
                        )}
                        {!isEditing ? (
                            <>
                                <button type="button" className="btn blue_btn" id="usereditid" data-bs-toggle="modal" data-bs-target="#passwordChangeModal">
                                    비밀번호 변경
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="submit" className="btn blue_btn" id="usereditbtnid" onClick={editbtn}>
                                    내로그인정보수정버튼
                                </button>
                                <button type="button" className="btn blue_btn" onClick={resetbtn}>
                                    취소
                                </button>
                                <button type="button" className="btn blue_btn" onClick={backbtn}>
                                    되돌아가기
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div >
        </div >
    )
}