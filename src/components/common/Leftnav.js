import React, { useEffect, useState } from "react";
import "./Leftnav.css";
import { Link, useNavigate } from "react-router-dom";

export default function Leftnav() {
    const navigate = useNavigate();
    const type = sessionStorage.getItem("type");
    const dept = sessionStorage.getItem("mgr_deptid");
    const memberid = sessionStorage.getItem("memberid");
    const loginId = sessionStorage.getItem("loginId");
    const aprov = sessionStorage.getItem("aprov");

    const logout = () => {
        sessionStorage.clear();
        navigate('/login');
        window.location.reload();
    }

    return (
        <nav class="w_bg nav_vertical left_wrapper">
            <div class="menu_wrapper">
                <ul class="nav_ul">
                    <li class="nav_li">
                        {type === "emp" ? <Emp dept={dept} memberid={memberid} aprov={aprov} /> : <Admin />}
                    </li>
                </ul>
            </div>
            <div className="left_footer">
                <Link to={"/user/info/" + loginId} className="out_link">
                    <div className="icon_wrapper">
                        <i className="fa-solid fa-gear"></i>
                    </div>
                    <span className="nav_link_text">설정</span>
                </Link>
                <a className="out_link" onClick={logout}>
                    <div className="icon_wrapper">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                    <span className="nav_link_text">로그아웃</span>
                </a>
            </div>
        </nav>
    )

}

function Emp(props) {
    const loginId = sessionStorage.getItem("loginId");
    // const [flag, setFlag] = useState(false);
    // console.log('props.aprov:' + props.aprov);
    // if (props.aprov === "1" && props.memberid != "undefined") {
    //     // setFlag(true);
    // }
    // console.log("aprov: " + flag)
    return (
        <>
            <p className="nav_main_title">HRM system</p>
            <ul>
                <li className="li_link">
                    <Link to="/" className="nav_link">
                        <div className="icon_wrapper">
                            <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
                        </div>
                        <span className="nav_link_text">홈</span>
                    </Link>
                </li>
                <li className="li_link">
                    <Link to={"/member/info/" + loginId} className="nav_link">
                        <div className="icon_wrapper">
                            <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                        </div>
                        <span className="nav_link_text">내 인사카드 관리</span>
                    </Link>
                </li>
                {
                    props.aprov === "1" && props.memberid !== "undefined" && (
                        <li className="li_link">
                            <Link to="/myrecord" className="nav_link">
                                <div className="icon_wrapper">
                                    <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 352h8.2c32.3-39.1 81.1-64 135.8-64c5.4 0 10.7 .2 16 .7V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM320 352H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H360.2C335.1 449.6 320 410.5 320 368c0-5.4 .2-10.7 .7-16l-.7 0zm320 16a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zM496 288c8.8 0 16 7.2 16 16v48h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H496c-8.8 0-16-7.2-16-16V304c0-8.8 7.2-16 16-16z" /></svg>
                                </div>
                                <span className="nav_link_text">출퇴근 관리</span>
                            </Link>
                        </li>
                    )
                }

                {
                    props.dept > 0 ?
                        <li class="li_link">
                            <Link to="/dept/record" class="nav_link">
                                <div class="icon_wrapper">
                                    <svg class="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
                                </div>
                                <span class="nav_link_text">부서 근태관리</span>
                            </Link>
                        </li>
                        : null
                }
                <li class="nav_li" style={{ paddingTop: "10px" }}>
                    <div>
                        <p className="nav_main_title">connect system</p>
                        <ul>
                            {
                                props.aprov === "1" && props.memberid !== "undefined" && (
                                    <li className="li_link">
                                        <Link to="/notice/list" className="nav_link">
                                            <div className="icon_wrapper">
                                                <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" /></svg>
                                            </div>
                                            <span className="nav_link_text">공지게시판</span>
                                        </Link>
                                    </li>
                                )
                            }
                            {
                                props.aprov === "1" && props.memberid !== "undefined" && (
                                    <li className="li_link">
                                        <Link to="/messenger" className="nav_link">
                                            <div className="icon_wrapper">
                                                <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" /></svg>
                                            </div>
                                            <span className="nav_link_text">메신저</span>
                                        </Link>
                                    </li>
                                )
                            }
                            {
                                props.aprov === "1" && props.memberid !== "undefined" && (
                                    <li className="li_link">
                                        <Link to="/docxlist" className="nav_link">
                                            <div className="icon_wrapper">
                                                <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" /></svg>
                                            </div>
                                            <span className="nav_link_text">문서함</span>
                                        </Link>
                                    </li>
                                    )
                            }
                        </ul>
                    </div>
                </li>
            </ul>
        </>
    )
}
function Admin() {
    return (
        <>
            <p className="nav_main_title">HRM system</p>
            <ul>
                <li className="li_link">
                    <Link to="/" className="nav_link">
                        <div className="icon_wrapper">
                            <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
                        </div>
                        <span className="nav_link_text">홈</span>
                    </Link>
                </li>
                <li class="li_link">
                    <Link to="/admin/record" class="nav_link">
                        <div class="icon_wrapper">
                            <svg class="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z" /></svg>
                        </div>
                        <span className="nav_link_text">사원 근태관리</span>
                    </Link>
                </li>
                <li className="li_link">
                    <Link to="/user/list" className="nav_link">
                        <div className="icon_wrapper">
                            <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM208 288h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z" /></svg>
                        </div>
                        <span className="nav_link_text">사용자목록</span>
                    </Link>
                </li>
                <li className="li_link">
                    <Link to="/dept/list" className="nav_link">
                        <div className="icon_wrapper">
                            <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M208 80c0-26.5 21.5-48 48-48h64c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-8v40H464c30.9 0 56 25.1 56 56v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H464c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-4.4-3.6-8-8-8H312v40h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H256c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V280H112c-4.4 0-8 3.6-8 8v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-30.9 25.1-56 56-56H264V192h-8c-26.5 0-48-21.5-48-48V80z" /></svg>
                        </div>
                        <span className="nav_link_text">부서목록</span>
                    </Link>
                </li>
                <li className="li_link">
                    <Link to="/joblv/list" className="nav_link">
                        <div className="icon_wrapper">
                            <svg className="nav_link_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M384 64c0-17.7 14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H448v96c0 17.7-14.3 32-32 32H320v96c0 17.7-14.3 32-32 32H192v96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h96V320c0-17.7 14.3-32 32-32h96V192c0-17.7 14.3-32 32-32h96V64z" /></svg>
                        </div>
                        <span className="nav_link_text">직급목록</span>
                    </Link>
                </li>
            </ul>
        </>

    )
}