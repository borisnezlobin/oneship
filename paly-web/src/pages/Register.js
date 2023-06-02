import { useState } from "react";
import auth from "../util/firebaseConfig";
import { EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, deleteUser, getAdditionalUserInfo, linkWithCredential, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { ERROR_TOAST_STYLES, SUCCESS_TOAST_STYLES } from "../util/config";

// TODO: make this support signing in
// will be done during the big website rewrite
// rhymes
const Register = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider).catch(err => {
            console.log(err);
            setLoading(false);
            return;
        });
        const user = res.user;
        if(user.email.split("@")[1] != "pausd.us"){
            toast("Please use a PAUSD email", ERROR_TOAST_STYLES);
            deleteUser(user);
            setLoading(false);
            return;
        }
        if(!user){
            toast("Error creating account", ERROR_TOAST_STYLES);
            setLoading(false);
            return;
        }
        if(getAdditionalUserInfo(res).isNewUser){
            setPage(1);
        }
        setLoading(false);
    }

    const signInWithPassword = async () =>{
        const email = auth.currentUser.email;
        if(password.length < 6){
            toast("Password must be at least 6 characters", ERROR_TOAST_STYLES);
            return;
        }
        if(password != repeatPassword){
            toast("Passwords do not match", ERROR_TOAST_STYLES);
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
            console.log("Account linking success", user);
            await fetch("https://oneship.vercel.app/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            }).catch((error) => {
                console.log("Account linking error", error);
                toast("Error creating account", ERROR_TOAST_STYLES);
                setLoading(false);
                return;
            });
            toast("Account created successfully", SUCCESS_TOAST_STYLES);
            setLoading(false);
        }).catch((error) => {
            console.log("Account linking error", error);
            toast("Error creating account", ERROR_TOAST_STYLES);
            setLoading(false);
        });
    }

    if(loading){
        return (
            <div className="default-page flex max-height max-width">
                <h1 className="mediumText">Register</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if(page == 0){
        return (
            <div className="default-page flex max-height max-width">
                <h1 className="mediumText">Register</h1>
                <div style={{ height: 20 }} />
                <button className="btn btn-primary flex" onClick={signInWithGoogle}>
                    <p>Continue with Google</p>
                </button>
            </div>
        );
    }else{
        return (
            <div className="default-page flex max-height max-width">
                <h1 className="mediumText">Register</h1>
                <p>Enter the password you will use to sign in on the OneShip mobile app</p>
                <div style={{ height: 20 }} />
                <form onSubmit={e => {e.preventDefault(); signInWithPassword()}}>
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div style={{ height: 20 }} />
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        className="input"
                        value={repeatPassword}
                        onChange={e => setRepeatPassword(e.target.value)}
                    />
                    <div style={{ height: 20 }} />
                    <button className="btn btn-primary flex" type="submit">
                        <p>Create account</p>
                    </button>
                </form>
            </div>
        );
    }
}

export default Register;