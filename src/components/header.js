import Navbar from './navbar'
import Social from './social'
import { getAuth, signOut } from 'firebase/auth'
import React from 'react'

export default function Header({ isAuthenticated, userName }) {

    const handleSignout = () => {
        const auth = getAuth()
        signOut(auth).then(() => {
            console.log('Signout successful')
        }).catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
        })
    }

    return (
        <header>
            {/* <h1>Bienvenue sur mon Portfolio</h1> */}
            {isAuthenticated &&
                <>
                    <div className='user-container'>
                        <h2>Hello, {userName}</h2>
                        <div className='signout-btn'>
                            <button className='button-signout' type='button' onClick={handleSignout}>Sign Out</button>
                        </div>
                    </div>
                </>
            }
            <div className='header'>
                <Navbar />
                <Social />
            </div>
        </header>
    )
}