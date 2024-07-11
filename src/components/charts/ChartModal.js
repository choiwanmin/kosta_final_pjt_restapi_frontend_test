import React, { useState } from "react";
import "../common/Leftnav.css";
import "../common/modal.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../../store";

export default function ChartModal(props) {
    const cid = props.taskid;
    const taskid = Number(cid);
    console.log(taskid);
    let dispatch = useDispatch();
    const [name, setName] = useState("");
    const [type, setType] = useState(1);
    const [userArr, setUserarr] = useState([]);
    const userList = useSelector(state => state.modalArr);
    const token = sessionStorage.getItem('token');

    const typeSelect = (e) => {
        setType(e.target.value);
    }
    const nameSearch = (e) => {
        setName(e.target.value);
    }
    const search = () => {
        axios.get(`${process.env.REACT_APP_SERVER}/member/getdeptby`, {
            params: {
                val: name, type: type
            }
        })
            .then(function (res) {
                if (res.status === 200) {
                    setUserarr(res.data.mlist);
                    console.log(res.data);
                } else {
                    alert('error')
                }
            })
    }

     const handleCheckboxChange = (userId, isChecked) => {
        if (isChecked) {
            dispatch(addUser(userId));
        } else {
            dispatch(removeUser(userId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(userList);
        console.log(taskid);
        await axios
        .post(`${process.env.REACT_APP_SERVER}/chart/share`, {
            userids:userList, taskid:taskid
        })
        .catch((err)=>{
            console.log("에러 원인 : "+err);
        });

    };

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered mem_modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">멤버 선택</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="list_line">
                            <table className="m20 table_w100">
                                <tr>
                                    <td>
                                        <select className="select_box" onChange={typeSelect}>
                                            <option value="1">부서이름</option>
                                            <option value="2">직원이름</option>
                                            <option value="3">직급</option>
                                        </select>
                                    </td>
                                    <td className="list_search_wrapper">
                                        <input className="list_input" type="text" onChange={nameSearch} />
                                        <button type="button" className="btn blue_btn list_search" onClick={search}>검색</button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                        <form className="modal_list" onSubmit={handleSubmit}>
                            <div className="modal_table_wrapper">
                                <table className="table_w100 modal_table">
                                    <thead className="list_line ">
                                        <tr>
                                            <td><input type="checkbox" /></td>
                                            <td className="w40 f600">Name</td>
                                            <td className="f600">E-mail</td>
                                        </tr>
                                    </thead>
                                    <tbody className="modal_body">
                                    {userArr.map((item, i) => {
                                            const isChecked = userList.includes(item.userid.id);
                                            return (
                                                <tr key={i} className="list_line">
                                                    <td className="list_ch list_flex">
                                                        <input
                                                            type="checkbox"
                                                            id={item.userid.id}
                                                            checked={isChecked}
                                                            onChange={(e) => handleCheckboxChange(item.userid.id, e.target.checked)}
                                                        />
                                                    </td>
                                                    <td className="form_td">
                                                        <p className="f600 list_name">{item.userid.usernm}</p>
                                                        <p className="f600 list_id">{item.userid.id}</p>
                                                        <div className="list_pos">
                                                            <span className="list_dept">{item.deptid ? item.deptid.deptnm : '정보 없음'}</span>
                                                            <span className="list_lv">{item.joblvid ? item.joblvid.joblvnm : '정보 없음'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="form_td list_flex">{item.email}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <input type="submit" value="선택" className="btn blue_btn" data-bs-dismiss="modal" />
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}