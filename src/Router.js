import { Routes, Route } from "react-router-dom";
import Login from "./components/user/Login";
import Join from "./components/user/Join";
import Userinfo from "./components/user/Userinfo";
import Userlist from "./components/user/Userlist";
import MyRecord from "./components/record/MyRecord";
import Memberinfo from "./components/user/Memberinfo";

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
            <Route path="/user/info/:userid" element={<Userinfo />}></Route>
            {/* <Route path="/user/edit/:userid" element={<Useredit />}></Route> */}
            <Route path="/user/list" element={<Userlist />}></Route>
            <Route path="/member/info/:userid" element={<Memberinfo />}></Route>
            <Route path="/myrecord" element={<MyRecord/>}></Route>
            <Route path="/dept-record" element={<MyRecord/>}></Route>
            <Route path="/admin-record" element={<MyRecord/>}></Route>
        </Routes>
    )
}