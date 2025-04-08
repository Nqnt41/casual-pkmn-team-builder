import { auth, googleProvider } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email);
    console.log(auth?.currentUser?.photoUrl);

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        catch (err) {
            console.error("auth.js signIn - " + err); // 23:36
        }
    }

    const googleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        }
        catch (err) {
            console.error("auth.js googleSignIn - " + err); // 23:36
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
        }
        catch (err) {
            console.error("auth.js logout - " + err); // 23:36
        }
    }

    return (
        <div>
            <input
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder="Password..."
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={signIn}>Sign In</button>
            <button onClick={googleSignIn}>Sign In With Google</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};