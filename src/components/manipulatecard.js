import {useRef, useState, useEffect} from 'react'
import {addDoc, doc, updateDoc} from '@firebase/firestore'
import {collref, imagesRef} from '../firebase/firebase'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import DatePicker from 'react-datepicker'
import {registerLocale} from 'react-datepicker'
import fr from 'date-fns/locale/fr'
import iconsData from '../icons.json'
import 'react-datepicker/dist/react-datepicker.css'

export default function ManipulateCard({isEditingProject, onClose, setProjects, setIsAddCardClicked, project, deleteImages, storage}) {
    const icons = iconsData.icons
    registerLocale('fr', fr)

    const [desktopScreenshot, setDesktopScreenshot] = useState(null)
    const [mobileScreenshot, setMobileScreenshot] = useState(null)

    const [desktopScreenshotSource, setDesktopScreenshotSource] = useState('url')
    const [mobileScreenshotSource, setMobileScreenshotSource] = useState('url')

    const [date, setDate] = useState(new Date())
    const [selectedIcons, setSelectedIcons] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isErrorScreenshots, setIsErrorScreenshots] = useState(false)
    const [isOkScreenshots, setIsOkScreenshots] = useState(false)

    const typeRef = useRef()
    const titleRef = useRef()
    const descriptionRef = useRef()
    const delayRef = useRef()
    const weblinkRef = useRef()
    const githublinkRef = useRef()

    useEffect(() => {
        if (isEditingProject(project)) {
            if ((project)) {
                setDesktopScreenshot(project.images.desktop)
                setMobileScreenshot(project.images.mobile)

                setDesktopScreenshotSource('url')
                setMobileScreenshotSource('url')

                setDate(new Date(project.date))

                setSelectedIcons(project.tech || [])

                typeRef.current.value = project.type
                titleRef.current.value = project.title
                descriptionRef.current.value = project.description
                weblinkRef.current.value = project.weblink
                githublinkRef.current.value = project.githublink
            }
        }
    }, [project, isEditingProject])

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
            setIsLoading(true)
            const delayInSeconds = parseFloat(delay) * 1000
            url = addHttpWww(url)
            //const response = await fetch('http://192.168.0.111:3001/screenshots', {
            const response = await fetch('https://us-central1-flo-portfolio.cloudfunctions.net/emailAndScreenshots/screenshots', {
                //const response = await fetch('http://localhost:5001/emailAndScreenshots/screenshots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({url, delay: delayInSeconds}),
            })

            if (response.ok) {
                const data = await response.json()
                setDesktopScreenshot(data.desktopScreenshot)
                setMobileScreenshot(data.mobileScreenshot)
                setIsLoading(false)
                setIsOkScreenshots(true)

                // Set a timeout to reset isOkScreenshots to false
                setTimeout(() => {
                    setIsOkScreenshots(false)
                }, 3000)

                if (isEditingProject(project)) {
                    setDesktopScreenshotSource('base64')
                    setMobileScreenshotSource('base64')
                }
            } else {
                console.error('Failed to capture screenshots:', response.status)
                setIsLoading(false)
                setIsErrorScreenshots(true)

                // Set a timeout to reset isErrorScreenshots to false
                setTimeout(() => {
                    setIsErrorScreenshots(false)
                }, 3000)
            }
        } catch (error) {
            console.error('Error capturing screenshots:', error)
        }
    }

    // Modify the URL to add "https://www." if url entered is "mywebsite.com" and add "https://" if url entered is "www.mywebsite.com"
    const addHttpWww = (url) => {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            if (!url.startsWith('www.')) {
                url = `https://www.${url}`
            } else {
                url = `https://${url}`
            }
        }
        return url
    }

    //create empty desktopDownloadURL and mobileDownloadURL
    let desktopDownloadURL
    let mobileDownloadURL

    //desktop and mobile upload function
    async function uploadImages(desktopImageBytes, mobileImageBytes, metadata) {
        // Generate unique image references for desktop and mobile
        const [desktopImageRef, mobileImageRef] = [`${Date.now()}-desktop.png`, `${Date.now()}-mobile.png`].map(name => ref(imagesRef, name))

        // Upload the desktop and mobile images
        const [desktopUploadTask, mobileUploadTask] = [desktopImageBytes, mobileImageBytes].map((bytes, i) => uploadBytes([desktopImageRef, mobileImageRef][i], bytes, metadata))

        // Wait for both uploads to complete
        await Promise.all([desktopUploadTask, mobileUploadTask]);

        // Get download URLs for the new images
        [desktopDownloadURL, mobileDownloadURL] = await Promise.all([desktopImageRef, mobileImageRef].map(ref => getDownloadURL(ref)));
    }

    async function handleSubmit() {
        try {
            let projectDocRef
            // Modify the URLs for weblinkRef and githublinkRef
            const weblink = addHttpWww(weblinkRef.current.value)
            const githublink = addHttpWww(githublinkRef.current.value)

            // Convert the selectedIcons array to an array of strings
            const selectedIconsArray = selectedIcons.map(icon => icon)

            if (isEditingProject(project)) {
                // Set up the document reference for the project
                projectDocRef = doc(collref, project.id)
            }

            //set metadata to image/png
            const metadata = {
                contentType: 'image/png',
            }

            // Check if we are editing a project
            if (isEditingProject(project)) {
                // Check if the desktopScreenshot is different from the project's desktop image, or if mobileScreenshot is the same as the project's desktop image
                if (desktopScreenshot !== project.images.desktop || mobileScreenshot === project.images.desktop) {

                    // Convert the desktopScreenshot to bytes or fetch and convert a default image
                    const desktopImageBytes = desktopScreenshot ? Uint8Array.from(atob(desktopScreenshot), c => c.charCodeAt(0)) : await fetchAndConvert('/images/desktop_empty.png')

                    // Convert the mobileScreenshot to bytes or fetch and convert a default image
                    const mobileImageBytes = mobileScreenshot ? Uint8Array.from(atob(mobileScreenshot), c => c.charCodeAt(0)) : await fetchAndConvert('/images/mobile_empty.png')

                    await uploadImages(desktopImageBytes, mobileImageBytes, metadata)

                    // Delete the old images
                    deleteImages(storage, project.images)
                } else {
                    // If the images haven't changed, use the existing download URLs
                    [desktopDownloadURL, mobileDownloadURL] = [desktopScreenshot, mobileScreenshot]
                }
            } else {
                // Fetch and convert default desktop and mobile images
                const [localDesktopImage, localMobileImage] = await Promise.all(['/images/desktop_empty.png', '/images/mobile_empty.png'].map(async url => {
                    const response = await fetch(url)
                    const arrayBuffer = await response.arrayBuffer()
                    return new Uint8Array(arrayBuffer)
                }))

                // Convert the provided screenshots to bytes or use the default images
                const [desktopImageBytes, mobileImageBytes] = [desktopScreenshot, mobileScreenshot].map((screenshot, i) => {
                    return screenshot ? Uint8Array.from(atob(screenshot), c => c.charCodeAt(0)) : [localDesktopImage, localMobileImage][i]
                })

                await uploadImages(desktopImageBytes, mobileImageBytes, metadata)
            }

            // Function to fetch and convert an image from a given URL
            async function fetchAndConvert(url) {
                const response = await fetch(url)
                const arrayBuffer = await response.arrayBuffer()
                return new Uint8Array(arrayBuffer)
            }

            // Construct the data object
            const data = {
                date: date.getTime(),
                type: typeRef.current.value,
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

            if (isEditingProject(project)) {
                //Edit the data in Firestore
                await updateDoc(projectDocRef, data)


                //close the edit window
                onClose()

                // Update the state with the edited project data
                setProjects((prevProjects) =>
                    prevProjects.map((prevProject) =>
                        prevProject.id === project.id ? {id: project.id, ...data} : prevProject
                    )
                )
                console.log('Project updated successfully')
            } else {
                // Add the data to Firestore
                const addedDocRef = await addDoc(collref, data)
                // Get the ID of the newly added document
                const newProjectId = addedDocRef.id

                // Update the state with the new project data
                setProjects((prevProjects) => [
                    ...prevProjects,
                    {
                        id: newProjectId,
                        ...data,
                    }
                ])
                console.log('Project created successfully')
                // Set isAddCardClicked to false
                setIsAddCardClicked(false)
            }
        } catch (error) {
            console.error('Error handling form submission:', error)
        }
    }

    return (
        <>
            <form className="form-admin" onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
                <div className='date-type'>
                    <DatePicker
                        className='input p'
                        locale="fr"
                        selected={date}
                        onChange={(selectedDate) => setDate(selectedDate)}
                        dateFormat="MMMM yyyy"
                        placeholderText="Date"
                    />
                    <select
                        className="project-type"
                        id="status"
                        name="status"
                        ref={typeRef}
                    >
                        <option value="perso">perso</option>
                        <option value="pro">pro</option>
                        <option value="formation">formation</option>
                    </select>
                </div>
                <input className="input h1" type="text" ref={titleRef} placeholder="Title" />
                <textarea rows="3" className='input p card-desc' type="text" maxLength="322" ref={descriptionRef} placeholder="Description" />
                <div className='icons-container admin'>
                    {icons
                        .sort()
                        .map((icon, index) => (
                            <div className='icons-select admin' key={index} onClick={() => handleIconClick(icon)} style={{backgroundColor: selectedIcons.includes(icon) ? '#fff' : 'transparent'}}>
                                <img src={`/icons/${icon}.svg`} alt={`${icon} Icon`} />
                            </div>
                        ))}
                </div>
                <div className='peripherals-container'>
                    <div className='desktop-container'>
                        <div className='peripheral-screen'>
                            {desktopScreenshot && (
                                <img
                                    src={
                                        isEditingProject(project) && desktopScreenshotSource === 'url'
                                            ? desktopScreenshot
                                            : `data:image/png;base64, ${desktopScreenshot}`
                                    }
                                    alt="Desktop Screen"
                                />
                            )}
                            {!desktopScreenshot && (
                                <img src='/images/desktop_empty.png' alt="Desktop Screen" />
                            )}
                        </div>
                        <div className='desktop-detail'></div>
                    </div>
                    <div className='mobile-container'>
                        <div className='peripheral-screen mobile'>
                            <div className='mobile-top-bar'></div>
                            {mobileScreenshot && (
                                <img
                                    src={
                                        isEditingProject(project) && mobileScreenshotSource === 'url'
                                            ? mobileScreenshot
                                            : `data:image/png;base64, ${mobileScreenshot}`
                                    }
                                    alt="Mobile Screen"
                                />
                            )}
                            {!mobileScreenshot && (
                                <img src='/images/mobile_empty.png' alt="Mobile Screen" />
                            )}
                        </div>
                        <div className='mobile-detail'></div>
                    </div>
                </div>
                <input className='input p github' type="text" ref={githublinkRef} placeholder="GitHub Link" />
                <input className='input p' type="text" ref={weblinkRef} placeholder="Web Link" />
                <div className='delay-generate-button-container'>
                    <input className='input p' type="text" ref={delayRef} placeholder="Delay (in s)" />
                    {isLoading ? (
                        <button className='button-screenshots disabled' type="button">
                            <i className="fa-solid fa-spinner"></i>
                        </button>
                    ) : (
                        isErrorScreenshots ? (
                            <button className='button-screenshots error' type="button">
                                Error: Please check your Web Link
                            </button>
                        ) : (
                            isOkScreenshots ? (
                                <button className='button-screenshots ok' type="button">
                                    Screenshots generated successfully
                                </button>
                            ) : (
                                <button className='button-screenshots' type="button" onClick={() => captureScreenshots(weblinkRef.current.value, delayRef.current.value)}>
                                    Generate screenshots from Web Link
                                </button>
                            )
                        )
                    )}
                </div>
                <div className='two-buttons-container'>
                    <button className="button-cancel" type="button" onClick={() => onClose()}>Cancel</button>
                    <button className='button-ok' type="submit" disabled={isLoading}>
                        {isEditingProject(project) ? "✏️ Update Project" : "⛏️ Add Project"}
                    </button>
                </div>
            </form>
        </>
    )
}