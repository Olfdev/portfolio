import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

export default function SignIn() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        const auth = getAuth()

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Signed in
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                setError(errorMessage)
                console.log(errorCode, errorMessage)
            });
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p>{error}</p>}
                {/* <button onClick={handleSignIn}>Sign In</button> */}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};