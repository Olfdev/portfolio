import { deleteDoc, doc } from 'firebase/firestore'

export function deleteDocument(collref, project, setProjects, onClose) {
    if (project) {
        // Delete the project document
        deleteDoc(doc(collref, project.id))
            .then(() => {
                console.log("Document deleted successfully")
            })
            .catch((error) => {
                console.error("Error deleting document: ", error)
            })

        // Update the projects state to exclude the deleted project
        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== project.id))

        // Close the delete window
        onClose()
    }
}
