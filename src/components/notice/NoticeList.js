import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import './Pageing.css';


export default function NoticeList() {
    const [nlist, setNlist] = useState([]);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [searchType, setSearchType] = useState('title');
    const token = sessionStorage.getItem('token');


    const showdetails = (notid) => {
        window.location.href = `/noticedetail/${notid}`;
    }

    const handlePageChange = (page) => {
        setPage(page);
    };

    const searchTitle = () => {
        var valuett = document.getElementById('searchValue').value;
        if (searchType === 'title') {
            setTitle(valuett);
        } else if (searchType === 'writer') {
            setWriter(valuett);
        }
    };

    useEffect(() => {
        if (title && searchType === 'title') {
            getNoticelistByTitle();
        } else if (writer && searchType === 'writer') {
            getNoticelistByWriter();
        } else {
            getNoticelist();
        }
    }, [page, title, writer, searchType]);

    const getNoticelist = () => {
        axios.get(`${process.env.REACT_APP_SERVER}/auth/notice/pagelist`, { headers: { auth_token: token }, params: { page: page, size: 5 } })
            .then(function (res) {
                if (res.status === 200) {
                    setNlist(res.data.list);
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
        axios.post(`${process.env.REACT_APP_SERVER}/auth/notice/titlelist`, {}, { headers: { auth_token: token }, params: { title: title, page: page, size: 5 } })
            .then(function (res) {
                if (res.status === 200) {
                    setNlist(res.data.tlist);
                } else {
                    alert('제목으로 검색 실패');
                }
            })
    }

    const getNoticelistByWriter = () => {
        axios.post(`${process.env.REACT_APP_SERVER}/auth/notice/writerlist`, {}, { headers: { auth_token: token }, params: { writer: writer, page: page, size: 5 } })
            .then(function (res) {
                if (res.status === 200) {
                    setNlist(res.data.wlist);
                } else {
                    alert('이름으로 검색 실패');
                }
            })
    }

    return (
        <div className="main_body">
            <div className="record_table w_bg">
                <h2 className="noticetitle">공지 사항</h2>
                <div className="record_table w_bg">
                    <div className="record_table_wrapper">
                        <div className="left_table">
                            <table className="record_rtable">
                                <thead>
                                    <tr>
                                        <th>분류</th>
                                        <th>글제목</th>
                                        <th>내용</th>
                                        <th>작성자</th>
                                        <th>작성일</th>
                                        <th>문서삭제</th>
                                    </tr>
                                </thead>
                                <tbody className="record_list">
                                    {nlist.map(notice => (
                                        <tr key={notice.id}>
                                            <td>{notice.formtype}</td>
                                            <td onClick={() => showdetails(notice.id)}>{notice.title}</td>
                                            <td>{notice.content}</td>
                                            <td>{notice.writername}</td>
                                            <td>{notice.startdt}</td>
                                            <td>
                                                {notice.writer.id === sessionStorage.getItem('loginId') && (
                                                    <button className="btn btn-danger btn-sm" onClick={() => deleteDocument(notice.id)}>삭제</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="searchCss">
                            <label htmlFor="searchType"></label>
                            <select id="searchType" name="searchType" onChange={(e) => setSearchType(e.target.value)}>
                                <option value="title">제목</option>
                                <option value="writer">작성자</option>
                            </select>
                            <input type="text" id="searchValue" placeholder="검색 내용 입력.." />
                            <input type="button" value={"검색"} className="btn btn-secondary" onClick={searchTitle} />
                        </div>
                        <Link to="/noticeadd" className="noticebutton">
                            <input type="button" value={"공지작성"} />
                        </Link>
                        <Pagination
                            containerClassName={"pagination"}
                            activePage={page}
                            itemsCountPerPage={10}
                            totalItemsCount={200}
                            pageRangeDisplayed={5}
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}