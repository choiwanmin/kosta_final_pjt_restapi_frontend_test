import { useEffect, useState } from "react";
import "./member.css";
import axios from "axios";

export default function Userinfo() {
    const [user, setUser] = useState({});
    const { id, usernm, oldpwd, type, aprov } = user;
    const token = sessionStorage.getItem('token');
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER}/auth/user/userinfo`, { headers: { auth_token: token } })
            .then(function (res) {
                if (res.status === 200) {
                    setUser(res.data.user);
                } else {
                    alert('error')
                }
            })
    }, [token]);

    return (
        <div class="main_body">
            <div class="memberinfo_table w_bg">
                <div class="memberinfo_table_title">
                    <p>내 로그인 정보 페이지</p>
                </div>
                <div class="memberinfo_table_wrapper">
                    <table class="info-table">
                        <tr>
                            <th>사용자 계정</th>
                            {/* <td th:text="${user.id }"></td> */}
                            <td>{id}</td>
                        </tr>
                        <tr>
                            <th>사용자 이름</th>
                            {/* <td th:text="${user.usernm }"></td> */}
                            <td>{usernm}</td>
                        </tr>
                        <tr>
                            <th>사용자 비밀번호</th>
                            {/* <td th:value="${user.oldpwd }"></td> */}
                            <td>{oldpwd}</td>
                        </tr>
                        <tr>
                            <th>사용자 유형</th>
                            {/* <td th:text="${typeStr }"></td> */}
                            <td>{type}</td>
                        </tr>
                        <tr>
                            <th>사용자 승인 상태</th>
                            {/* <td th:text="${aprovStr }"></td> */}
                            <td>{aprov}</td>
                        </tr>

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
                                    {/* <form id="passwordChangeForm" action="/user/useredit" method="post" th:object="${user}"
                                        class="needs-validation" novalidate> */}
                                    <form id="passwordChangeForm" class="needs-validation" novalidate>
                                        <div class="mb-3">
                                            <label for="oldpwd" class="form-label">현재 비밀번호</label>
                                            <input type="password" class="form-control" id="oldpwd" name="oldpwd"
                                                placeholder="현재 비밀번호를 입력해주세요." required />
                                            <div class="invalid-feedback">현재 비밀번호를 입력해주세요.</div>
                                            {/* <div class="alert alert-danger" th:if="${valid_id}" th:text="${valid_id}"></div> */}
                                            <div class="alert alert-danger"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="newpwd" class="form-label">새 비밀번호</label>
                                            <input type="password" class="form-control" id="newpwd" name="newpwd"
                                                placeholder="새 비밀번호를 입력해주세요." required />
                                            <div class="invalid-feedback">영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 16자 이하로
                                                입력해주세요.
                                            </div>
                                            {/* <div class="alert alert-danger" th:if="${valid_pwd}" th:text="${valid_pwd}">
                                            </div> */}
                                            <div class="alert alert-danger"></div>

                                        </div>
                                        <div class="mb-3">
                                            <label for="confirmPassword" class="form-label">새 비밀번호 확인</label>
                                            <input type="password" class="form-control" id="confirmPassword"
                                                name="confirmPassword" placeholder="새 비밀번호를 다시 한번 입력해주세요." required />
                                            <div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">취소</button>
                                            <button type="submit" class="btn btn-primary">저장</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div class="memberinfo_admin_menu"
                        th:if="${session.loginId == user.id } or ${session.type == 'admin' }"> */}
                    <div class="memberinfo_admin_menu">
                        {/* <button type="button" class="btn blue_btn" id="usereditid"
                            th:onclick="usereditbtn([[${user.id }]])">내로그인정보수정페이지이동버튼</button> */}
                        <button type="button" class="btn blue_btn" id="usereditid"
                            onclick="">내로그인정보수정페이지이동버튼</button>
                        <button type="button" class="btn blue_btn" id="usereditid" data-bs-toggle="modal"
                            data-bs-target="#passwordChangeModal">
                            비밀번호 변경
                        </button>
                    </div>
                </div>
            </div >
        </div >
    )
}