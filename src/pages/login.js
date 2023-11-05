import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

export default function SignIn() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSignIn = (e) => {
        e.preventDefault()
        const auth = getAuth()

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Signed in
                navigate('/')
            })
            .catch((error) => {
                const errorMessage = error.message.replace('Firebase: ', '')
                setError(errorMessage)
                console.log(errorMessage)
            })
    }

    return (
        <div className="login-card-container">
            <div className="card" >
                <h1 className="login-title">Sign In</h1>
                <form onSubmit={handleSignIn}>
                    <div className="login-container">
                        <label>Email</label>
                        <input
                            className="input p"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-container">
                        <label>Password</label>
                        <input
                            className="input p"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    {/* <button onClick={handleSignIn}>Sign In</button> */}
                    <button type="submit" className="button-ok">Sign In</button>
                </form>
            </div>
        </div>
    )
}