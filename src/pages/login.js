import React, { useState } from "react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useDispatch } from 'react-redux'
import { setUserEmail } from '../rtk/userSlice'

const SignIn = () => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSignIn = () => {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user
                console.log(user.email)
                const userEmail = user.email
                dispatch(setUserEmail(userEmail))
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
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <p>{error}</p>}
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    );
};

export default SignIn;