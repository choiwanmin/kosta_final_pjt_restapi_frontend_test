/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useHistory } from 'react-router-dom';

const ReportDetail = () => {
    const { formnum, docxkey, formtype } = useParams();
    const [doc, setDoc] = useState({});
    const [docxdetail, setDocxdetail] = useState({});
    const [isAuthorized, setIsAuthorized] = useState(false);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetchDocDetails();
        }
    }, [token]);
    const fetchDocDetails = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/auth/docx/getdocx`,{}, {
                headers: {
                    auth_token: token
                },params:{formnum:formnum, docxkey:docxkey, formtype:formtype}
            });
            setDoc(response.data);
            setDocxdetail(response.data.d);
            setIsAuthorized(response.data.flag); // 결재 권한 여부 설정
        } catch (error) {
            console.error('Error fetching document details', error);
        }
    };

    const approveDoc = async () => {
        if (confirm('문서를 결재하시겠습니까?')) {
            try {
                await axios.post(`${process.env.REACT_APP_SERVER}/auth/docx/approve`, null, {
                    headers: {
                        auth_token: token
                    },
                    params: {
                        docxkey: docxkey,
                        formtype: formtype
                    }
                });
                alert('문서가 성공적으로 결재되었습니다.');
                fetchDocDetails();
            } catch (error) {
                alert('문서 결재 중 오류가 발생했습니다. 다시 시도해 주세요.');
                console.error('Error approving document:', error);
            }
        } else {
            alert('결재가 취소되었습니다.');
        }
    };

    return (
        <div className="main_body">
            <div className="record_table w_bg">
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h3 className="font_b24 m_b2">보고서 상세 페이지</h3>
                        </div>
                        <div className="mb-3" style={{ display: 'table' }}>
                            <label className="form-label"><strong>결재 권한:</strong></label>
                            <ul className="list-unstyled">
                                {doc.docx && doc.docx.map((senior, index) => (
                                    <li key={index}>{senior.senior}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="record_table w_bg p-3">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label"><strong>문서 제목:</strong></label>
                                <input type="text" id="title" className="form-control" value={docxdetail.title || ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="writer" className="form-label"><strong>작성자:</strong></label>
                                <input type="text" id="writer" className="form-control" value={docxdetail.writer?.id || ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="enddt" className="form-label"><strong>기한:</strong></label>
                                <input type="text" id="enddt" className="form-control" value={docxdetail.enddt || ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="taskplan" className="form-label"><strong>업무 계획:</strong></label>
                                <textarea id="taskplan" className="form-control" value={docxdetail.taskplan || ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="taskprocs" className="form-label"><strong>업무 진행 과정:</strong></label>
                                <textarea id="taskprocs" className="form-control" value={docxdetail.taskprocs || ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label"><strong>결재 현황:</strong></label>
                                <input type="text" id="status" className="form-control" value={docxdetail.status === 1 ? '미승인' : (docxdetail.status === 2 ? '승인' : '알 수 없음')} readOnly />
                            </div>
                            {isAuthorized && (
                                <div className="mb-3">
                                    <button type="button" className="btn btn-primary" onClick={approveDoc}>결재</button>
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 text-center">
                            <Link to="/docxlist" className="btn btn-secondary">문서 리스트로 돌아가기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;