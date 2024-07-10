import { Route, Routes } from "react-router-dom";
import ConnectChatRoom from "./components/chat/ConnectChat";
import LoadChatRoomsBySearch from "./components/chat/LoadChatRoomsBySearch";
import LoadChatRoomsView from "./components/chat/LoadChatRoomsView";
import MainChat from "./components/chat/MainChat";
import DocxList from "./components/docx/ReactList";
import MyRecord from "./components/record/MyRecord";
import Join from "./components/user/Join";
import Login from "./components/user/Login";
import Userinfo from "./components/user/Userinfo";
import Userlist from "./components/user/Userlist";
import DocxAdd from "./components/docx/AddReport";

export default function Router() {
    const token = sessionStorage.getItem('token');
    const type = sessionStorage.getItem('type');

    return (
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
            <Route path="/user/info" element={<Userinfo />}></Route>
            <Route path="/user/list" element={<Userlist />}></Route>

            <Route path="/myrecord" element={<MyRecord/>}></Route>
            <Route path="/dept-record" element={<MyRecord/>}></Route>
            <Route path="/admin-record" element={<MyRecord/>}></Route>
            <Route path="/mainchat" element={<MainChat/>}/>
            <Route path="/loadchatroom" element={<LoadChatRoomsView />}/>
            <Route path="/searchchatroom" element={<LoadChatRoomsBySearch/>}/>
            <Route path="/connectchatroom" element={<ConnectChatRoom/>}/>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/join" element={<Join/>}></Route>
            <Route path="/docx/docxlist" element={<DocxList/>}></Route>
            <Route path="/docx/addreport" element={<DocxAdd/>}></Route>
        </Routes>
    )
}