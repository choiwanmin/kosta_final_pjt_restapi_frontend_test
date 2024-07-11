import './header.css';

function Header() {
    const name = sessionStorage.getItem("usernm");
    const deptnm = sessionStorage.getItem("deptnm");
  return (
      <nav className="w_bg nav_top fix_top">
        <div className="header_wrapper">
            <div className="flex_center header_logo">
                <a className="logo_right" href="/">
                    <div className="loginBoxTitle header_text">HRD SYSTEM</div>
                </a>
            </div>
            <ul className="flex_center nav_right">
                <li>{name}</li>
                <li>
                    {
                        deptnm === "undefined" ?
                        null : deptnm
                    }
                </li>
                <li >
                    <img style={{borderRadius: "20px", width:"40px", height:"40px"}} />
                </li>
            </ul>
        </div>
     </nav>
  );
}

export default Header;
