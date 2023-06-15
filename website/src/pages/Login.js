import React, { useContext, useEffect, useState } from "react";
import logo from "../logo.svg";
import { useNavigate } from "react-router-dom";
import CONFIG from "../util/config";
import { UserDataContext } from "../util/contexts";

const LoginPage = () => {
    const { userData, setUserData } = useContext(UserDataContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const login = async () => {
        // verify email and password
        if(email.length < 1){
            // toast("Please enter an email", ERROR_TOAST_STYLES);
            return;
        }
        if(email.split("@")[1] != "pausd.us"){
            // toast("Please use a PAUSD email", ERROR_TOAST_STYLES);
            return;
        }
        if(!email.includes("@") || !email.includes(".")){
            // toast("Please enter a valid email", ERROR_TOAST_STYLES);
            return;
        }
        if(password.length < 1){
            // toast("Please enter a password", ERROR_TOAST_STYLES);
            return;
        }
        if(password.length < 6){
            // toast("Password must be at least 6 characters", ERROR_TOAST_STYLES);
            return;
        }

        const res = await fetch(CONFIG.SERVER_URL + "/api/login?email=" + email + "&password=" + password + "&yes=iknowthisisbad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });
        try{
            const json = await res.json();
            if(json.error){
                // toast(json.error, ERROR_TOAST_STYLES);
                return;
            }
            // toast("Logged in!", SUCCESS_TOAST_STYLES);
            setUserData(json);
            nav("/feed")
        }catch(err){
            console.log(err);
            console.log(res);
            // toast("Error logging in", ERROR_TOAST_STYLES);
            // TODO: sentry
        }
    };

    useEffect(() => {
        if(userData){
            nav("/feed");
        }
    }, [userData]);

    return (
        <div className="m-0 md:ml-64 h-full flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center">
                <img src={logo} className="h-36 w-36" alt="logo" />
                <h1 className="bigText">Login</h1>
            </div>
            <form className="flex flex-col items-center justify-center gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn" onClick={(e) => {
                    e.preventDefault();
                    login(email, password);
                }}>
                    Login
                </button>
            </form>
            <hr />
            <div className="h-8" />
            <div className="flex flex-col items-center justify-center w-256">
                <button className="btn w-256">
                    <img src="https://img.icons8.com/ios/50/000000/google-logo.png" alt="Google" className="h-5 w-5" />
                    <p>Google</p>
                </button>
                <button className="btn w-256" onClick={() => {
                    nav("/register");
                }}>
                    Create an account
                </button>
            </div>
        </div>
    )
}

export default LoginPage;