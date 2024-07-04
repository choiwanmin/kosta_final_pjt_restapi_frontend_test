import { Routes,Route } from "react-router-dom";
import Login from "./components/user/Login";
import Join from "./components/user/Join";

export default function Router(){
    return(
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/join" element={<Join/>}></Route>
        </Routes>
    )
}