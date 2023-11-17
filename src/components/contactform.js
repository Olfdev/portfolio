import React, {useState} from 'react';
import axios from 'axios';

export default function ContactForm() {
    const [isSent, setIsSent] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        lastname: '',
        firstname: '',
        email: '',
        status: 'professional',
        message: '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        // Send the form data to the server for email sending
        // axios.post('/send-email', formData)
        //axios.post('http://localhost:3001/send-email', formData)
        axios.post('https://us-central1-flo-portfolio.cloudfunctions.net/emailAndScreenshots/send-email', formData)
            //axios.post('http://localhost:5001/flo-portfolio/us-central1/app/send-email', formData)
            .then(response => {
                setIsLoading(false)
                setIsSent(true)
                console.log('Email sent successfully with code', response)

                // Set isSent to false after 5 seconds
                setTimeout(() => {
                    setIsSent(false)
                }, 5000)

                // Reset form fields
                setFormData({
                    lastname: '',
                    firstname: '',
                    email: '',
                    status: 'professional',
                    message: '',
                });
            })
            .catch(error => {
                setIsLoading(false)
                setIsError(true)

                console.error('Email sending failed', error)

                // Set isError to false after 5 seconds
                setTimeout(() => {
                    setIsError(false)
                }, 5000)
            });
        setIsLoading(true)
    }

    function handleChange(e) {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    return (
        <div id="contact" className="form-container">
            {(isSent || isError) ? null : <h1>👇 Discutons de votre projet 👇</h1>}
            <form className="fields-container" onSubmit={handleSubmit}>
                {isSent ? (
                    <>
                        <p className='thumb'>👍</p>
                        <p className='sent-ok'>Message envoyé ! Une réponse vous sera apportée au plus vite.</p>
                    </>
                ) : isError ? (
                    <>
                        <p className='thumb'>👎</p>
                        <p className='sent-error'>L'envoi a échoué. Merci de réessayer plus tard.</p>
                    </>
                ) : (
                    <>
                        <div className="fields">
                            <label htmlFor="lastname">Nom *</label>
                            <input
                                className="input p field"
                                type="text"
                                name="lastname"
                                id="lastname"
                                required
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="fields">
                            <label htmlFor="firstname">Prénom *</label>
                            <input
                                className="input p field"
                                type="text"
                                name="firstname"
                                id="firstname"
                                required
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="fields">
                            <label htmlFor="email">Email *</label>
                            <input
                                className="input p field"
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="on"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="fields">
                            <label htmlFor="status">Vous êtes</label>
                            <select
                                className="input p field"
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="professional">Un professionnel</option>
                                <option value="individual">Un particulier</option>
                            </select>
                        </div>
                        <div className="fields">
                            <textarea
                                rows="15"
                                className="input p card-desc field"
                                type="text"
                                name="message"
                                placeholder="Votre message"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="contact-button-container">
                            <button type="submit" className="button-ok button-contact" disabled={isLoading}>
                                {isLoading ? <i className="fa-solid fa-spinner"></i> : "✉️ Envoyer"}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
