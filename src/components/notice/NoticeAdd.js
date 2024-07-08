import {useState } from "react";
import axios from "axios";

export default function NoticeAdd() {

    const wname = sessionStorage.getItem('usernm');
    const token = sessionStorage.getItem('token');
    const loginId = sessionStorage.getItem('loginId');
    const deptnm = sessionStorage.getItem('deptnm');
    const [deptType, setDeptType] = useState();

    const [formData, setFormData] = useState({
        title: ({}),
        writername: ({}),
        writer: ({}),
        enddt: ({}),
        content: ({})
    });

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const addnotice = () => {
        let fdata = new FormData(document.getElementById('addn'));
        axios.post(`${process.env.REACT_APP_SERVER}/auth/notice/add`, fdata, { 
            headers: { 
                'Content-Type': 'multipart/form-data',
                auth_token: token 
            }, params:{dept:deptType}
        })
        .then(function (res) {
            if (res.status === 200) {
                alert('공지사항이 성공적으로 등록되었습니다.');
                window.location.href="/noticelist";
            } else {
                alert('공지사항 등록에 실패하였습니다.');
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
            alert('공지사항 등록 중 오류가 발생했습니다.');
        });
    };

    return (
        <div className="main_body">
            <div className="record_table w_bg">
                <div className="row">
                    <div className="col-12">
                        <h3 className="font_b24 m_b2">공지 작성</h3>
                    </div>
                </div>
                <div id="notice" className="tabcontent">
                    <form id="addn" method="post">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">공지 제목</label>
                            <input type="text" className="form-control" onChange={onChange} name="title" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="writer" className="form-label">작성자</label>
                            <input type="hidden" className="form-control" name="writer" value={loginId} readOnly />
                            <input type="text" className="form-control"  value={wname} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="enddt" className="form-label">기한</label>
                            <input type="date" className="form-control" onChange={onChange} name="enddt" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">공지내용</label>
                            <textarea className="form-control" onChange={onChange} name="content" rows="4"></textarea>
                        </div>
                        <div className="mb-3">
                        <select id="deptType" name="deptType" onChange={(e) => setDeptType(e.target.value)}>
                            <option value={deptnm}>{deptnm}</option>
                            <option value="전체">전체</option>
                        </select>
                        </div>
                        <button type="button" className="btn btn-primary"  onClick={addnotice}>등록</button>
                    </form>
                </div>
                <div className="mt-4">
                    <button className="btn btn-secondary" onClick={() => window.location.href = '/'}>홈버튼</button>
                    <a href="/auth/docx/list" className="btn btn-secondary">리스트 페이지</a>
                </div>
            </div>
        </div>
    )
}