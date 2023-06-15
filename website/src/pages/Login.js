import React, { useContext, useEffect, useState } from "react";
import logo from "../logo.svg";
import { useNavigate } from "react-router-dom";
import CONFIG, { ERROR_TOAST_STYLES, SUCCESS_TOAST_STYLES } from "../util/config";
import { UserDataContext } from "../util/contexts";
import { toast } from "react-hot-toast";

const LoginPage = () => {
    const { userData, setUserData } = useContext(UserDataContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const login = async () => {
        // verify email and password
        if(email.length < 1){
            toast.error("Please enter an email", ERROR_TOAST_STYLES);
            return;
        }
        if(email.split("@")[1] != "pausd.us"){
            toast.error("Please use a PAUSD email", ERROR_TOAST_STYLES);
            return;
        }
        if(!email.includes("@") || !email.includes(".")){
            toast.error("Please enter a valid email", ERROR_TOAST_STYLES);
            return;
        }
        if(password.length < 1){
            toast.error("Please enter a password", ERROR_TOAST_STYLES);
            return;
        }
        if(password.length < 6){
            toast.error("Password must be at least 6 characters", ERROR_TOAST_STYLES);
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
            console.log(json);
            if(json.error){
                //eek
                if(json.error.error.message == "INVALID_PASSWORD"){
                    toast.error("Incorrect password", ERROR_TOAST_STYLES);
                    return;
                }
                if(json.error.error.message == "EMAIL_NOT_FOUND"){
                    toast.error("No user exists with this email", ERROR_TOAST_STYLES);
                    return;
                }
                // TODO: sentry
                toast.error("Error logging in", ERROR_TOAST_STYLES);
                return;
            }
            toast.success("Logged in!", SUCCESS_TOAST_STYLES);
            setUserData(json);
            nav("/feed")
        }catch(err){
            console.log(err);
            console.log(res);
            toast.error("Error logging in", ERROR_TOAST_STYLES);
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
                    login();
                }}>
                    Login
                </button>
            </form>
            <hr />
            <div className="h-8" />
            <div className="flex flex-col items-center gap-2 justify-center w-256">
                <p className="text-center text-theme font-bold">
                    Or
                </p>
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