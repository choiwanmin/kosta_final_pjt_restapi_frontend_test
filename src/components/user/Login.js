import "./userform.css";
import { Link } from "react-router-dom";

export default function Login(){
    return(
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
                        <input type="text" className="form-control" id="id" name="id" placeholder="아이디를 입력해주세요"/>
                    </div>
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input type="password" className="form-control" name="pwd" placeholder="비밀번호를 입력해주세요"/>
                    </div>
                    <div className="form-group">
                        <div className="login_check w40">
                            <span>아이디 기억하기</span>
                            <input className="login_checkbox" type="checkbox"/>
                        </div>
                        <button className="form-control btn btn-primary bi bi-lock-fill w40"> 로그인</button>
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