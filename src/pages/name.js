import { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'

export default function UpdateDisplayName() {
    const [newDisplayName, setNewDisplayName] = useState('')
    const auth = getAuth()

    const user = auth.currentUser

    const handleUpdateDisplayName = () => {
        if (user) {
            updateProfile(user, {
                displayName: newDisplayName,
            })
                .then(() => {
                    console.log('Display name updated successfully')
                })
                .catch(error => {
                    console.error('Error updating display name: ', error)
                })
        } else {
            console.error('No user is logged in.')
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder="New User Name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
            />
            <button onClick={handleUpdateDisplayName}>Update User Name</button>
        </div>
    )
}