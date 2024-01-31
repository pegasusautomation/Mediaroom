import React, { useState, useEffect } from "react";
import "./login.css"
import { useHistory } from "react-router-dom";

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [details, setData] = useState('');
    let data = [];

    const history = useHistory();
       
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validUsers = [
            { username: 'a@gmail.com', password: '123' },
            { username: 'raghavendra@gmail.com', password: '456' },
          ];
          
          const isValidUser = validUsers.some(user => user.username === email && user.password === pass);          if (isValidUser) 
          {
            // User login data
            data = [
                {
                    User: email,
                    LoggedInDate: new Date().toString(),
                }
              ]
             props.onFormSwitch('Routes');
          } else {
            alert('Invalid credentials. Please try again.');
            setEmail('');
            setPass('');
          }
        // Store user login data to google sheet
          try {
            const res = await fetch(
              "https://sheet.best/api/sheets/da498c34-41c5-452d-bb1f-a8dab2e5ea4a%",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );
            if (res.ok) {
              history.replace("/");
            } 
        } catch (error) {
                console.log(error);
              }
        
         
    }

    const getData = async () => {
        try {
          const res = await fetch(
            "https://sheet.best/api/sheets/da498c34-41c5-452d-bb1f-a8dab2e5ea4a"
          );
          const details = await res.json();
          setData(Object.keys(details).map((key) => details[key]));
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        getData();
      }, []);
 
    return (
        <div className="auth-form-container">
        <h2>MR Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
            <br></br>
            <br></br>
            {/* <label htmlFor="email">email</label> */}
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email"/>           
            {/* <label htmlFor="password">password</label> */}
            <br></br>
            <br></br>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <br></br>
            <br></br>
            <button type="submit" >Log In</button>
        </form>
        {/* <button className="link-btn" onClick={() => props.onFormSwitch('homepage')}>Don't have an account? Register here.</button> */}
    </div>
)
};

export default LoginPage;