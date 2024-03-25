import { Helmet } from "react-helmet";
import { ThemeProvider } from "styled-components";
import Layout from "./components/Layout/Layout";
import { GlobalStyle } from "./styles/globalStyles";
import { darkTheme, lightTheme } from "./styles/theme";
import React ,{useState}from 'react';
import { BrowserRouter as  Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Certtable from "./managecert/certtable.js";
import "./Table.css";
import "./App.css";
import Servertable from "./manageserver/servertable.js";
import UserProfile from "./pages/UserProfile.js";
import ManagerProfile from "./pages/ManagerProfile.js";
import AdminProfile from "./pages/AdminProfile.js";
import TopbarPage from "./pages/TopbarPage.js";
import LoginHistory from "./pages/LoginHistory.js";
import AuthService from "./AuthService.js";
import Mrserverdetails from "./manageserver/mrserverdetails.js";

export const ThemeContext = React.createContext(null);
const App = () => {
  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const themeStyle = theme === 'light' ? lightTheme : darkTheme;

  const LoginDetails = [
      { email: 'parul.behal_EXT@mediakind.com',password: 'p123', role: 'admin', name: 'Parul Behal' },
      { email: 'yogesh.puranik_ext@mediakind.com', password: 'y123', role: 'manager', name: 'Yogesh Puranik' },
      { email: 'Raghavendra.Gandanahalli_EXT@MediaKind.com', password: 'r123', role: 'user', name: 'Raghavendra'},
      { email: 'kothakota.deepika_ext@mediakind.com', password: 'd123', role: 'user', name: 'Deepika'},
    ];

    const handleLogin =async (email,password) => {
      const user = LoginDetails.find(
        (user) => user.email === email && user.password === password);
    if(user){
    setIsLoggedIn(true);
    setUserData(user);
  }
  else{
    alert('Invalid login details');
  }
  try {
    // Call the login method from AuthService
    await AuthService.login(email, password);
    // Redirect or perform any other necessary actions
  } catch (error) {
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
            <Route exact path="/servers" className="bitrate">
                <Servertable userData={userData}/>
             </Route>
             <Route exact path="/planoservers">
                <Mrserverdetails userData={userData}/>
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
