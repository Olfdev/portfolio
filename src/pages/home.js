import React, { useState, useEffect } from "react";
import { collref } from "../firebase/firebase"
import { getDocs } from "firebase/firestore"

export default function Home() {
    const [projects, setProjects] = useState([])

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long' }
        const formattedDate = new Date(date).toLocaleDateString(undefined, options)
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }

    useEffect(() => {
        getDocs(collref)
            .then((snapshot) => {
                const projectsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                projectsData.sort((a, b) => a.date - b.date)
                setProjects(projectsData)
            })
            .catch(err => {
                console.log(err.message)
            })
    }, []);

    return (
        <div className="cards-container">
            {projects.map((project) => (
                <div className="card" key={project.id}>
                    <h1>{project.title}</h1>
                    <p>{formatDate(project.date)}</p>
                    <p>{project.description}</p>
                    <div className='icons-container'>
                        {project.tech
                            .sort()
                            .map((icon) => (
                                <div className="icons-select" aria-label={`${icon}`} key={icon}>
                                    <img src={`../icons/${icon}.svg`} alt={`Icon ${icon}`} />
                                </div>
                            ))}
                    </div>
                    {Object.keys(project.images)
                        .sort()
                        .map((desktopOrMobile) => (
                            <div className={`${desktopOrMobile}-container`} key={desktopOrMobile}>
                                <div className={`peripheral-screen ${desktopOrMobile === 'mobile' ? 'mobile' : ''}`}>
                                    {desktopOrMobile === 'mobile' && <div className={`${desktopOrMobile}-top-bar`}></div>}
                                    <img src={project.images[desktopOrMobile]} alt={`${desktopOrMobile} screen`} />
                                </div>

                                {desktopOrMobile === 'mobile' && <div className={`${desktopOrMobile}-button`}></div>}
                            </div>
                        ))}
                    <a className="link-icon" href={project.weblink} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-house"></i></a>
                    <a className="link-icon" href={project.githublink} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                </div>
            ))
            }
        </div>
    );
}