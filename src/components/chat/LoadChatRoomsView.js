import './MainChat.css';
import './MainChatReset.css';
import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export default function LoadChatRoomsView({ datas, userId1 }) {
    const [list, setList] = useState([]);
    const token = sessionStorage.getItem('token');
    const loginId = sessionStorage.getItem('loginId');

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_SERVER}` + '/auth/chat/chatrooms/loadrooms', {}, { headers: { auth_token: token }, params: { userid: loginId } })
            .then(function (res) {
                if (res.status === 200) {
                    setList(res.data.list);

                } else {
                    alert('채팅방 불러오기 실패');
                }
            })
    }, []);

    const searchName = (event) => {
        if (event.key === 'Enter') {
            const searchData = event.target.value.trim(); // 입력값 가져오기
            loadChatRoomsBySearch(searchData);
        }
    };

    const loadChatRoomsBySearch = (searchData) => {
        axios.post(`${process.env.REACT_APP_SERVER}` + '/auth/chat/chatrooms/loadrooms/search', {}, { headers: { auth_token: token }, params: { userName: searchData } })
            .then(function (res) {
                if (res.status === 200) {
                    alert('채팅방 검색 완료');
                    setList(res.data.list); //검색된 채팅방 리스트
                    // LoadChatRoomsView(res.data.list, loginId);
                } else {
                    alert('채팅방 불러오기 실패');
                }
            })
    }

    const connect = (roomid) => {
        var socket = new SockJS(`${process.env.REACT_APP_SERVER}/ws`, null, {
            headers: {
                'Authorization': `Bearer ${token}` // 적절한 인증 토큰 추가
            }
        });
        var stompClient = Stomp.over(socket);
        stompClient.connect({}, function () {
            var subscriptionId = 'sub-' + userId1;
            console.log(subscriptionId);
            stompClient.subscribe('/room/' + roomid, function (messageOutput) {
                var message = JSON.parse(messageOutput.body);
                var cri = message[0].room.chatroomid;
                if (cri === roomid) {
                    // showMessage(message);
                }
            }, { id: subscriptionId });

            stompClient.subscribe('/recent/update', function () {
                // Handle update if needed
            });
        });
    };

    return (
        <div className="main_body">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="chat-area">

                            <div className="chatlist">
                                <div className="modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="chat-header">
                                            {/* 채팅방 검색 , 초대 모달 창 */}
                                            <div className="msg-search">
                                                <input type="text" className="form-control" id="findGroupMember" placeholder="참여자이름으로 검색" aria-label="search" onKeyDown={searchName} />
                                                <a className="add" href="#">
                                                    <img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/add.svg" alt="add" data-bs-toggle="modal" data-bs-target="#exampleModal" />
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
                                        <div className="modal-body">
                                            <div className="chat-lists">
                                                <div className="tab-content" id="myTabContent">
                                                    <div className="tab-pane fade show active" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                                                        <div className="chat-list" id="openstyle">
                                                            {list.map((chatRoom, index) => (
                                                                <a key={index} href="#" className="d-flex align-items-center">
                                                                    <div className="flex-shrink-0">
                                                                        <img className="img-fluid-center" alt="user img" />
                                                                    </div>
                                                                    <div className="flex-grow-1 ms-3">
                                                                        <h3 onClick={() => connect(chatRoom.chatroomid)}>
                                                                            {chatRoom.chatRoomNames[0].editableName.replace(/_/g, ' ').trim()}
                                                                        </h3>
                                                                        <p>{chatRoom.recentMsg}</p>
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">
                                                        <div className="chat-list" id="closestyle">
                                                            {list.map((chatRoom, index) => (
                                                                <a key={index} href="#" className="d-flex align-items-center">
                                                                    <div className="flex-shrink-0">
                                                                        <img className="img-fluid-center" src="/member/memberimg?memberimgnm=${imgName}" alt="user img" />
                                                                    </div>
                                                                    <div className="flex-grow-1 ms-3">
                                                                        <h3 onClick={() => connect(chatRoom.chatroomid)}>
                                                                            {chatRoom.chatRoomNames[0].editableName.replace(/_/g, ' ').trim()}
                                                                        </h3>
                                                                        <p>{chatRoom.recentMsg}</p>
                                                                    </div>
                                                                </a>
                                                            ))}
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
            </div>
        </div>
    );
}