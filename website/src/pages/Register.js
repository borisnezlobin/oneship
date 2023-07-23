import React, { useContext, useEffect, useState } from "react";
import logo from "../logo.svg";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAdditionalUserInfo, signInWithPopup, deleteUser, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import auth from "../util/firebaseConfig";
import CONFIG, { ERROR_TOAST_STYLES, SUCCESS_TOAST_STYLES } from "../util/config";
import { UserDataContext } from "../util/contexts";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const CreateAccountPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const next = decodeURIComponent(urlParams.get("continue"));
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { userData, setUserData } = useContext(UserDataContext);
    const [isNavigating, setIsNavigating] = useState(false); // prevent double nav

    const nav = useNavigate();

    useEffect(() => {
        if(userData && !isNavigating){
            setIsNavigating(true);
            nav(next ? next : "/feed");
        }
    }, [userData, isNavigating, nav, next]);

    const googleSignIn = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider).catch(err => {
            console.log(err);
            setLoading(false);
            return;
        });
        if(res === undefined){
            setLoading(false);
            return;
        }
        const user = res.user;
        if(user.email.split("@")[1] !== "pausd.us"){
            toast.error("Please use a PAUSD email", ERROR_TOAST_STYLES);
            deleteUser(user);
            setLoading(false);
            return;
        }
        if(!user){
            toast.error("Error creating account", ERROR_TOAST_STYLES);
            setLoading(false);
            return;
        }
        if(getAdditionalUserInfo(res).isNewUser){
            setPage(1);
        }else{
            // TODO: get user data and set it
        }
        setLoading(false);
    }

    const signInWithPassword = async () =>{
        const email = auth.currentUser.email;
        if(password.length < 6){
            toast.error("Password must be at least 6 characters", ERROR_TOAST_STYLES);
            return;
        }
        if(password !== confirmPassword){
            toast.error("Passwords do not match", ERROR_TOAST_STYLES);
            return;
        }

        setLoading(true);
        const data = {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            pfp: auth.currentUser.photoURL,
        }
        var cred = EmailAuthProvider.credential(email, password);
        linkWithCredential(auth.currentUser, cred).then(async (usercred) => {
            const user = usercred.user;
            const res = await fetch(CONFIG.SERVER_URL + "/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            }).catch((error) => {
                console.log("Error creating database entry", error);
                // TODO: sentry
                toast.error("Error creating account", ERROR_TOAST_STYLES);
                setLoading(false);
                return;
            });
            try{
                setIsNavigating(true);
                const json = await res.json();
                setUserData(json);
                nav(next ? next : "/feed");
                toast.success("Account created successfully!", SUCCESS_TOAST_STYLES);
            }catch(err){
                console.log(err);
                toast.success("Oops! Something went wrong on our side.", ERROR_TOAST_STYLES);
                // TODO: sentry
            }
            setLoading(false);
        }).catch((error) => {
            console.log("Account linking error", error);
            toast.error("Error creating account", ERROR_TOAST_STYLES);
            setLoading(false);
        });
    }

    if(loading){
        return (
            <div className="m-0 md:ml-64 h-full flex flex-col justify-center items-center">
                <div className="flex flex-col items-center justify-center">
                    <img src={logo} className="h-36 w-36" alt="logo" />
                    <h1 className="bigText">Create a OneShip account</h1>
                </div>
                <div className="h-8" />
                <LoadingSpinner />
            </div>
        )
    }

    if(page === 0){
        return (
            <div className="m-0 md:ml-64 h-full flex flex-col justify-center items-center">
                <div className="flex flex-col items-center justify-center">
                    <img src={logo} className="h-36 w-36" alt="logo" />
                    <h1 className="bigText text-center">Create a OneShip account</h1>
                </div>
                <div className="h-8" />
                <div className="flex flex-col items-center justify-center w-256">
                    <button className="btn w-256" onClick={googleSignIn}>
                        <img src="https://img.icons8.com/ios/50/000000/google-logo.png" alt="Google" className="h-5 w-5" />
                        <p>Continue with Google</p>
                    </button>
                    <div className="h-12" />
                    <p className="text-theme mb-2">
                        Already have an account?
                    </p>
                    <button className="btn w-256" onClick={() => {
                        setIsNavigating(true);
                        nav("/login?continue=" + next);
                    }}>
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if(page === 1){
        return (
            <div className="m-0 md:ml-64 h-full flex flex-col justify-center items-center">
                <div className="flex flex-col items-center justify-center">
                    <img src={logo} className="h-36 w-36" alt="logo" />
                    <h1 className="bigText">Create a OneShip account</h1>
                </div>
                <div className="h-8" />
                <form className="flex flex-col items-center justify-center gap-4">
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="h-4" />
                    <button className="btn" onClick={(e) => {
                        e.preventDefault();
                        signInWithPassword();
                    }}>
                        Create Account
                    </button>
                </form>
            </div>
        );
    }
}

export default CreateAccountPage;