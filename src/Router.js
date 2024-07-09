import { Routes, Route } from "react-router-dom";
import Header from './components/common/Header';
import Leftnav from './components/common/Leftnav';
import Login from "./components/user/Login";
import Join from "./components/user/Join";
import Userinfo from "./components/user/Userinfo";
import Userlist from "./components/user/Userlist";
import MyRecord from "./components/record/MyRecord";
import MainChat from "./components/chat/MainChat";
import LoadChatRoomsView from "./components/chat/LoadChatRoomsView";
import LoadChatRoomsBySearch from "./components/chat/LoadChatRoomsBySearch";
import ConnectChatRoom from "./components/chat/ConnectChat";
import { useSelector } from "react-redux";
import NoticeList from "./components/notice/NoticeList";
import NoticeAdd from "./components/notice/NoticeAdd";
import Memberinfo from "./components/user/Memberinfo";

export default function Router() {
    let loginId = useSelector(state=>state.userInfo);    
    const token = sessionStorage.getItem('token');
    const type = sessionStorage.getItem('type');
    
    return (
        <>
        {loginId === null? null:
        <>
           <Header/>
            <Leftnav/>
        </>
        }

        <Routes>
            {/* Conditional Routes */}
            {!token ? (
                <Route path="/" element={<Login />} />
            ) : type === 'admin' ? (
                // <Route path="/index_admin" element={<Ahome />} />
                <Route path="/" />
            ) : (
                <Route path="/" />
            )}

            {/* Login route */}
            <Route path="/login" element={<Login />} />

            {/* Admin route */}
            {/* <Route path="/index_admin" element={<Ahome />} /> */}

            {/* Staff route */}
            {/* <Route path="/index_staff" element={<Shome />} /> */}

            {/* Add other routes as needed */}
            <Route path="/login" element={<Login />}></Route>
            <Route path="/user/join" element={<Join />}></Route>
            <Route path="/user/info/:userid" element={<Userinfo />}></Route>
            {/* <Route path="/user/edit/:userid" element={<Useredit />}></Route> */}
            <Route path="/user/list" element={<Userlist />}></Route>
            <Route path="/member/info/:userid" element={<Memberinfo />}></Route>
            <Route path="/myrecord" element={<MyRecord/>}></Route>
            <Route path="/dept-record" element={<MyRecord/>}></Route>
            <Route path="/admin-record" element={<MyRecord/>}></Route>
            <Route path="/mainchat" element={<MainChat/>}/>
            <Route path="/loadchatroom" element={<LoadChatRoomsView />}/>
            <Route path="/noticelist" element={<NoticeList/>}/>
            <Route path="/noticeadd" element={<NoticeAdd/>}/>
        </Routes>
        </>
    )
}