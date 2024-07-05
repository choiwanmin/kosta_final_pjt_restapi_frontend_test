import { useState } from "react";
import "./userform.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Join() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ id: '', oldpwd: '', confirm_pwd: '', usernm: '', type: 'emp', aprov: '0' });
    const [errors, setErrors] = useState({});

    const { id, oldpwd, confirm_pwd, usernm, type, aprov } = inputs;
    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
        setErrors({
            ...errors,
            [name]: null // Clear error when user starts typing again
        });
    }

    const join = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_SERVER}/user/userjoin`, {}, {
            params: {
                id: id, oldpwd: oldpwd, confirm_pwd: confirm_pwd, usernm: usernm, type: type, aprov: aprov
            }
        })
            .then(function (res) {//res.status:상태값, res.data:백에서 보낸 데이터
                if (res.status === 200) {
                    if (res.data.flag) {
                        alert('회원가입 성공');
                        navigate('/login');
                    } else {
                        alert('회원가입 실패');
                        if (res.data.valid_id) {
                            setErrors(prevErrors => ({
                                ...prevErrors,
                                id: res.data.valid_id
                            }));
                        }
                        if (res.data.valid_oldpwd) {
                            setErrors(prevErrors => ({
                                ...prevErrors,
                                oldpwd: res.data.valid_oldpwd
                            }));
                        }
                        if (res.data.valid_confirm_pwd) {
                            setErrors(prevErrors => ({
                                ...prevErrors,
                                confirm_pwd: res.data.valid_confirm_pwd
                            }));
                        }
                        if (res.data.valid_usernm) {
                            setErrors(prevErrors => ({
                                ...prevErrors,
                                usernm: res.data.valid_usernm
                            }));
                        }
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
    return (
        <div className="form_wrapper">
            <div id="posts_list">
                <div className="container login_wrapper">
                    <div className="loginBoxTitle">HRD SYSTEM JOIN</div>
                    <form>
                        <div className="form-group">
                            <label className="w25">유저ID</label>
                            <input type="text" name="id" className="form-control"
                                value={id} onChange={onChange}
                                placeholder="가입할 계정ID를 입력해주세요" />
                        </div>

                        {errors.id && <div className="alert alert-danger">{errors.id}</div>}

                        <div className="form-group">
                            <label className="w25">비밀번호</label>
                            <input type="password" name="oldpwd" className="form-control"
                                value={oldpwd} onChange={onChange}
                                placeholder="비밀번호를 입력해주세요" />
                        </div>
                        {errors.oldpwd && <div className="alert alert-danger">{errors.oldpwd}</div>}
                        <div className="form-group">
                            <label className="w25">비밀번호 확인</label>
                            <input type="password" className="form-control" name="confirm_pwd"
                                value={confirm_pwd} onChange={onChange}
                                placeholder="비밀번호를 다시 한번 입력해주세요." />
                        </div>
                        {errors.confirm_pwd && <div className="alert alert-danger">{errors.confirm_pwd}</div>}
                        <div className="form-group">
                            <label className="w25">이름</label>
                            <input type="text" name="usernm" className="form-control"
                                value={usernm} onChange={onChange}
                                placeholder="가입할 유저의 이름을 입력해주세요" />
                        </div>
                        {errors.usernm && <div className="alert alert-danger">{errors.usernm}</div>}
                        <input type="hidden" name="type" value="emp" checked />
                        <input type="hidden" name="aprov" value="0" checked />
                        <div className="form-group join_btn_wrapper">
                            <button type="submit" className="btn btn-primary bi bi-person join_btn" onClick={join}> 가입</button>
                            <Link to="/login" className="join_btn">
                                <button type="button" className="btn btn-primary bi bi-person join_btn">로그인 페이지</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}