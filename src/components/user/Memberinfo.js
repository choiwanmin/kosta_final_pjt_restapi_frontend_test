import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function MemberInfo() {
    const { userid } = useParams();
    const [mdto, setMdto] = useState({});
    const [edulist, setEdulist] = useState([]);
    const [expwoklist, setExpwoklist] = useState([]);
    const [originalMdto, setOriginalMdto] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [dlist, setDlist] = useState({});
    const [jlist, setJlist] = useState({});
    // const [selectedDept, setSelectedDept] = useState('');

    // const { userid, memberid, birthdt, email, cpnum, address, memberimgnm, hiredt, leavedt, deptid, joblvid, mgrid, eweinfo, memberimgf } = mdto;
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER}/member/memberinfo/` + userid, { headers: { auth_token: token } })
            // .then(response => {
            //     const data = response.data;
            //     setMdto(data.mdto);
            //     setEdulist(data.edulist);
            //     setExpwoklist(data.expwoklist);
            //     setDlist(data.dlist);
            //     setJlist(data.jlist);
            //     // console.log(sessionStorage.getItem('loginId'));
            //     // console.log(data.mdto?.memberimgnm);
            //     // if (mdto?.memberimgnm) {
            //     //     // setPreviewImage(`${process.env.REACT_APP_SERVER}/member/memberimg?memberimgnm=${data.mdto.memberimgnm}`);
            //     //     setPreviewImage(`${process.env.REACT_APP_SERVER}/member/memberimg/` + data.mdto.memberimgnm);
            //     // }
            //     // setSelectedDept(data.mdto?.deptid?.deptid);
            // })
            // .catch(error => {
            //     console.error('Error fetching member info:', error);
            //     // Handle error
            // });
            .then(function (res) {
                if (res.status === 200) {
                    setMdto(res.data.mdto);
                    setOriginalMdto(res.data.mdto || []);
                    setEdulist(res.data.edulist || []);
                    setExpwoklist(res.data.expwoklist || []);
                    setDlist(res.data.dlist || []);
                    setJlist(res.data.jlist || []);
                } else {
                    alert('error')
                }
            })
    }, [token, userid]);

    const onChange = (e) => {
        setMdto({
            ...mdto,
            [e.target.name]: e.target.value
        });
    };
    //
    //
    const [previewImage, setPreviewImage] = useState(`${process.env.REACT_APP_SERVER}/member/memberimg/` + mdto?.memberimgnm);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(`${process.env.REACT_APP_SERVER}/member/memberimg/` + mdto?.memberimgnm);
        }
    };

    // const handleDeptSelect = (event) => {
    //     const selectedOption = event.target.value;
    //     setSelectedDept(selectedOption);
    // };

    const [deptid, setDeptid] = useState(0);

    const deptSelect = (e) => {
        setDeptid(e.target.value)
    }

    //
    //
    const [inputFields, setInputFields] = useState([{ value: '' }]); // Initial input field state

    const handleAddField = () => {
        if (inputFields.length < 10) { // Maximum fields check
            setInputFields([...inputFields, { value: '' }]);
        }
    };

    const handleRemoveField = (index) => {
        const newFields = [...inputFields];
        newFields.splice(index, 1);
        setInputFields(newFields);
    };

    // const handleChange = (index, event) => {
    //     const newFields = [...inputFields];
    //     newFields[index].value = event.target.value;
    //     setInputFields(newFields);
    // };

    const editpgbtn = () => {
        setIsEditing(!isEditing);
    };

    const backbtn = () => {
        setIsEditing(false);
    }
    const resetbtn = () => {
        setMdto(originalMdto);
    };

    const editbtn = () => {
        let memberfdata = new FormData(document.getElementById('memberf'));
        // memberfdata.set('deptid',deptid);
        // console.log(memberfdata.get(''));
        if (memberfdata.get('memberid') === '') {
            memberfdata.set('memberid', 0);
        }
        for (let key of memberfdata.keys()) {
            console.log(key, ":", memberfdata.get(key));
        }
        axios.post(`${process.env.REACT_APP_SERVER}/member/memberadd`, memberfdata,
            { headers: { auth_token: token, "Content-Type": "multipart/form-data" } })
            .then(function (res) {//res.status:상태값, res.data:백에서 보낸 데이터
                // console.log(res.data.flag);
                if (res.status === 200) {
                    console.log(res.data.flag);
                    if (res.data.flag) {
                        alert('수정 완료');
                        // setIsEditing(false);
                        window.location.reload();
                    } else {
                        alert('수정 실패');
                        setIsEditing(!isEditing);
                    }
                } else {
                    alert('비정상 응답')
                }
            })
    }

    return (
        <div className="main_body">
            <div className="memberinfo_table w_bg">
                <div className="memberinfo_table_title">
                    <p>내 정보 페이지</p>
                </div>
                <div className="memberinfo_table_wrapper">
                    <h3>기본정보</h3>
                    <form id="memberf">
                        <table className="info-table">
                            <tbody>
                                <tr>
                                    <td rowSpan="3">
                                        <img
                                            src={previewImage}
                                            alt="Profile Img"
                                            style={{ width: '103px', height: '132px' }}
                                        /><br />
                                        {isEditing && (
                                            <input
                                                type="file"
                                                name="memberimgf"
                                                id="memberimgfid"
                                                onChange={handleFileChange}
                                            />
                                        )}
                                    </td>
                                    <th>입사일</th>
                                    {/* <td>{mdto.hiredt}</td> */}
                                    {/* <td th:text="${member?.hiredt}" id="hiredtid" style="display:none"></td> */}
                                    {/* <td></td> */}
                                    <td>{mdto?.hiredt}</td>

                                    {mdto?.leavedt && (
                                        <>
                                            <th>퇴사일</th>
                                            <td>{mdto?.leavedt}</td>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <th>이름</th>
                                    <td>{mdto?.userid?.usernm}</td>
                                    <th>사원번호</th>
                                    <td>{mdto?.memberid}</td>
                                </tr>
                                <tr>
                                    {/* <th>부서</th>
                                {!isEditing ? (
                                    <>
                                        <td>
                                            {mdto?.deptid?.deptid}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>
                                            <select id="deptslist" name="deptid" onchange="deptselect()">
                                            <option th:each="d : ${dlist}" th:text="${d.deptnm}" th:value="${d.deptid }"
                                                th:selected="${member?.deptid?.deptnm}==${d.deptnm}"
                                                th:data-dept="${d.mgrid.userid.usernm}"></option>
                                            </select>
                                        </td>
                                    </>
                                )}
                                <input type="hidden" id="mgr" /> */}
                                    <th>부서</th>
                                    {!isEditing ? (
                                        <td>{mdto?.deptid?.deptnm}</td>
                                    ) : (
                                        <td>
                                            {/* <select id="deptslist" onChange={handleDeptSelect} value={selectedDept}>
                                                {Array.isArray(dlist) && dlist.length > 0 && dlist.map(d => (
                                                    <option key={d.deptid} value={d}>
                                                        {d.deptnm}
                                                    </option>
                                                ))}
                                            </select> */}

                                            <select id="deptslist" name="dept" onChange={deptSelect}>
                                                <option>부서 선택</option>
                                                {dlist.map((dept, i) => (
                                                    <option value={dept.deptid}>{dept.deptnm}</option>
                                                ))}
                                            </select>
                                        </td>
                                    )}
                                    {/* <input type="hidden" name="mgrid" id="mgrid" value={selectedDept ? selectedDept.mgrid?.userid?.usernm ?? '' : ''} /> */}
                                    <th>직급</th>
                                    {!isEditing ? (
                                        <>
                                            <td>
                                                {mdto?.joblvid?.joblvnm}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <select id="joblvslist" name="joblvid">
                                                    {jlist.map((j) => (
                                                        <option key={j.deptid} value={j.joblvidx} selected={j.joblvid.joblvnm === j.joblvnm}>
                                                            {j.joblvnm}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/* <select id="joblvslist" name="joblvid">
                                            <option th:each="j : ${jlist}" th:text="${j.joblvnm}" th:value="${j.joblvidx}"
                                                th:selected="${member?.joblvid?.joblvnm}==${j.joblvnm}"></option>
                                            </select> */}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            </tbody>
                        </table>

                        <h3>개인정보</h3>
                        <table className="info-table">
                            <tbody>
                                <tr>
                                    <th>생년월일</th>
                                    <td>
                                        {!isEditing ? (
                                            <>
                                                {mdto?.birthdt}
                                            </>
                                        ) : (
                                            <>
                                                <input type="date" name="birthdt" id="birthdtid" value={mdto?.birthdt} onChange={onChange} />
                                            </>
                                        )}
                                    </td>
                                    <th>주소</th>
                                    <td colSpan="2">
                                        {!isEditing ? (
                                            <>
                                                {mdto?.address}
                                            </>
                                        ) : (
                                            <>
                                                <input type="text" name="address" id="addressid" value={mdto?.address} onChange={onChange} />
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>개인전화번호</th>
                                    <td>
                                        {!isEditing ? (
                                            <>
                                                {mdto?.cpnum}
                                            </>
                                        ) : (
                                            <>
                                                <input type="text" name="cpnum" id="cpnumid" value={mdto?.cpnum} onChange={onChange} />
                                            </>
                                        )}
                                    </td>
                                    <th>이메일</th>
                                    <td colSpan="2">
                                        {!isEditing ? (
                                            <>
                                                {mdto?.email}
                                            </>
                                        ) : (
                                            <>
                                                <input type="text" name="email" id="emailid" value={mdto?.email} onChange={onChange} />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>학력 정보</h3>
                        <table className="info-table">
                            <thead>
                                <tr>
                                    <th>학교명</th>
                                    <th>전공</th>
                                    <th>입학일</th>
                                    <th>졸업일</th>
                                    <th>학적상태</th>
                                    {isEditing && (
                                        <>
                                            <th></th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {edulist.map((e, index) => (
                                    <tr key={index}>
                                        {!isEditing ? (
                                            <>
                                                <td>{e.ewenm1}</td>
                                                <td>{e.ewenm2}</td>
                                                <td>{e.startdt}</td>
                                                <td>{e.enddt}</td>
                                                <td>{e.state}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td><input type="text" name="ewenm1" id="ewenm1id" value={e?.ewenm1} /></td>
                                                <td><input type="text" name="ewenm2" id="ewenm2id" value={e?.ewenm2} /></td>
                                                <td><input type="date" name="startdt" id="startdtid" value={e?.startdt} /></td>
                                                <td><input type="date" name="enddt" id="enddtid" value={e?.enddt} /></td>
                                                <td>
                                                    <select>
                                                        {/* <option value={} selected={e.state}>졸업</option> */}
                                                        <option>졸업</option>
                                                        <option>졸업유예</option>
                                                        <option>휴학</option>
                                                        <option>재적</option>
                                                        <option>자퇴</option>
                                                    </select>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {inputFields.map((field, index) => (
                                    <tr key={index}>
                                        {isEditing && (
                                            <>
                                                <td><input type="text" name="ewenm1" id="ewenm1id" /></td>
                                                <td><input type="text" name="ewenm2" id="ewenm2id" /></td>
                                                <td><input type="date" name="startdt" id="startdtid" /></td>
                                                <td><input type="date" name="enddt" id="enddtid" /></td>
                                                <td>
                                                    <select>
                                                        {/* <option value={} selected={e.state}>졸업</option> */}
                                                        <option>졸업</option>
                                                        <option>졸업유예</option>
                                                        <option>휴학</option>
                                                        <option>재적</option>
                                                        <option>자퇴</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button className="btn blue_memberbtn" onClick={() => handleRemoveField(index)}>삭제</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isEditing && (
                            <button className="btn blue_memberbtn" onClick={handleAddField}>추가하기</button>
                        )}

                        <h3>경력 정보</h3>
                        <table className="info-table">
                            <thead>
                                <tr>
                                    <th>근무회사</th>
                                    <th>근무부서</th>
                                    <th>입사일</th>
                                    <th>퇴사일</th>
                                    <th>퇴사사유</th>
                                    {isEditing && (
                                        <>
                                            <th></th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {expwoklist.map((e, index) => (
                                    <tr key={index}>
                                        {!isEditing ? (
                                            <>
                                                <td>{e.ewenm1}</td>
                                                <td>{e.ewenm2}</td>
                                                <td>{e.startdt}</td>
                                                <td>{e.enddt}</td>
                                                <td>{e.state}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td><input type="text" name="ewenm1" id="ewenm1id" value={e?.ewenm1} /></td>
                                                <td><input type="text" name="ewenm2" id="ewenm2id" value={e?.ewenm2} /></td>
                                                <td><input type="date" name="startdt" id="startdtid" value={e?.startdt} /></td>
                                                <td><input type="date" name="enddt" id="enddtid" value={e?.enddt} /></td>
                                                <td>
                                                    <select>
                                                        <option>선택 안함</option>
                                                        <option>근무조건</option>
                                                        <option>개인사유</option>
                                                        <option>자기개발</option>
                                                        <option>지병치료</option>
                                                    </select>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {inputFields.map((field, index) => (
                                    <tr key={index}>
                                        {isEditing && (
                                            <>
                                                <td><input type="text" name="ewenm1" id="ewenm1id" /></td>
                                                <td><input type="text" name="ewenm2" id="ewenm2id" /></td>
                                                <td><input type="date" name="startdt" id="startdtid" /></td>
                                                <td><input type="date" name="enddt" id="enddtid" /></td>
                                                <td>
                                                    <select>
                                                        <option>선택 안함</option>
                                                        <option>근무조건</option>
                                                        <option>개인사유</option>
                                                        <option>자기개발</option>
                                                        <option>지병치료</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button className="btn blue_memberbtn" onClick={() => handleRemoveField(index)}>삭제</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isEditing && (
                            <button className="btn blue_memberbtn" onClick={handleAddField}>추가하기</button>
                        )}
                        <input type='hidden' name="userid" value={userid} />
                        <input type='hidden' name="memberid" value={mdto?.memberid} />
                    </form>

                    <div className="memberinfo_admin_menu">
                        {/* {!isEditing && ((mdto?.memberid == null && sessionStorage.getItem('loginId') === userid) || sessionStorage.getItem('type') === 'admin') ? (
                            <>
                                <button type="button" className="btn blue_memberbtn" id="usereditpgbtnid" onClick={editpgbtn}>
                                    내정보수정페이지이동버튼
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="submit" className="btn blue_memberbtn" id="usereditbtnid" onClick={editbtn}>
                                    내정보수정버튼
                                </button>
                                <button type="button" className="btn blue_memberbtn" onClick={resetbtn}>
                                    취소
                                </button>
                                <button type="button" className="btn blue_memberbtn" onClick={backbtn}>
                                    되돌아가기
                                </button>
                            </>
                        )} */}
                        {((mdto?.memberid == null && sessionStorage.getItem('loginId') === userid) || sessionStorage.getItem('type') === 'admin') && (
                            !isEditing ? (
                                <>
                                    <button type="button" className="btn blue_memberbtn" id="usereditpgbtnid" onClick={editpgbtn}>
                                        내정보수정페이지이동버튼
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type="submit" className="btn blue_memberbtn" id="usereditbtnid" onClick={editbtn}>
                                        내정보수정버튼
                                    </button>
                                    <button type="button" className="btn blue_memberbtn" onClick={resetbtn}>
                                        취소
                                    </button>
                                    <button type="button" className="btn blue_memberbtn" onClick={backbtn}>
                                        되돌아가기
                                    </button>
                                </>
                            )
                        )}
                    </div>
                    {/* <input type="hidden" name="id" value={user.id} /><br /> */}
                </div>
            </div>
        </div>
    );
}
