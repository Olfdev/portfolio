import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { addDoc } from "@firebase/firestore"
import { collref } from "../firebase/firebase"
import DatePicker from "react-datepicker"
import { registerLocale } from "react-datepicker"
import fr from 'date-fns/locale/fr'
import "react-datepicker/dist/react-datepicker.css"

export default function Admin() {
    registerLocale('fr', fr)

    const userEmail = useSelector((state) => state.user.email)

    const titleRef = useRef()
    const descriptionRef = useRef()
    const desktopImgRef = useRef()
    const mobileImgRef = useRef()
    const weblinkRef = useRef()
    const githublinkRef = useRef()

    // State to store the tech inputs
    const [techInputs, setTechInputs] = useState([""])

    const [date, setDate] = useState(new Date())

    const handleAddTechInput = () => {
        // Add a new tech input field
        setTechInputs([...techInputs, ''])
    }

    const handleTechInputChange = (index, event) => {
        // Update the value of a tech input based on its index
        const newTechInputs = [...techInputs]
        newTechInputs[index] = event.target.value
        setTechInputs(newTechInputs)
    }

    const handleSubmit = () => {
        const data = {
            date: date.getTime(), // Convert the selected date to a timestamp
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            images: {
                desktop: desktopImgRef.current.value,
                mobile: mobileImgRef.current.value
            },
            tech: techInputs.filter(tech => tech.trim() !== ''), // Filter out empty tech entries
            weblink: weblinkRef.current.value,
            githublink: githublinkRef.current.value
        };

        try {
            addDoc(collref, data)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <h1>Hello, {userEmail}</h1>
            <form className="form-admin" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <DatePicker
                    locale="fr"
                    selected={date}
                    onChange={(selectedDate) => setDate(selectedDate)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Date"
                />
                <input type="text" ref={titleRef} placeholder="Title" />
                <input type="text" ref={descriptionRef} placeholder="Description" />

                {/* Tech input fields */}
                {techInputs.map((tech, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder="Tech"
                        value={tech}
                        onChange={(event) => handleTechInputChange(index, event)}
                    />
                ))}

                {/* Button to add more tech fields */}
                <button type="button" onClick={handleAddTechInput}>+ Add Tech</button>

                <input type="text" ref={desktopImgRef} placeholder="Desktop Image" />
                <input type="text" ref={mobileImgRef} placeholder="Mobile Image" />
                <input type="text" ref={weblinkRef} placeholder="Web Link" />
                <input type="text" ref={githublinkRef} placeholder="GitHub Link" />

                <button type="submit">Save</button>
            </form>
        </>
    );
}
