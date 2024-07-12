
import { Routes, Route } from "react-router-dom";
import Header from './components/common/Header';
import Leftnav from './components/common/Leftnav';
import Login from "./components/user/Login";
import Join from "./components/user/Join";
import Userinfo from "./components/user/Userinfo";
import Userlist from "./components/user/Userlist";
import DocxAdd from "./components/docx/AddReport";
import DocxList from "./components/docx/ReactList";
import ReportDetail from "./components/docx/ReportDetail";
import MyRecord from "./components/record/MyRecord";
import RecordAdmin from "./components/record/RecordAdmin";
import Dept from "./components/record/Dept"
import MainChat from "./components/chat/MainChat";
import LoadChatRoomsView from "./components/chat/LoadChatRoomsView";
import { useSelector } from "react-redux";
import NoticeList from "./components/notice/NoticeList";
import NoticeAdd from "./components/notice/NoticeAdd";
import Memberinfo from "./components/user/Memberinfo";
import Chartmain from "./components/charts/ChartMain";
import NoticeDetail from "./components/notice/NoticeDetail";
import Deptlist from "./components/corp/Deptlist";
import Joblvlist from "./components/corp/Joblvlist";

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
                <Route path="/" element={<Chartmain />}/>
            ) : (
                <Route path="/" element={<Chartmain />}/>
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
            <Route path="/dept/list" element={<Deptlist />}></Route>
            <Route path="/joblv/list" element={<Joblvlist />}></Route>
            <Route path="/member/info/:userid" element={<Memberinfo />}></Route>
            <Route path="/index" element={<Chartmain />}></Route>
            <Route path="/myrecord" element={<MyRecord/>}></Route>
            <Route path="/dept/record" element={<Dept/>}></Route>
            <Route path="/admin/record" element={<RecordAdmin/>}></Route>
            <Route path="/mainchat" element={<MainChat/>}/>
            <Route path="/messenger" element={<LoadChatRoomsView />}/>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/join" element={<Join/>}></Route>
            <Route path="/docxlist" element={<DocxList/>}></Route>
            <Route path="/addreport" element={<DocxAdd/>}></Route>
            <Route path="/auth/docx/getdocx/:formnum/:docxkey/:formtype" element={<ReportDetail/>}></Route>
            <Route path="/notice/list" element={<NoticeList/>}/>
            <Route path="/noticeadd" element={<NoticeAdd/>}/>
            <Route path="/noticedetail/:notid" element={<NoticeDetail/>}/>
            
        </Routes>
        </>
    )
}