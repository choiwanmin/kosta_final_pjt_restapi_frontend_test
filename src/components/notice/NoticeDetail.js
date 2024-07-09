import { useState } from "react"
import axios from "axios";


export default function NoticeDetail(){
    const[noticedetail, setNoticedetail] = useState({});
    const[noticeid, setNoticeid] = useState('');
    const token = sessionStorage.getItem('token');

    const ndetail = ()=>{
        axios.get(`${process.env.REACT_APP_SERVER}/auth/notice/detail{noticeid}`,{headers:{auth_token:token}})
        .then(function(res){
            if(res.status === 200){
                setNoticedetail(res.data.notice);
            }else{
                alert('공지 상세정보 로딩 실패');
            }
        })
    }

    return (
        <div class="main_body">
        <div class="record_table w_bg">
            <div class="container mt-5">
                <div class="row">
                    <div class="col-12 text-center">
                        <h3 class="font_b24 m_b2">보고서 상세 페이지</h3>
                    </div>
                </div>
                <div class="record_table w_bg p-3">
                    <form>
                        <div class="mb-3">
                            <label for="title" class="form-label"><strong>문서 제목:</strong></label>
                            <input type="text" id="title" class="form-control" th:value="${d.title}" readonly/>
                        </div>
                        <div class="mb-3">
                            <label for="writer" class="form-label"><strong>작성자:</strong></label>
                            <input type="text" id="writer" class="form-control" th:value="${d.writer.id}" readonly/>
                        </div>
                        <div class="mb-3">
                            <label for="enddt" class="form-label"><strong>기한:</strong></label>
                            <input type="text" id="enddt" class="form-control" th:value="${d.enddt}" readonly/>
                        </div>
                    </form>
                </div>
                <div class="row mt-3">
                    <div class="col-12 text-center">
                        <a href="/auth/docx/list" class="btn btn-secondary">문서 리스트로 돌아가기</a>
                    </div>
                </div>
            </div>
            </div>
            </div>
    )
}