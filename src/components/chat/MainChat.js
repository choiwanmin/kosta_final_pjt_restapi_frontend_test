import { useEffect, useState } from 'react';
import './MainChat.css';
import axios from 'axios';

export default function MainChat(){
    const[list,setList] = useState([]);
    const token = sessionStorage.getItem('token');
    const loginId = sessionStorage.getItem('loginId');

    useEffect(()=>{
        axios.post(`${process.env.REACT_APP_SERVER}` + '/auth/chat/chatrooms/loadrooms',{},{headers:{auth_token:token}, params:{userid:loginId}})
        .then(function(res){
            if(res.status === 200){
                setList(res.data.list);
            }else{
                alert('채팅방 불러오기 실패');
            }
        })
    },[]);



    return (
        <div className="main_body">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="chat-area">
                        {/* 채팅방 검색 및 목록 */}
                        <div className="chatlist">
                            <div className="modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="chat-header">
                                        {/* 채팅방 검색 , 초대 모달 창 */}
                                        <div className="msg-search"> 
                                            <input type="text" className="form-control" id="findGroupMember" placeholder="참여자이름으로 검색" aria-label="search" onkeypress="if(event.keyCode == 13){loadChatRoomsBySearch(this)}"/>                                       
           									       	 <a className="add" href="#">
              									 	  <img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/add.svg" alt="add" data-bs-toggle="modal" data-bs-target="#exampleModal"/>
          										 	 </a>        								   		        		 
                                        </div>

                                        {/* 1:1 단체방 탭 */}
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="Open-tab" data-bs-toggle="tab" data-bs-target="#Open" type="button" role="tab" aria-controls="Open" aria-selected="true">1:1</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="Closed-tab" data-bs-toggle="tab" data-bs-target="#Closed" type="button" role="tab" aria-controls="Closed" aria-selected="false">단체방</button>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* 채팅방 목록 출력란 open 1:1 close */}
                                    <div className="modal-body">
                                        <div className="chat-lists">
                                            <div className="tab-content" id="myTabContent">
                                                <div className="tab-pane fade show active" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                                                    <div className="chat-list" id="openstyle">
                                                        <a href="#" className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">                                                          
                                                                <h3></h3>
                                                                <p></p>
                                                            </div>
                                                        </a>
                                                    </div>       
                                                </div>
                                                <div className="tab-pane fade" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">
                                                    <div className="chat-list" id="closestyle">
                                                        <a href="#" className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">  
                                                                <h3></h3>
                                                                <p></p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>                                              
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="chatbox">
                            <div className="modal-dialog-scrollable">
                                <div className="modal-content">
                                    {/* 채팅방 연결 화면, 채팅방 나가기 , 초대하기 */}
                                    <div className="msg-head">
                                        <div className="row">
                                            <div className="col-8">
                                                <div className="d-flex align-items-center" id="centerstyle">
                                                    <span className="chat-icon"><img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/arroleftt.svg" alt="image title"/></span>
                                                    <div className="flex-grow-1 ms-3">                                                  
                                                        <h3></h3>
                                                        <p></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <ul className="moreoption">
                                                    <li className="navbar nav-item dropdown">
                                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                                                        <ul className="dropdown-menu">
                                                            <li><a className="dropdown-item" href="#"  data-bs-toggle="modal" data-bs-target="#exampleModal2">초대</a></li>
                                                            <li>
                                                                <hr className="dropdown-divider"/>
                                                            </li>
                                                            <li>
                                                            <a className="dropdown-item" href="#" id="outButton" onclick="checkGetOutRoom(roomId)">채팅방 나가기</a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* 채팅방 메세지 출력 칸 */}
                                    <div className="modal-body cat-content"> 
                                        <div className="msg-body">
                                            <ul id="chat-content">
                                              <li>
                                                <div className="chat_img_wrapper">
                                                  <img className="chatRoomImg" src="/img/chat/chatRoomImg.png" data-bs-toggle="modal" data-bs-target="#exampleModal"/>
                                                </div>
                                              
                                              </li>
                                            
                                              </ul>
                                        </div>
                                    </div>

                                    {/* 메세지전송, 업로드 */}
                                    <div className="send-box">
                                            <div>
                                            <textarea id="message" className="form-control" aria-label="message…" placeholder="Write message…" maxlength="1000"></textarea>
											<input type="hidden" id="sender" value="${userId1}"/>
											<input type="hidden" id="partid" value="${partId}"/>
                                            <button type="button" id="sendButton"><i className="fa fa-paper-plane" aria-hidden="true"></i>전송</button>
                                            </div>
                                        <div className="send-btns">
                                            <div className="attach">
                                                <div className="button-wrapper">
                                                    <span className="label">
                                                        <img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/upload.svg" alt="image title"/> attached file 
                                                    </span>
                                                    <input type="file" name="upload" id="upload" className="upload-box" placeholder="Upload File" aria-label="Upload File"/>
                                                </div>
                                                  <button type="button" id="sendButton" onclick="sendFileMessage(roomId)">업로드</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
    )
}