import Description from '../components/description'
import Modal from '../components/modal'
import {formatDate} from '../utils/formatdate'
import DeleteCard from '../components/deletecard'
import ManipulateCard from '../components/manipulatecard'
import {deleteDocument} from '../utils/deletedocument'
import {deleteImages} from '../utils/deleteimages'
import React, {useState, useEffect} from "react"
import {collref} from "../firebase/firebase"
import {getDocs} from "firebase/firestore"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {getStorage} from 'firebase/storage'
import ContactForm from '../components/contactform'

export default function Home() {
    const storage = getStorage()

    const [filter, setFilter] = useState('all');
    const [projects, setProjects] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAddCardClicked, setIsAddCardClicked] = useState(false)
    const [editingProject, setEditingProject] = useState(null)
    const [deletingProject, setDeletingProject] = useState(null)

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    // Function to handle opening the modal with the clicked image
    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalOpen(true);
    };

    useEffect(() => {
        getDocs(collref)
            .then((snapshot) => {
                const projectsData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                projectsData.sort((a, b) => b.date - a.date)
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
        })
        return () => unsubscribe()
    }, [])

    function handleAddCard() {
        setIsAddCardClicked(true)
    }

    function handleEditClick(project) {
        setEditingProject(project)
    }

    function handleDeleteClick(project) {
        setDeletingProject(project)
    }

    function isDeletingProject(project) {
        return deletingProject && deletingProject.id === project.id
    }

    function isEditingProject(project) {
        return editingProject && editingProject.id === project.id
    }

    function onClose() {
        setDeletingProject(null)
        setEditingProject(null)
        setIsAddCardClicked(false)
    }

    function deleteProject() {
        deleteDocument(collref, deletingProject, setProjects, onClose)
        deleteImages(storage, deletingProject?.images)
    }

    return (
        <>
            < Description />
            <h1 id="projects" className='project-title'>Mes projets</h1>
            <div className="button-filter">
                <button className='button-nav' onClick={() => setFilter('all')}>Tous</button>
                <button className='button-nav' onClick={() => setFilter('formation')}>Formation</button>
                <button className='button-nav' onClick={() => setFilter('pro')}>Pro</button>
                <button className='button-nav' onClick={() => setFilter('perso')}>Perso</button>
            </div>
            <div className='cards-container-container'>
                <div className="cards-container">
                    {projects
                        .filter(project => filter === 'all' || project.type === filter)
                        .sort((a, b) => b.date - a.date)
                        .map((project) => (
                            <div className="card fadein" key={`${project.id}-${filter}`}>
                                {isEditingProject(project) ? (
                                    < ManipulateCard isEditingProject={isEditingProject} project={project} onClose={onClose} storage={storage} deleteImages={deleteImages} setProjects={setProjects} />
                                ) : (
                                    <>
                                        {isDeletingProject(project) && < DeleteCard onClose={onClose} deleteProject={deleteProject} />}
                                        <div className="card-type-edit-delete-icons">
                                            <p className='project-type'>{project.type}</p>
                                            {isAuthenticated && !editingProject && !deletingProject && !isAddCardClicked &&
                                                <>
                                                    <i className="fa-solid fa-pen-to-square" onClick={() => handleEditClick(project)}></i>
                                                    <i className="fa-solid fa-circle-xmark" onClick={() => handleDeleteClick(project)}></i>
                                                </>
                                            }
                                        </div>
                                        <p>{formatDate(project.date)}</p>
                                        <h1>{project.title}</h1>
                                        <p className='card-desc'>{project.description}</p>
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
                                                    (desktopOrMobile === 'desktop' && project.displayDesktop) || (desktopOrMobile === 'mobile' && project.displayMobile) ? (
                                                        <div className={`${desktopOrMobile}-container nopointer`} key={desktopOrMobile}>
                                                            <div className={`peripheral-screen ${desktopOrMobile === 'mobile' ? 'mobile' : ''}`}>
                                                                {desktopOrMobile === 'mobile' && <div className={`${desktopOrMobile}-top-bar`}></div>}
                                                                {/* <img src={project.images[desktopOrMobile]} alt={`${desktopOrMobile} Screen`} /> */}
                                                                <img src={project.images[desktopOrMobile]} alt={`${desktopOrMobile} Screen`} onClick={() => openModal(project.images[desktopOrMobile])} className="zoom-in" />
                                                            </div>
                                                            <div className={`${desktopOrMobile}-detail`}></div>
                                                        </div>
                                                    ) : null
                                                ))
                                            }
                                        </div>
                                        <div className="links-container">
                                            {project.githublink !== '' &&
                                                <a className="link-icon" href={project.githublink} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>}
                                            {project.weblink !== '' &&
                                                <a className="link-icon" href={project.weblink} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-globe"></i></a>}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    }
                    {isAuthenticated && !editingProject && !deletingProject && (
                        <div className='card-add-container'>
                            {isAddCardClicked ? (
                                <div className="card">
                                    <ManipulateCard isEditingProject={isEditingProject} onClose={onClose} setProjects={setProjects} setIsAddCardClicked={setIsAddCardClicked} />
                                </div>
                            ) : (
                                <div className="card add" onClick={handleAddCard}>
                                    <i className="fa-solid fa-plus"></i>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <ContactForm />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageUrl={selectedImage} />
        </>
    )
}