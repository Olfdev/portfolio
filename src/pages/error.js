import {Link} from 'react-router-dom'

export default function error() {
    return (
        <>
            <h1 className="error-page">404</h1>
            <h3 className="error-oops">Oups ! La page que vous demandez n'existe pas.</h3>
            <p className="error-home"><Link to='/'>Retourner à la page d'accueil</Link></p>
        </>
    )
}