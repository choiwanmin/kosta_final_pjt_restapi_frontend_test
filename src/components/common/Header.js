import './header.css';
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();
    const [isLoginPage, setIsLoginPage] = useState(true);
  
    useEffect(() => {
        if( location.pathname === "/login" || location.pathname === "/join" ){
            setIsLoginPage(false);
        }else{
            setIsLoginPage(true);
        }
    }, [location.pathname, setIsLoginPage]);
  if (isLoginPage) return null;
  return (
      <nav className="w_bg nav_top fix_top">
        <div className="header_wrapper">
            <div className="flex_center header_logo">
                <a className="logo_right" href="/">
                    <div className="loginBoxTitle header_text">HRD SYSTEM</div>
                </a>
            </div>
            <ul className="flex_center nav_right">
                <li>유저이름</li>
                <li>잡레벨</li>
                <li >
                    <img style={{borderRadius: "20px", width:"40px", height:"40px"}} />
                </li>
            </ul>
        </div>
     </nav>
  );
}

export default Header;
