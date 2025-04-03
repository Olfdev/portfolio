import Timeline from "./timeline";

export default function Description() {
  return (
    <section>
      <div className="description-container">
        <img src="/images/profile_pic_glow.png" alt="me"></img>
        <h1>Florent Ducret</h1>
        <h2>Développeur Web Full Stack</h2>
      </div>
      <p>
        Passionné d'informatique et de jeux vidéo depuis tout petit, j'ai
        commencé ma carrière dans le numérique en tant que testeur lignuistique
        français au Québec, chez Enzyme Testing Labs. Je suis ensuite entré chez
        Babel Media à Montréal pour finalement continuer mon aventure chez
        Activision Blizzard, à Dublin en Irlande en tant que Lead testeur
        fonctionnel et linguisitque français. Quelques années plus tard, je suis
        rentré en France et ai poursuivi chez Ubisoft en tant que Lead QA pour
        petit à petit évoluer au poste de Project Coordinator en Production.
        Cinq ans plus tard, j'ai décidé de me lancer un défi : apprendre le
        développement web. J'ai donc suivi quinze mois de formation chez Doranco
        et Openclassrooms et ai obtenu mon diplôme. Mes expériences à l'étranger
        m'ont permis de maîtriser la langue anglaise et de devenir bilingue
        anglais/français.
      </p>
      <Timeline />
    </section>
  );
}
