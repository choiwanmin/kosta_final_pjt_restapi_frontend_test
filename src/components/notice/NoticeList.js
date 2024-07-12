import React, { useEffect, useState } from "react";
import axios from 'axios';
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";


export default function NoticeList() {
    const [nlist, setNlist] = useState([]);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const token = sessionStorage.getItem('token');
    const deptnm = sessionStorage.getItem('deptnm');
    const navigate = useNavigate();
    const [formType, setFormType] = useState("전체");


    const showdetails = (notid) => {
        navigate(`/noticedetail/${notid}`);
    }

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        console.log(pageNumber);
    };

    const addnoti = () => {
        navigate('/noticeadd');
    }

    const searchTitle = () => {
        var valuett = document.getElementById('searchValue').value;
        if (searchType === 'title') {
            setTitle(valuett);

        } else if (searchType === 'writer') {
            setWriter(valuett);

        }
    };

    useEffect(() => {
        if (searchType === 'title' && title) {
            getNoticelistByTitle();
        } else if (searchType === 'writer' && writer) {
            getNoticelistByWriter();
        }
        else {
            if (formType === deptnm) {
                getdeptNoticelist();
            } else {
                getNoticelist();
            }
        }
    }, [page, title, writer, searchType, formType]);

    const getNoticelist = () => {
        axios.get(`${process.env.REACT_APP_SERVER}/auth/notice/allpagelist`, { headers: { auth_token: token }, params: { formtype: formType, page: page, size: 10 } })
            .then(function (res) {
                if (res.status === 200) {
                    setNlist(res.data.list);
                    setTotalItemsCount(res.data.totalCount);
                } else {
                    alert('공지 리스트 로딩 실패');
                }
            })
    }

    const getdeptNoticelist = () => {
        axios.get(`${process.env.REACT_APP_SERVER}/auth/notice/deptpagelist`, { headers: { auth_token: token }, params: { page: page, size: 10 } })
            .then(function (res) {
                if (res.status === 200) {
                    setNlist(res.data.list);
                    setTotalItemsCount(res.data.totalCount);
                } else {
                    alert('공지 리스트 로딩 실패');
                }
            })
    }

    const deleteDocument = (id) => {
        axios.delete(`${process.env.REACT_APP_SERVER}/auth/notice/delete`, { headers: { auth_token: token }, params: { noticeId: id } })
            .then(function (res) {
                if (res.status === 200) {
                    alert('공지 삭제 완료');
                    getNoticelist();

                } else {
                    alert('공지 삭제 실패');
                }
            })
    }

    const getNoticelistByTitle = () => {
        axios.post(`${process.env.REACT_APP_SERVER}/auth/notice/titlelist`, {}, { headers: { auth_token: token }, params: { title: title, page: page, size: 10 } })
            .then(function (res) {
                if (res.status === 200) {
                    setNlist(res.data.tlist);
                    setTotalItemsCount(res.data.totalCount);
                } else {
                    alert('제목으로 검색 실패');
                }
            })
    }

    const getNoticelistByWriter = () => {
        axios.post(`${process.env.REACT_APP_SERVER}/auth/notice/writerlist`, {}, { headers: { auth_token: token }, params: { writer: writer, page: page, size: 10 } })
            .then(function (res) {
                if (res.status === 200) {
                    setNlist(res.data.wlist);
                    setTotalItemsCount(res.data.totalCount);
                } else {
                    alert('이름으로 검색 실패');
                }
            })
    }

    return (
        <div className="main_body">
            <div className="record_table w_bg">
                <h2 className="noticetitle">{formType} 공지 사항</h2>
                <div className="notice_tab">
                    <button
                        className={`tablinks btn btn-outline-primary ${formType === '전체' ? 'active' : ''}`}
                        onClick={() => setFormType('전체')}
                    >
                        전체
                    </button>
                    <button
                        className={`tablinks btn btn-outline-primary ${formType === deptnm ? 'active' : ''}`}
                        onClick={() => setFormType(deptnm)}
                    >
                        부서공지
                    </button>
                    <div className="searchCss">

                        <label htmlFor="searchType"></label>
                        <select id="searchType" name="searchType" onChange={(e) => setSearchType(e.target.value)}>
                            <option value="title">제목</option>
                            <option value="writer">작성자</option>
                        </select>
                        <input type="text" id="searchValue" placeholder="검색 내용 입력.." />
                        <input type="button" value={"검색"} className="btn btn-secondary" onClick={searchTitle} />
                    </div>
                </div>
                <div className="record_table w_bg">
                    <div className="record_table_wrapper">
                        <div className="left_table">
                            <table className="record_rtable">
                                <thead>
                                    <tr>
                                        <th>분류</th>
                                        <th>글제목</th>
                                        <th>작성자</th>
                                        <th>작성일</th>
                                        <th>문서삭제</th>
                                    </tr>
                                </thead>
                                <tbody className="record_list">
                                    {nlist.filter(notice => formType === '전체' || notice.formtype === formType).map(notice => (
                                        <tr key={notice.id}>
                                            <td>{notice.formtype}</td>
                                            <td onClick={() => showdetails(notice.id)}>{notice.title}</td>
                                            <td>{notice.writername}</td>
                                            <td>{notice.startdt}</td>
                                            <td>
                                                {notice.writer.id === sessionStorage.getItem('loginId') && (
                                                    <button className="btn btn-danger btn-sm" onClick={() => deleteDocument(notice.id)}>  <i className="fa-solid fa-eraser"></i></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="notice_add_search">
                            <div className="notice_add">
                                <input type="button" value={"공지작성"} onClick={addnoti} />
                            </div>
                            <Pagination
                            activePage={page} // 현재 페이지
                            itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수
                            totalItemsCount={200} // 총 아이템 갯수
                            pageRangeDisplayed={5} // paginator의 페이지 범위
                            prevPageText={""}
                            nextPageText={""}
                            onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}