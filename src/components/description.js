import Timeline from "./timeline"

export default function Description() {

    return (
        <section>
            <div className="description-container"><img src="/images/profile_pic.png" alt="me"></img>
                <h1>Florent Ducret</h1>
                <h2>Développeur Web</h2>
            </div>
            <p>Passionné d'informatique et de jeux vidéo depuis tout petit, j'ai commencé ma carrière en tant que testeur lignuistique français au Québec, chez Enzyme Testing Labs. Je suis ensuite entré chez Babel Media à Montréal pour finalement continuer mon aventure chez Activision Blizzard, à Dublin en Irlande en tant que Lead testeur fonctionnel et linguisitque français. Quelques années plus tard, je suis rentré en France et ai poursuivi chez Ubisoft en tant que Lead QA pour petit à petit évoluer au poste de Project Coordinator en Production. Cinq ans plus tard, j'ai décidé de me reconvertir dans le développement et ai suivi douze mois de formation chez Doranco et Openclassrooms.</p>
            < Timeline />
        </section>
    )
}