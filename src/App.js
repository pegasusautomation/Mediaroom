
 import { Helmet } from "react-helmet";
 import { ThemeProvider } from 'styled-components';
import Layout from "./components/Layout/Layout";
 import { GlobalStyle } from "./styles/globalStyles";
 import { darkTheme, lightTheme } from "./styles/theme";
import React ,{useState}from 'react';
import { BrowserRouter as  Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import Certtable from "./certtable.js";
import "./Table.css";
 import 'C:/Users/Kothakota.Deepika_EX/Mediaroom-copy/src/App.css';
import Servertable from "./manageserver/servertable.js";
import UserProfile from 'C:/Users/Kothakota.Deepika_EX/Mediaroom/src/pages/UserProfile.js';
import ManagerProfile from 'C:/Users/Kothakota.Deepika_EX/Mediaroom/src/pages/ManagerProfile.js';
import AdminProfile from 'C:/Users/Kothakota.Deepika_EX/Mediaroom/src/pages/AdminProfile.js';
import TopbarPage from 'C:/Users/Kothakota.Deepika_EX/Mediaroom/src/pages/TopbarPage.js';
import LoginHistory from 'C:/Users/Kothakota.Deepika_EX/Mediaroom/src/pages/LoginHistory.js'
import AuthService from 'C:/Users/Kothakota.Deepika_EX/Mediaroom/src/AuthService.js'


// const User_types={
//   USER:"User",
//   MANAGER:"Manager",
//   ADMIN:"Admin"
// }
// const CURRENT_USER_TYPE=User_types.MANAGER;
 export const ThemeContext = React.createContext(null);
const App = () => {
  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  // const [userRole, setUserRole] = useState(null);
  const themeStyle = theme === 'light' ? lightTheme : darkTheme;

  const LoginDetails = [
      { email: 'u@gmail.com',password: 'u123', role: 'user', name: 'Deepika' },
      { email: 'm@gmail.com', password: 'm123', role: 'manager', name: 'Manager' },
      { email: 'a@gmail.com', password: 'a123', role: 'admin', name: 'Admin'},
    ];

    // const CURRENT_USER_TYPE=LoginDetails.role;
    // console.log(CURRENT_USER_TYPE);
    const handleLogin =async (email,password) => {
      const user = LoginDetails.find(
        (user) => user.email === email && user.password === password);
        // const USER_TYPE=LoginDetails.role;
    // Add your authentication logic here
    // For simplicity, setting isLoggedIn to true
    // const LoggedRole=userData.role
    // localStorage.setItem('isLoggedIn', 'true');
  // localStorage.setItem('userRole', role);
    if(user){
    setIsLoggedIn(true);
    setUserData(user);
    // setUserRole(user.role);
    // const CURRENT_USER_TYPE={CURRENT_USER_TYPE}
    // console.log(userRole);
  }
  else{
    alert('Invalid login details');
  }
  try {
    // Call the login method from AuthService
    await AuthService.login(email, password);
  console.log("hello");
    // Redirect or perform any other necessary actions
  } catch (error) {
    console.log("hello world");
    console.error('Login failed:', error.message);
  }
};
// useEffect(() => {
//   // Check if authentication token is present in localStorage
//   const authToken = localStorage.getItem('authToken');
//   setIsLoggedIn(!!authToken);
// }, []);

  // const history = useHistory();
  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
      <GlobalStyle />
        <Helmet>
          <title>MediaRoom - Servers</title>
        </Helmet>
    {/* <Router> */}
      
      <div className="app">
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) :(
          <>
        <TopbarPage  userData={userData}/>
        <Layout userData={userData}>
        {/* <Sidebar userRole={userRole} userData={userData}/> */}
        <div className="content">
          <Switch>
          {/* <Route path="/home" component={HomePage} />  */}
          <Route exact path="/home">
               <HomePage/>
            </Route>
            {/* <Route path="/login" component={LoginPage} />  */}
            <Route exact path="/servers">
                <Servertable userData={userData}/>
             </Route>
            <Route exact path="/certificates">
               <Certtable userData={userData}/>
            </Route>
            <Route exact path="/loginhistory">
               <LoginHistory/>
            </Route>
            <Route path="/profile">
                  {userData.role === 'user' && <UserProfile userData={userData}/>}
                  {userData.role === 'manager' && <ManagerProfile userData={userData}/>}
                  {userData.role === 'admin' && <AdminProfile userData={userData}/>}
                </Route>
          </Switch>
         </div>
          </Layout>
         </>
        )}
       </div>
     {/* </Router> */}
     </ThemeProvider>
    </ThemeContext.Provider>
  );
};


export default App;
