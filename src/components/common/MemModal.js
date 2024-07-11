import React, { useState } from "react";
import "./Leftnav.css";
import axios from "axios";
import "./modal.css";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from  "../../store";

export default function MemModal(){
    let dispatch = useDispatch();
    const [ name, setName ] = useState("");
    const [ type, setType ] = useState(1);
    const [ userArr, setUserarr] = useState([]);
    const userList = useSelector(state=>state.modalArr);

    const typeSelect = (e)=>{
        setType(e.target.value);
    }
    const nameSearch = (e)=>{
        setName(e.target.value);
    }
    const search = ()=>{
        axios.get(`${process.env.REACT_APP_SERVER}/member/getdeptby`, {
             params:{
                val:name,type:type
             }})
            .then(function (res) {
                if (res.status === 200) {
                    setUserarr(res.data.mlist);
                    console.log(res.data);
            
                } else {
                    alert('error')
                }
            })
    }

    const handleCheckboxChange = (userId) => {
        const isChecked = document.getElementById(userId).checked;
        if (isChecked) {
          dispatch(addUser(userId));
        } else {
          dispatch(removeUser(userId));
        }
    };

    return(
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                        <input className="list_input" type="text" onChange={nameSearch}/>
                        <button type="button" className="btn blue_btn list_search" onClick={search}>검색</button>
                        </td>
                    </tr>
                    </table>
                </form>
                <form className="modal_list" action="/member/test">
                    <div className="modal_table_wrapper">
                    <table className="table_w100 modal_table">
                    <thead className="list_line ">
                    <tr>
                        <td><input type="checkbox"/></td>
                        <td className="w40 f600">Name</td>
                        <td className="f600">E-mail</td>
                    </tr>
                    </thead>
                    <tbody className="modal_body">
                    {userArr.map((item, i) => (
                        <tr key={i} className="list_line">
                            <td  className="list_ch list_flex">
                                <input type="checkbox" 
                                val={item.userid.id}
                                id={item.userid.id}
                                onChange={() => handleCheckboxChange(item.userid.id)}/>
                            </td>
                            <td className="form_td">
                                <p class="f600 list_name">{item.userid.usernm}</p>
                                <p class="f600 list_id">{item.userid.id}</p>
                                <div class="list_pos">
                                    {/* <span class="list_dept">{item.deptid.deptnm }</span>
                                    <span class="list_lv">{item.joblvid.joblvnm }</span> */}
                                    {/*  */}
                                    <span className="list_dept">{item.deptid ? item.deptid.deptnm : ''}</span>
                                    <span className="list_lv">{item.joblvid ? item.joblvid.joblvnm : ''}</span>
                                </div>
                            </td>
                            <td className="form_td list_flex">{item.email }</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
                    <div className="modal-footer">
                    <input type="button" value="선택" className="btn blue_btn" data-bs-dismiss="modal"/>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </form>
                </div>
            </div>
            </div>
      </div>
    )

}