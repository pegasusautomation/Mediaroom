import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "styled-components";
import Layout from "./components/Layout/Layout";
import Routes from "./Routes";
import { GlobalStyle } from "./styles/globalStyles";
import { darkTheme, lightTheme } from "./styles/theme";
import LoginPage from "./pages/LoginPage";

export const ThemeContext = React.createContext(null);

const App = () => {
    const [theme, setTheme] = useState("light");
    const themeStyle = theme === "light" ? lightTheme : darkTheme;
    const [currentForm, setCurrentForm] = useState('loginPage');
 
    const toggleForm = (formName) => {
      setCurrentForm(formName);
    }
    return (
        <ThemeContext.Provider value={{ setTheme, theme }}>
            <ThemeProvider theme={themeStyle}>
                <GlobalStyle />
                <Helmet>
                    <title>MediaRoom - Servers</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                        rel="stylesheet"
                    />
                </Helmet>
                <>
                <div>{
                    currentForm === "loginPage" ? <LoginPage onFormSwitch={toggleForm} /> : <Routes onFormSwitch={toggleForm}  />
                        // {/* <Routes /> */}
                    }
                        </div>
                </>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default App;
