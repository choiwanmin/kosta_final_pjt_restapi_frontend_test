import React from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRef } from 'react';
import sendMessage from './SendMessage';
import '../common/modal.css';
import { useNavigate } from "react-router-dom";

export default function ConnectChatRoom({ roomid, userid, reloadRoom, isInvite, setIsInvite }) {
    const [messages, setMessages] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);
    const [inputs, setInputs] = useState({});
    const [memberId, setMemberId] = useState([]);
    const [membername, setMembername] = useState([]);
    const token = sessionStorage.getItem('token');
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(true);
    const [file, setFile] = useState('');
    const [memberchatList, setMemberchatList] = useState({});
    const [jobchatList, setJobchatList] = useState({});
    const [page, setPage] = useState(1);
    const [checkMessage, setCheckMessage] = useState(true);
    const userList = useSelector(state => state.modalArr);
    const chatContentRef = useRef(null);
    const navigate = useNavigate();
    const[imgname, setImgname] = useState('');



    const handleScroll = () => {
        const chatContent = chatContentRef.current;
        if (!chatContent) return;
        const scrollTop = Math.round(chatContent.scrollTop);
        if (scrollTop === 0) {
            const previousScrollHeight = chatContent.scrollHeight;
            setPage((prevPage) => prevPage + 1);
            setTimeout(() => {
                const newScrollHeight = chatContent.scrollHeight;
                chatContent.scrollTop = newScrollHeight - previousScrollHeight;
            }, 150);
        }
    };

    useEffect(() => {
        if (chatRoom && chatRoom.name) {
            const name = chatRoom.name.split('_');
            const memId = name.filter(name => name !== chatRoom.chatRoomNames[0].host);
            setMemberId(memId);
        }
    }, [chatRoom]);

    useEffect(() => {
        loadMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);


    useEffect(() => {
        if (chatRoom && chatRoom.chatRoomNames && chatRoom.chatRoomNames.length > 0) {
            setInputs({
                editableName: chatRoom.chatRoomNames[0].editableName.replace(/_/g, ' ').trim()
            });
        }
    }, [chatRoom]);

    useEffect(() => {
        if (roomid) {
            disconnect();
            connect(roomid);
            centerChatRoom(roomid, userid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomid]);

    useEffect(() => {
        const chatContent = chatContentRef.current;
        if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const chatContent = chatContentRef.current;
        if (chatContent) {
            chatContent.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (chatContent) {
                chatContent.removeEventListener('scroll', handleScroll);
            }
        };
    }, [checkMessage]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    const handleMemberClick = (clickedMemberId) => {
        memberchatinfo(clickedMemberId);
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const loadMessages = (overwrite = false) => {
        if (!isConnected) {
            return;
        }
        axios.post(`${process.env.REACT_APP_SERVER}/auth/chat/message/room3`, {}, { headers: { auth_token: token }, params: { roomid: roomid, page: page } })
            .then(function (res) {
                if (res.status === 200) {
                    if (res.data.list.length === 0) {
                        setCheckMessage(false);
                    } else {
                        if (overwrite) {
                            setMessages(res.data.list);
                        } else {
                            setMessages(prevMessages => [...res.data.list, ...prevMessages]);
                        }
                    }
                } else {
                    alert('메세지 로딩 실패');
                }
            });
    };

    const sendMessages = () => {
        sendMessage(roomid, userid, stompClientRef, () => loadMessages(true));
        document.getElementById('message').value = '';
        reloadRoom();
    };

    const sendMessagesEnter = (event) => {
        const messagearea = document.getElementById('message');
        const messageValue = messagearea.value.trim();
        if (!messageValue) {
            return;
        }
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage(roomid, userid, stompClientRef, () => loadMessages(true));
            document.getElementById('message').value = '';
            reloadRoom();
        }
    }

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
            stompClient.subscribe('/room/' + roomid, function (messageOutput) {
                var message = JSON.parse(messageOutput.body);
                var cri = message[0].room.chatroomid;
                if (cri === roomid) {
                    loadMessages(roomid);
                }
            }, { id: subscriptionId });

            stompClient.subscribe('/recent/update', function () {

            });
            setIsConnected(true);
            loadMessages(roomid);
        });
    };

    const sendFileMessage = (roomid, userid, file) => {
        if (!file) {
            alert('파일을 선택해 주세요.');
            return;
        }

        const date = new Date();
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const seoulOffset = 9 * 3600000;
        const seoulTime = new Date(date.getTime() + timezoneOffset + seoulOffset);

        const formData = new FormData();
        formData.append('file', file);

        axios.post(`${process.env.REACT_APP_SERVER}/auth/chat/message/upload`, formData, {
            headers: { 'auth_token': token, 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                const message = {
                    'type': 'FILE',
                    'fileName': response.data.fileName,
                    'fileRoot': response.data.fileRoot,
                    'sender': userid,
                    'partid': userid,
                    'sendDate': seoulTime.toISOString()
                };
                stompClientRef.current.send(`/send/chat/message/` + roomid + '/' + page, {}, JSON.stringify(message));
                loadMessages(roomid);
            }
        )
            .catch(error => {
                console.error('Error uploading file:', error);
                alert('파일 업로드에 실패했습니다.');
            });


            setFile('');
    };

    const showFileMessage = (message) => {
        if (message.type === "FILE") {
            const fileType = message.fileName.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileType)) {
                return (
                    <img src={message.fileRoot} alt={message.fileName} style={{ width: '200px', height: '200px' }} />
                );
            } else {
                return (
                    <a href={message.fileRoot} download={message.fileName}>
                        {message.fileName}
                    </a>
                );
            }
        } else {
            return message.content && message.content.split('<br/>').map((content, index) => (
                <React.Fragment key={index}>
                    {content}
                    {index !== message.content.split('<br/>').length - 1 && <br />
                    }
                </React.Fragment>
            ));
        }
    };


    const centerChatRoom = () => {
        axios.post(`${process.env.REACT_APP_SERVER}/auth/chat/chatrooms/loadrooms/connect`, {}, { headers: { auth_token: token }, params: { roomid: roomid, userid: userid } })
            .then(function (res) {
                if (res.status === 200) {
                    setChatRoom(res.data.chatroom);
                    setMembername(res.data.chatroom.memberNames)
                    setImgname(`${process.env.REACT_APP_SERVER}/member/memberimg/` + res.data.chatroom.img);
                } else {
                    alert('채팅방 로딩 실패');
                }
            })
    }

    const editRoomName = () => {
        axios.post(`${process.env.REACT_APP_SERVER}/auth/chat/chatrooms/edit`, {}, { headers: { auth_token: token }, params: { roomid: roomid, newRoomName: inputs.editableName } })
            .then(function (res) {
                if (res.status === 200) {
                    alert('채팅방 이름 변경 성공');
                    reloadRoom();
                } else {
                    alert('채팅방 이름 변경 실패');
                }
            })
    }

    const getOutRoom = () => {
        axios.post(`${process.env.REACT_APP_SERVER}/auth/chat/chatrooms/out`, {}, { headers: { auth_token: token }, params: { roomid: roomid, page: 1 } })
            .then(function (res) {
                if (res.status === 200) {
                    alert('채팅방 나가기 성공');
                    disconnect();
                    navigate('/messenger', { replace: true });
                    window.location.reload();
                } else {
                    alert('채팅방 나가기 실패');
                }
            })
    }

    const disconnect = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect(() => {
                console.log('연결끊겼음');
                setIsConnected(false);
                setMessages([]);
                // reloadRoom();
            });
            stompClientRef.current = null;
        }
    };

    const memberchatinfo = (clickedMemberId) => {
        axios.post(`${process.env.REACT_APP_SERVER}/member/memberchatinfo`, {}, { params: { userid: clickedMemberId } })
            .then(function (res) {
                if (res.status === 200) {
                    setMemberchatList(res.data.member);
                    setJobchatList(res.data.jobL);
                } else {
                    alert('사용자 정보 조회 실패');
                }
            })
    }

    return (
        <>
            <div className="chatbox">
                <div className="modal-dialog-scrollable">
                    <div className="modal-content">
                        {/* 채팅방 연결 화면, 채팅방 나가기 , 초대하기 */}
                        <div className="msg-head">
                            <div className="row">
                                <div className="col-8">
                                    <div className="d-flex align-items-center">
                                        <a class="d-flex align-items-center">
                                            <div class="flex-shrink-0">
                                                <img className="img-fluid-center"
                                                    src={imgname}
                                                    alt="Profile Img"
                                                    style={{ width: '45px', height: '45px' }} />
                                                <span class="active"></span>
                                            </div>
                                            <div class="flex-grow-1 ms-3">
                                                <input class="roomNameStyle" type="text" name="editableName" onChange={onChange} value={inputs.editableName} />
                                                <i class="fa-solid fa-pen-to-square" onClick={editRoomName}></i>
                                                <div>
                                                    {membername.map((name, index) => (
                                                        <span key={index}>
                                                            <p className="membernameinfocss" type="button" data-bs-toggle="modal" data-bs-target={`#exampleModal${index}`} onClick={() => handleMemberClick(memberId[index])}>
                                                                {name}
                                                            </p>
                                                            <div className="modal fade" id={`exampleModal${index}`} tabIndex="-1" aria-labelledby={`exampleModalLabel${index}`} aria-hidden="true">
                                                                <div className="modal-dialog">
                                                                    <div className="connect_chat_modal-content">
                                                                        <div className="modal-header">
                                                                            <h5 className="modal-title" id={`exampleModalLabel${index}`}>사용자 정보</h5>
                                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            {memberchatList && (
                                                                                <table className="info-table">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td rowSpan="6">
                                                                                                <img 
                                                                                                    src={`${process.env.REACT_APP_SERVER}/member/memberimg/` + memberchatList.memberimgnm}
                                                                                                    alt="Profile Img"
                                                                                                    style={{ width: '80%', height: '80%' }} />

                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th>이름</th>
                                                                                            <td>{name}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th>E-mail:</th>
                                                                                            <td>{memberchatList.email}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th>번호:</th>
                                                                                            <td>{memberchatList.cpnum}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th>직무:</th>
                                                                                            <td>{jobchatList.joblvnm}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th>부서:</th>
                                                                                            <td>{/* <td> {memberchatList.deptid.deptnm}</td> */}</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            )}
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="button" className="btn blue_btn" data-bs-dismiss="modal">닫기</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    ))}
                                                </div>

                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <ul className="moreoption">
                                        <li className="navbar nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <a className="dropdown-item" alt="add" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setIsInvite(false)}>초대</a>
                                                </li>

                                                <li>
                                                    <hr className="dropdown-divider" />
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" id="outButton" onClick={getOutRoom}>채팅방 나가기</a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 채팅방 메세지 출력 칸 */}
                        <div className="chat-content3" ref={chatContentRef}>
                            <div className="msg-body">
                                <ul >
                                    {messages?.map((message, index) => (
                                        <li key={index} className={message.sender === userid ? 'sender' : 'reply'}>
                                            <div className="chat_img_wrapper">
                                            </div>
                                            <span className="senderName">{message.username}</span>
                                            <p>{showFileMessage(message)}</p>
                                            <span className="time">
                                                {new Date(message.sendDate).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }).substring(10, 16) + new Date(message.sendDate).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }).substring(19, 22)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 메세지전송, 업로드 */}
                        <div className="send-box">
                            <div className="send-boxstyle2">
                                <textarea id="message" className="form-control" aria-label="message…" placeholder="Write message…" maxlength="1000" onKeyDown={sendMessagesEnter}></textarea>
                                <button type="button" id="sendButton" onClick={sendMessages}><i className="fa fa-paper-plane" aria-hidden="true"></i>전송</button>
                            </div>
                            <div className="send-btns">
                                <div className="attach">
                                    <div className="button-wrapper">
                                        <span className="label">
                                            <img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/upload.svg" alt="image title" /> attached file
                                        </span>
                                        <input type="file" name="upload" id="upload" className="upload-box" placeholder="Upload File" aria-label="Upload File" onChange={handleFileChange} />
                                    </div>
                                    <div className="selectfilecss">
                                        <span className="filename"> 선택된 파일:{file.name}</span>
                                        <button type="button" id="sendFileButton" onClick={() => sendFileMessage(roomid, userid, file)}>업로드</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}