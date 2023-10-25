import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { addDoc } from '@firebase/firestore'
import { collref, imagesRef } from '../firebase/firebase'
import { getAuth, signOut } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import fr from 'date-fns/locale/fr'
import 'react-datepicker/dist/react-datepicker.css'

export default function Admin() {
    registerLocale('fr', fr)

    const userName = useSelector((state) => state.user.username)

    const titleRef = useRef()
    const descriptionRef = useRef()
    const weblinkRef = useRef()
    const githublinkRef = useRef()

    const [desktopScreenshot, setDesktopScreenshot] = useState(null)
    const [mobileScreenshot, setMobileScreenshot] = useState(null)
    const [date, setDate] = useState(new Date())
    const [selectedIcons, setSelectedIcons] = useState([])

    const icons = [
        'CSS 3',
        'Express.js',
        'HTML 5',
        'JavaScript',
        'Google Lighthouse',
        'MongoDB',
        'Node.js',
        'React',
        'Redux, Redux Toolkit',
        'WAVE',
    ];

    const handleIconClick = (icon) => {
        // Toggle the selection state of the icon
        if (selectedIcons.includes(icon)) {
            setSelectedIcons(selectedIcons.filter((i) => i !== icon))
        } else {
            setSelectedIcons([...selectedIcons, icon])
        }
    }

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

    const captureScreenshots = async (url) => {
        try {
            const response = await fetch('http://localhost:3001/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            })

            if (response.ok) {
                const data = await response.json()
                setDesktopScreenshot(data.desktopScreenshot)
                setMobileScreenshot(data.mobileScreenshot)
            } else {
                console.error('Failed to capture screenshots:', response.status)
            }
        } catch (error) {
            console.error('Error capturing screenshots:', error)
        }
    }

    // const handleSubmit = async () => {
    async function handleSubmit() {
        try {
            // Convert the selectedIcons array to an array of strings
            const selectedIconsArray = selectedIcons.map(icon => icon)

            //set metadata to image/png
            const metadata = {
                contentType: 'image/png',
            }

            // Convert base64 to bytes
            const desktopImageBytes = Uint8Array.from(atob(desktopScreenshot), c => c.charCodeAt(0))
            const mobileImageBytes = Uint8Array.from(atob(mobileScreenshot), c => c.charCodeAt(0))

            // Upload Desktop Image
            const desktopImageRef = ref(imagesRef, `${Date.now()}-desktop.png`)
            const desktopUploadTask = uploadBytes(desktopImageRef, desktopImageBytes, metadata)

            // Upload Mobile Image
            const mobileImageRef = ref(imagesRef, `${Date.now()}-mobile.png`)
            const mobileUploadTask = uploadBytes(mobileImageRef, mobileImageBytes, metadata)

            // Wait for both uploads to complete
            await Promise.all([desktopUploadTask, mobileUploadTask])

            // Get download URLs
            const desktopDownloadURL = await getDownloadURL(desktopImageRef)
            const mobileDownloadURL = await getDownloadURL(mobileImageRef)

            // Construct the data object
            const data = {
                date: date.getTime(),
                title: titleRef.current.value,
                description: descriptionRef.current.value,
                images: {
                    desktop: desktopDownloadURL,
                    mobile: mobileDownloadURL,
                },
                tech: selectedIconsArray,
                weblink: weblinkRef.current.value,
                githublink: githublinkRef.current.value,
            }

            // Add the data to Firestore
            await addDoc(collref, data)
        } catch (error) {
            console.error('Error handling form submission:', error)
        }
    }

    return (
        <>
            <h1>Hello, {userName}</h1>
            <form className="form-admin" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <DatePicker
                    locale="fr"
                    selected={date}
                    onChange={(selectedDate) => setDate(selectedDate)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Date"
                />
                <input type="text" ref={titleRef} placeholder="Title" />
                <input type="text" ref={descriptionRef} placeholder="Description" />
                <div className='icons-container admin'>
                    {/* Render selectable icons */}
                    {icons.map((icon, index) => (
                        <div className='icons-select admin' key={index} onClick={() => handleIconClick(icon)} style={{ backgroundColor: selectedIcons.includes(icon) ? 'lightgrey' : 'transparent' }}>
                            <img src={`/icons/${icon}.svg`} alt={`${icon} Icon`} />
                        </div>
                    ))}
                </div>
                <input type="text" ref={weblinkRef} placeholder="Web Link" />
                <button type="button" onClick={() => captureScreenshots(weblinkRef.current.value)}>Generate screenshots</button>
                <input type="text" ref={githublinkRef} placeholder="GitHub Link" />

                <button type="submit">Save</button>
                <button type="button" onClick={handleSignout}>Sign Out</button>
            </form>

            {desktopScreenshot && (
                <div>
                    <p>Desktop Screenshot</p>
                    <img src={`data:image/png;base64, ${desktopScreenshot}`} alt="Desktop Screenshot" />
                </div>
            )}
            {mobileScreenshot && (
                <div>
                    <p>Mobile Screenshot</p>
                    <img src={`data:image/png;base64, ${mobileScreenshot}`} alt="Mobile Screenshot" />
                </div>
            )}
        </>
    );
}