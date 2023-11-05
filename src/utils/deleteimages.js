import { ref, deleteObject } from 'firebase/storage'

export function deleteImages(storage, images, deleteCallback) {
    if (images) {
        // Delete images from Firebase Storage
        for (const key in images) {
            const imageUrl = images[key]
            if (imageUrl) {
                // Create a reference to the image in Firebase Storage
                const imageRef = ref(storage, imageUrl)

                // Delete the image from Firebase Storage
                deleteObject(imageRef)
                    .then(() => {
                        console.log(`Image deleted successfully: ${imageUrl}`)
                    })
                    .catch((error) => {
                        console.error(`Error deleting image: ${imageUrl}`, error)
                    })
            }
        }
        // Invoke the callback if provided
        if (deleteCallback) {
            deleteCallback()
        }
    }
}