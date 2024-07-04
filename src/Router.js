import { Routes,Route } from "react-router-dom";
import Login from "./components/user/Login";
import Join from "./components/user/Join";
import MainChat from "./components/chat/MainChat";
import LoadChatRoomsView from "./components/chat/LoadChatRoomsView";
import LoadChatRoomsBySearch from "./components/chat/LoadChatRoomsBySearch";

export default function Router(){
    return(
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/join" element={<Join/>}></Route>
            <Route path="/mainchat" element={<MainChat/>}/>
            <Route path="/loadchatroom" element={<LoadChatRoomsView />}/>
            <Route path="/searchchatroom" element={<LoadChatRoomsBySearch/>}/>
        </Routes>
    )
}