import React, { useState } from "react";
import LoginPage from "./login.css"

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">
            <h1>MR Login</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                {/* <label htmlFor="email">Username</label><br></br><br></br> */}
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="Username" placeholder="Username" id="email" name="email" />
                {/* <label htmlFor="password">Password</label><br></br><br></br> */}
                <br></br><br></br>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="Password" placeholder="Password" id="password" name="password" /><br></br>
                <br></br>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}