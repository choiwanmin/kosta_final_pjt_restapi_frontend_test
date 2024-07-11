import { useState } from "react"
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";


export default function NoticeDetail(){
    const[noticedetail, setNoticedetail] = useState({});
    const token = sessionStorage.getItem('token');
    const { notid } = useParams();

    useEffect(() => {
        if (notid) {
            ndetail(notid);
        }
    }, [notid]);

    const ndetail = (notid) => {
        axios.post(`${process.env.REACT_APP_SERVER}/auth/notice/detail`,{}, {headers: { auth_token: token}, params:{id:notid}})
        .then(function(res) {
            if (res.status === 200) {
                setNoticedetail(res.data.notice);
            } else {
                alert('공지 상세정보 로딩 실패');
            }
        })
        .catch(function(error) {
            console.error('Error loading notice detail:', error);
            alert('공지 상세정보 로딩 실패');
        });
    };

    return (
        <div class="main_body">
        <div class="record_table w_bg">
            <div class="container mt-5">
                <div class="row">
                    <div class="col-12 text-center">
                        <h3 class="font_b24 m_b2">공지 상세 페이지</h3>
                    </div>
                </div>
                <div class="record_table w_bg p-3">
                    <form>
                        <div class="mb-3">
                            <label for="title" class="form-label"><strong>제목:</strong></label>
                            <input type="text" id="title" class="form-control" value={noticedetail.title} readonly/>
                        </div>
                        <div class="mb-3">
                            <label for="writer" class="form-label"><strong>작성자:</strong></label>
                            <input type="text" id="writer" class="form-control" value={noticedetail.writername} readonly/>
                        </div>
                        <div class="mb-3">
                            <label for="enddt" class="form-label"><strong>기한:</strong></label>
                            <input type="text" id="enddt" class="form-control" value={noticedetail.enddt} readonly />
                        </div>
                        <div class="mb-3">
                            <label for="enddt" class="form-label"><strong>내용:</strong></label>
                            <textarea id="enddt" class="form-control" value={noticedetail.content} readonly />
                        </div>
                    </form>
                </div>
                <div class="row mt-3">
                    <div class="col-12 text-center">
                        <Link to="/noticelist" class="btn btn-secondary">공지 리스트로 돌아가기</Link>
                    </div>
                </div>
            </div>
            </div>
            </div>
    )
}