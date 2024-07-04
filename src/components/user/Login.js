import { useState } from "react";
import "./userform.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Login() {
    // const navigate = useNavigate();
    const [inputs, setInputs] = useState({ id: '', pwd: '' });
    const { id, pwd } = inputs;
    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    const login = () => {
        axios.post(`${process.env.REACT_APP_SERVER}/login`, {}, { params: { id: id, pwd: pwd } })
        .then((res)=> {
                if (res.status === 200) {
                    if (res.data.flag) {
                        sessionStorage.setItem("loginid", res.data.id);
                        sessionStorage.setItem("type", res.data.type);
                        sessionStorage.setItem("token", res.data.token);
                        // let url = '/';
                        // if (res.data.type === 'admin') {
                        //     url = '/index_admin';
                        // } else if (res.data.type === 'emp') {
                        //     url = '/index_emp';
                        // }
                        // navigate(url);
                    } else {
                        alert('로그인 실패');
                    }
                } else {
                    alert('비정상 응답')
                }
        })
    }

    return (
        <div className="form_wrapper">
            <div id="posts_list">
                <div className="container login_wrapper">
                    <div className="loginBoxTitle">HRD SYSTEM LOGIN</div>
                    <form name="userloginf">
                        {/* <span th:if="${errorMessage}">
                        <p id="valid" className="alert alert-danger"></p>
                    </span> */}
                        <div className="form-group">
                            <label>ID</label>
                            <input type="text" className="form-control" name="id" value={id} onChange={onChange} placeholder="아이디를 입력해주세요" />
                        </div>
                        <div className="form-group">
                            <label>비밀번호</label>
                            <input type="password" className="form-control" name="pwd" value={pwd} onChange={onChange} placeholder="비밀번호를 입력해주세요" />
                        </div>
                        <div className="form-group">
                            <div className="login_check w40">
                                <span>아이디 기억하기</span>
                                <input className="login_checkbox" type="checkbox" />
                            </div>
                            <button type="button" className="form-control btn btn-primary bi bi-lock-fill w40" onClick={login}> 로그인</button>
                        </div>

                    </form>
                </div>
            </div>
            <div className="join_link">
                <Link to="/join">회원가입</Link>
            </div>
        </div>
    )
}