import React, { useState, useEffect } from "react";
import { collref } from "../firebase/firebase"
import { getDocs } from "firebase/firestore"

export default function Dummy_home() {
    //const dummy_home = "dummy_home";
    const [projects, setProjects] = useState([])
    // get 'projects' collection data

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
                    <p>Technologies utilisées:</p>
                    {project.tech.map((tech, index) => (
                        <p key={index}>{tech}</p>
                    ))}
                    <p>Images du projet</p>
                    {Object.keys(project.images).map((key) => (
                        <p key={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)} Image: {project.images[key]}
                        </p>
                    ))}
                    <p>Lien du site: {project.weblink}</p>
                    <p>Lien Github du code: {project.githublink}</p>
                </div>
            ))
            }
        </div>
    );
}