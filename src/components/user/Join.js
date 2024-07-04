import "./userform.css";
import { Link } from "react-router-dom";
export default function Join(){
   
   
    return(
        <div className="form_wrapper">
            <div id="posts_list">
                <div className="container login_wrapper">
                    <div className="loginBoxTitle">HRD SYSTEM JOIN</div>
                    <form>
                        <div className="form-group">
                            <label className="w25">유저ID</label>
                            <input type="text" name="id" className="form-control"
                            placeholder="가입할 계정ID를 입력해주세요"/>
                        </div>
                        <div className="alert alert-danger" text="" id="valid"></div>
                        <div className="form-group">
                            <label className="w25">비밀번호</label>
                            <input type="password" name="oldpwd"  className="form-control" placeholder="비밀번호를 입력해주세요"/>
                        </div>
                        <div className="alert alert-danger" id="valid"></div>
                        <div className="form-group">
                            <label className="w25">비밀번호 확인</label>
                            <input type="password" className="form-control" name="confirm_pwd" placeholder="비밀번호를 다시 한번 입력해주세요." />
                        </div>
                        <div className="alert alert-danger" id="valid"></div>
                        <div className="form-group">
                            <label className="w25">이름</label>
                            <input type="text" name="usernm" className="form-control" placeholder="가입할 유저의 이름을 입력해주세요" />
                        </div>
                        <div className="alert alert-danger" id="valid"></div>
                        <input type="hidden" name="type" value="emp" checked/>
                        <input type="hidden" name="aprov" value="0" checked/>
                        <div className="form-group join_btn_wrapper">
                            <button type="submit" className="btn btn-primary bi bi-person join_btn"> 가입</button>
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