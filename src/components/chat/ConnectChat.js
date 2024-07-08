import './MainChat.css';
import './MainChatReset.css';
import React from "react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRef } from 'react';
import sendMessage from './SendMessage';

export default function ConnectChatRoom({ roomid, userid ,reloadRoom }) {
    const [messages, setMessages] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);
    const [inputs, setInputs] = useState({});
    const token = sessionStorage.getItem('token');
    const stompClientRef = useRef(null);


    useEffect(() => {
        if (chatRoom && chatRoom.chatRoomNames && chatRoom.chatRoomNames.length > 0) {
            setInputs({
                editableName: chatRoom.chatRoomNames[0].editableName.replace(/_/g, ' ').trim()
            });
        }
    }, [chatRoom]);

    useEffect(() => {
        if (roomid) {
            connect(roomid);
            centerChatRoom(roomid, userid);
        }
    }, [roomid]);

    const connect = (roomid) => {
        if (!roomid) {
            return;
        }
        var socket = new SockJS(`${process.env.REACT_APP_SERVER}/ws`, null, {
        });
        var stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;
        stompClient.connect({}, function () {
            var subscriptionId = 'sub-' + userid;
            console.log(subscriptionId);
            stompClient.subscribe('/room/' + roomid, function (messageOutput) {
                var message = JSON.parse(messageOutput.body);
                var cri = message[0].room.chatroomid;
                if (cri === roomid) {
                }
            }, { id: subscriptionId });

            stompClient.subscribe('/recent/update', function () {

            });
            loadMessages(roomid);
        });
    };

    const sendMessages = () => {
        sendMessage(roomid, userid, stompClientRef, loadMessages);
        reloadRoom();   
    };

    const loadMessages = () => {
        axios.get(`${process.env.REACT_APP_SERVER}/auth/chat/message/room/${roomid}`, { headers: { auth_token: token } })
            .then(function (res) {
                if (res.status === 200) {
                    setMessages(res.data.list);
                } else {
                    alert('메세지 로딩 실패');
                }
            })
    };

    const centerChatRoom = () => {
        axios.post(`${process.env.REACT_APP_SERVER}` + '/auth/chat/chatrooms/loadrooms/connect', {}, { headers: { auth_token: token }, params: { roomid: roomid, userid: userid } })
            .then(function (res) {
                if (res.status === 200) {
                    setChatRoom(res.data.chatroom);
                    console.log(res.data.chatroom);
                } else {
                    alert('채팅방 로딩 실패');
                }
            })
    }

    // 채팅방 참여자 정보 불러오기
    const memberInfo = () => {
        axios.get(`${process.env.REACT_APP_SERVER}` + '/auth/member/memberchatinfo', { headers: { auth_token: token } })
            .then(function (res) {
                if (res.status === 200) {

                } else {
                    alert('참여자 정보 로딩 실패')
                }
            })
    }

    const editRoomName = () => {
        axios.post(`${process.env.REACT_APP_SERVER}` + '/auth/chat/chatrooms/edit', {}, { headers: { auth_token: token }, params: { roomid: roomid, newRoomName: inputs.editableName } })
            .then(function (res) {
                if (res.status === 200) {
                    alert('변경 성공');
                } else {
                    alert('채팅방 이름 변경 실패');
                }
            })
    }

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }


    return (
        <div className="chatbox">
            <div className="modal-dialog-scrollable">
                <div className="modal-content">
                    {/* 채팅방 연결 화면, 채팅방 나가기 , 초대하기 */}
                    <div className="msg-head">
                        <div className="row">
                            <div className="col-8">
                                <div className="d-flex align-items-center" id="centerstyle">
                                    <a href="#" class="d-flex align-items-center">
                                        <div class="flex-shrink-0">
                                            <img class="img-fluid-center" src="/member/memberimg?memberimgnm=${imgName}" alt="user img" />
                                            <span class="active"></span>
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <input class="roomNameStyle" type="text" name="editableName" onChange={onChange} value={inputs.editableName} />
                                            <img class="img-chateditImg" src="/img/chat/chatedit.png" onClick={editRoomName} />
                                            <p></p>
                                            <div class="memberInfoCss" id="minfo" onmouseleave="exitMemberInfo()"></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="col-4">
                                <ul className="moreoption">
                                    <li className="navbar nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal2">초대</a></li>
                                            <li>
                                                <hr className="dropdown-divider" />
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
                                {messages.map((message, index) => (
                                    <li key={index} className={message.sender === userid ? 'sender' : 'reply'}>
                                        <div className="chat_img_wrapper">
                                        </div>
                                        <span className="senderName">{message.partid}</span>
                                        <p>{message.content}</p>
                                        <span className="time">
                                            {new Date(message.sendDate).toLocaleString('en-US', { timeZone: 'Asia/Seoul' })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 메세지전송, 업로드 */}
                    <div className="send-box">
                        <div>
                            <textarea id="message" className="form-control" aria-label="message…" placeholder="Write message…" maxlength="1000"></textarea>
                            <button type="button" id="sendButton" onClick={sendMessages}><i className="fa fa-paper-plane" aria-hidden="true"></i>전송</button>
                        </div>
                        <div className="send-btns">
                            <div className="attach">
                                <div className="button-wrapper">
                                    <span className="label">
                                        <img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/upload.svg" alt="image title" /> attached file
                                    </span>
                                    <input type="file" name="upload" id="upload" className="upload-box" placeholder="Upload File" aria-label="Upload File" />
                                </div>
                                <button type="button" id="sendButton" onclick="sendFileMessage(roomId)">업로드</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}