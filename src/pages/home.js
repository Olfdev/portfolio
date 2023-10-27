import { formatDate } from '../utils/formatdate'
import CreateCard from '../components/createcard'
import DeleteCard from '../components/deletecard'
import React, { useState, useEffect } from "react";
import { collref } from "../firebase/firebase"
import { getDocs, deleteDoc, doc } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { deleteObject, ref, getStorage } from 'firebase/storage';

export default function Home() {
    const storage = getStorage();

    const [projects, setProjects] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAddCardClicked, setIsAddCardClicked] = useState(false)
    const [editingProject, setEditingProject] = useState(null);
    const [deletingProject, setDeletingProject] = useState(null);

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
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true)
                console.log("You have Admin access")
            } else {
                setIsAuthenticated(false)
                console.log("You don't have Admin access")
            }
        });
        return () => unsubscribe()
    }, []);

    function handleAddCard() {
        setIsAddCardClicked(true)
    }

    function handleEditClick(project) {
        setEditingProject(project);
    }

    function handleDeleteClick(project) {
        setDeletingProject(project);
    }

    function isDeletingProject(project) {
        return deletingProject && deletingProject.id === project.id;
    }

    function onCancelDelete() {
        setDeletingProject(null);
    }

    function onApproveDelete() {
        if (deletingProject) {
            // Get the project's image URLs
            const { images } = deletingProject;

            // Delete the project document
            deleteDoc(doc(collref, deletingProject.id))
                .then(() => {
                    console.log("Document deleted successfully");

                    // Delete images from Firebase Storage
                    for (const key in images) {
                        const imageUrl = images[key];
                        if (imageUrl) {
                            // Create a reference to the image in Firebase Storage
                            const imageRef = ref(storage, imageUrl);

                            // Delete the image from Firebase Storage
                            deleteObject(imageRef)
                                .then(() => {
                                    console.log(`Image deleted successfully: ${imageUrl}`);
                                })
                                .catch((error) => {
                                    console.error(`Error deleting image: ${imageUrl}`, error);
                                });
                        }
                    }

                    // Update the projects state to exclude the deleted project
                    setProjects((prevProjects) => prevProjects.filter(project => project.id !== deletingProject.id));
                })
                .catch((error) => {
                    console.error("Error deleting document: ", error);
                });
        }
    }

    return (
        <div className="cards-container">
            {projects
                .sort((a, b) => b.date - a.date)
                .map((project) => (
                    <div className="card" key={project.id}>
                        {isDeletingProject(project) && < DeleteCard onCancelDelete={onCancelDelete} onApproveDelete={onApproveDelete} />}
                        {isAuthenticated && <div className="card-edit-delete-icons">
                            <i className="fa-solid fa-pen-to-square" onClick={() => handleEditClick(project)}></i>
                            <i className="fa-solid fa-circle-xmark" onClick={() => handleDeleteClick(project)}></i>
                        </div>}
                        <p>{formatDate(project.date)}</p>
                        <h1>{project.title}</h1>
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
                        <div className='peripherals-container'>
                            {Object.keys(project.images)
                                .sort()
                                .map((desktopOrMobile) => (

                                    <div className={`${desktopOrMobile}-container`} key={desktopOrMobile}>
                                        <div className={`peripheral-screen ${desktopOrMobile === 'mobile' ? 'mobile' : ''}`}>
                                            {desktopOrMobile === 'mobile' && <div className={`${desktopOrMobile}-top-bar`}></div>}
                                            <img src={project.images[desktopOrMobile]} alt={`${desktopOrMobile} Screen`} />
                                        </div>
                                        <div className={`${desktopOrMobile}-detail`}></div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="links-container">
                            <a className="link-icon" href={project.githublink} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                            <a className="link-icon" href={project.weblink} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-globe"></i></a>
                        </div>
                    </div>
                ))
            }
            {isAuthenticated && (
                <div className='card-add-container'>
                    {isAddCardClicked ? (
                        <div className="card">
                            <CreateCard setProjects={setProjects} setIsAddCardClicked={setIsAddCardClicked} />
                        </div>
                    ) : (
                        <div className="card add" onClick={handleAddCard}>
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}