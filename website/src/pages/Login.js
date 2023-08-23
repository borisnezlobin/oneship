import React, { useContext, useEffect, useState } from "react";
import logo from "../logo.svg";
import { useNavigate } from "react-router-dom";
import CONFIG, { ERROR_TOAST_STYLES, SUCCESS_TOAST_STYLES } from "../util/config";
import { UserDataContext } from "../util/contexts";
import { toast } from "react-hot-toast";

const LoginPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const next = decodeURIComponent(urlParams.get("continue"));
    const { userData, setUserData } = useContext(UserDataContext);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isNavigating, setIsNavigating] = useState(false); // prevent double nav
    const nav = useNavigate();

    const login = async () => {
        if(loading) return;

        setLoading(true);
        // verify email and password
        if(email.length < 1){
            toast.error("Please enter an email", ERROR_TOAST_STYLES);
            setLoading(false);
            return;
        }
        if(email.split("@")[1] !== "pausd.us"){
            toast.error("Please use a PAUSD email", ERROR_TOAST_STYLES);
            setLoading(false);
            return;
        }
        if(!email.includes("@") || !email.includes(".")){
            toast.error("Please enter a valid email", ERROR_TOAST_STYLES);
            setLoading(false);
            return;
        }
        if(password.length < 1){
            toast.error("Please enter a password", ERROR_TOAST_STYLES);
            setLoading(false);
            return;
        }
        if(password.length < 6){
            toast.error("Password must be at least 6 characters", ERROR_TOAST_STYLES);
            setLoading(false);
            return;
        }

        const res = await fetch(CONFIG.SERVER_URL + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.trim(),
                password: password,
                ua: navigator.userAgent ? navigator.userAgent : "web"
            })
        });
        try{
            const json = await res.json();
            if(json.error){
                //eek
                if(json.error.error.message === "INVALID_PASSWORD"){
                    toast.error("Incorrect password!", ERROR_TOAST_STYLES);
                    setLoading(false);
                    return;
                }
                if(json.error.error.message === "EMAIL_NOT_FOUND"){
                    toast.error("No user exists with this email!", ERROR_TOAST_STYLES);
                    setLoading(false);
                    return;
                }
                // TODO: sentry
                toast.error("Error logging in", ERROR_TOAST_STYLES);
                setLoading(false);
                return;
            }
            setLoading(false);
            toast.success("Logged in!", SUCCESS_TOAST_STYLES);
            setIsNavigating(true);
            nav(next && next !== "null" ? next : "/feed");
            setUserData(json);
            localStorage.setItem("creds", JSON.stringify({
                email: email.trim(),
                password: password,
                yes: "iknowthisisbad"
            }));
        }catch(err){
            setLoading(false);
            console.log(err);
            console.log(res);
            toast.error("Error logging in", ERROR_TOAST_STYLES);
            // TODO: sentry
        }
    };

    useEffect(() => {
        if(userData && !isNavigating){
            setIsNavigating(true);
            nav(next && next !== "null" ? next : "/feed");
        }
    }, [userData, nav, next, isNavigating]);

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
                    {loading ? "..." : "Log in"}
                </button>
            </form>
            <hr />
            <div className="h-8" />
            <div className="flex flex-col items-center gap-2 justify-center w-256">
                <p className="text-center text-theme font-bold">
                    Or
                </p>
                <button className="btn w-256" onClick={() => {
                    setIsNavigating(true);
                    nav("/register?continue=" + encodeURIComponent(next && next !== "null" ? next : "/feed"));
                }}>
                    Create an account
                </button>
            </div>
        </div>
    )
}

export default LoginPage;