export function formatDate(date) {
    const options = { year: 'numeric', month: 'long' }
    const formattedDate = new Date(date).toLocaleDateString(undefined, options)
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}