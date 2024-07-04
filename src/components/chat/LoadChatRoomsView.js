import './MainChat.css';
import './MainChatReset.css';
import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export default function LoadChatRoomsView({ data, userId1 }) {
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

    const connect = (roomid) => {
        // var roomid = chatRoom.chatroomid;
        var socket = new SockJS(`${process.env.REACT_APP_SERVER}/auth/ws`);
        var stompClient = Stomp.over(socket);

        stompClient.connect({ auth_token: token }, function () {
            var subscriptionId = 'sub-' + userId1;
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

                                        <div className="modal-body">
                                            <div className="chat-lists">
                                                <div className="tab-content" id="myTabContent">
                                                    <div className="tab-pane fade show active" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                                                        <div className="chat-list" id="openstyle">
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