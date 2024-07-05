import { Routes,Route } from "react-router-dom";
import Login from "./components/user/Login";
import Join from "./components/user/Join";
import MyRecord from "./components/record/MyRecord";

export default function Router(){
    return(
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/user/join" element={<Join/>}></Route>
            <Route path="/myrecord" element={<MyRecord/>}></Route>
            <Route path="/dept-record" element={<MyRecord/>}></Route>
            <Route path="/admin-record" element={<MyRecord/>}></Route>
        </Routes>
    )
}