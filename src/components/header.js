import { getAuth, signOut } from 'firebase/auth';
import React from 'react';

export default function Header({ isAuthenticated, userName }) {

    const handleSignout = () => {
        const auth = getAuth()
        signOut(auth).then(() => {
            console.log('Signout successful')
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        })
    }

    return (
        <header>
            <p>Bienvenue sur mon Portfolio</p>
            {isAuthenticated &&
                <>
                    <p>Hello, {userName}</p>
                    <div className='signout-btn'>
                        <p onClick={handleSignout}>Sign Out</p>
                    </div>
                </>
            }

        </header>
    )
}