import React, { useContext, useRef, useState } from "react";
// import { ThemeProvider } from 'styled-components';
import { ThemeContext } from "C:/Users/Kothakota.Deepika_EX/Mediaroom/src/App.js";
import {
    SDivider,
    SLink,
    SLinkContainer,
    SLinkIcon,
    SLinkLabel,
    SLinkNotification,
    SLogo,
    SSidebar,
    SSidebarButton,
    STheme,
    SThemeLabel,
    SThemeToggler,
    SToggleThumb,
} from "./styles";

import {
    AiFillSafetyCertificate,
    AiOutlineHome,
    AiOutlineLeft,
} from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { BsServer } from "react-icons/bs";

// import { ThemeContext } from 'styled-components'
import { useLocation } from "react-router-dom";

const Sidebar = ({userData}) => {
    const searchRef = useRef(null);
    const { setTheme, theme } = useContext(ThemeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();

 
    return (
      
        <SSidebar isOpen={sidebarOpen}>
            <>
                <SSidebarButton isOpen={sidebarOpen} onClick={() => setSidebarOpen((p) => !p)}>
                    <AiOutlineLeft />
                </SSidebarButton>
            </>
            <SLogo>
                <h1><br></br>MR</h1>
            </SLogo>
            <SDivider />
            {linksArray.map(({ icon, label, notification, to }) => (
                <SLinkContainer key={label} isActive={pathname === to}>
                    <SLink to={to} style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && (
                            <>
                                <SLinkLabel>{label}</SLinkLabel>
                                {/* if notifications are at 0 or null, do not display */}
                                {!!notification && (
                                    <SLinkNotification>{notification}</SLinkNotification>
                                )}
                            </>
                        )}
                    </SLink>
                </SLinkContainer>
            ))}
            <SDivider />
            {secondaryLinksArray.map(({ icon, label }) => (
                <SLinkContainer key={label}>
                    <SLink to="/loginhistory" style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && <SLinkLabel>{label}</SLinkLabel>}
                    </SLink>
                </SLinkContainer>
            ))}
            {/* <SDivider /> */}
            <STheme>
                {sidebarOpen && <SThemeLabel>Dark Mode</SThemeLabel>}
                <SThemeToggler
                    isActive={theme === "dark"}
                    onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}
                >
                    <SToggleThumb style={theme === "dark" ? { right: "1px" } : {}} />
                </SThemeToggler>
            </STheme>
        </SSidebar>
    );
};

const linksArray = [
  {
    // {userData && (
            label: "Profile",
            icon: <AiOutlineHome />,
            to: "/Profile",
    // )}
        },
    {
        label: "Home",
        icon: <AiOutlineHome />,
        to: "/home",
    },
    {
        label: "Servers",
        icon: <BsServer />,
        to: "/servers",
    },
    {
        label: "Certificates",
        icon: <AiFillSafetyCertificate />,
        to: "/certificates",
    },
];

const secondaryLinksArray = [
    {
        label: "Login History",
        icon: <MdLogout />,
        to:"/loginhistory"
    },
];

export default Sidebar;

// import {React} from 'react';
// import { Link } from 'react-router-dom';
// import 'C:/Users/Kothakota.Deepika_EX/Mediaroom/src/components/sidebar.css';

// const Sidebar = ({userData}) => {
//   return (
//     <div className="sidebar"><br></br><br></br><br></br>
//      {userData && (
//         // <div className="profile">
//         //   <p>{userData.name}</p>
//         //   <p>{userData.email}</p>
//         //   </div>
//           <Link to="/Profile">Profile</Link>
//      )}
//       <Link to="/home">Home</Link>
//       {/* <Link to="/logout">Logout</Link> */}
      
//       <Link to="/servers">Server</Link>
//       <Link to="/certificates">Certificates</Link>
//       <Link to="/loginhistory">LoginHistory</Link>
//       {/* <Link to="/login">Login</Link> */}
//       {/* <button onClick={toggleDarkMode}>
//           {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//         </button> */}
//         {/* {CURRENT_USER_TYPE} */}
//     </div>
//   );
// };

// export default Sidebar;
