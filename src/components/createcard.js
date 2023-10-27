import { useRef, useState } from 'react'
import { addDoc } from '@firebase/firestore'
import { collref, imagesRef } from '../firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import fr from 'date-fns/locale/fr'
import 'react-datepicker/dist/react-datepicker.css'

export default function CreateCard({ setProjects, setIsAddCardClicked }) {
    registerLocale('fr', fr)

    const titleRef = useRef()
    const descriptionRef = useRef()
    const delayRef = useRef()
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
        'PHP',
        'JavaScript',
        'Google Lighthouse',
        'MongoDB',
        'Node.js',
        'React',
        'Redux, Redux Toolkit',
        'WAVE',
        'Swagger'
    ];

    const handleIconClick = (icon) => {
        // Toggle the selection state of the icon
        if (selectedIcons.includes(icon)) {
            setSelectedIcons(selectedIcons.filter((i) => i !== icon))
        } else {
            setSelectedIcons([...selectedIcons, icon])
        }
    }

    const captureScreenshots = async (url, delay) => {
        try {
            const delayInSeconds = parseFloat(delay) * 1000;
            url = addHttpWww(url);
            const response = await fetch('http://192.168.0.111:3001/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, delay: delayInSeconds }),
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

    // Modify the URL to add "https://www." if url entered is "mywebsite.com" and add "https://" if url entered is "www.mywebsite.com"
    const addHttpWww = (url) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (!url.startsWith('www.')) {
                url = `https://www.${url}`;
            } else {
                url = `https://${url}`;
            }
        }
        return url;
    }

    async function handleSubmit() {
        try {
            // Modify the URLs for weblinkRef and githublinkRef
            const weblink = addHttpWww(weblinkRef.current.value);
            const githublink = addHttpWww(githublinkRef.current.value);

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
                weblink: weblink,
                githublink: githublink,
            }

            // Add the data to Firestore
            const addedDocRef = await addDoc(collref, data);
            // Get the ID of the newly added document
            const newProjectId = addedDocRef.id;

            // Update the state with the new project data
            setProjects((prevProjects) => [
                ...prevProjects,
                {
                    id: newProjectId,
                    ...data,
                }
            ]);
            // Set isAddCardClicked to false
            setIsAddCardClicked(false);
        } catch (error) {
            console.error('Error handling form submission:', error)
        }
    }

    return (
        <>
            <form className="form-admin" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <DatePicker
                    className='input p'
                    locale="fr"
                    selected={date}
                    onChange={(selectedDate) => setDate(selectedDate)}
                    dateFormat="MMMM yyyy"
                    placeholderText="Date"
                />
                <input className="input h1" type="text" ref={titleRef} placeholder="Title" />
                <textarea rows="3" className='input p' type="text" ref={descriptionRef} placeholder="Description" />
                <div className='icons-container admin'>
                    {icons.map((icon, index) => (
                        <div className='icons-select admin' key={index} onClick={() => handleIconClick(icon)} style={{ backgroundColor: selectedIcons.includes(icon) ? '#fff' : 'transparent' }}>
                            <img src={`/icons/${icon}.svg`} alt={`${icon} Icon`} />
                        </div>
                    ))}
                </div>
                <div className='peripherals-container'>
                    <div className='desktop-container'>
                        <div className='peripheral-screen'>
                            {desktopScreenshot ? (
                                <img src={`data:image/png;base64, ${desktopScreenshot}`} alt="Desktop Screen" />
                            ) : (
                                <img src='/images/desktop_empty.png' alt="Desktop Screen" />
                            )}
                        </div>
                        <div className='desktop-detail'></div>
                    </div>
                    <div className='mobile-container'>
                        <div className='peripheral-screen mobile'>
                            <div className='mobile-top-bar'></div>
                            {mobileScreenshot ? (
                                <img src={`data:image/png;base64, ${mobileScreenshot}`} alt="Mobile Screen" />
                            ) : (
                                <img src='/images/mobile_empty.png' alt="Mobile Screen" />
                            )}
                        </div>
                        <div className='mobile-detail'></div>
                    </div>
                </div>
                <input className='input p github' type="text" ref={githublinkRef} placeholder="GitHub Link" />
                <input className='input p' type="text" ref={weblinkRef} placeholder="Web Link" />
                <div className='delay-button-container'>
                    <input className='input p' type="text" ref={delayRef} placeholder="Delay (in s)" />
                    <button className='button-screenshots' type="button" onClick={() => captureScreenshots(weblinkRef.current.value, delayRef.current.value)}>Generate screenshots from Web Link</button>
                </div>
                <button className='button-add' type="submit">⛏️ Add Project</button>
            </form>
        </>
    );
}