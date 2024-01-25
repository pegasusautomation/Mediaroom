import React, { useState } from "react";
import "./login.css"

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
 
    const handleSubmit = (e) => {
        e.preventDefault();
        const validUsers = [
            { username: 'a@gmail.com', password: '123' },
            { username: 'raghavendra@gmail.com', password: '456' },
          ];
   
          const isValidUser = validUsers.some(user => user.username === email && user.password === pass);
   
          if (isValidUser) 
          {
             props.onFormSwitch('Routes');
          } else {
            alert('Invalid credentials. Please try again.');
            setEmail('');
            setPass('');
          }
        console.log(email);
    }
 
    return (
        <div className="auth-form-container">
        <h2>MR Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
            <br></br>
            <br></br>
            {/* <label htmlFor="email">email</label> */}
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
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