export default function DeleteModal({ onClose, deleteProject }) {

    return (
        <div className="card-mask">
            <h1>Delete this Project?</h1>
            <div className="delete-yes-no-container">
                <div className="delete-text" onClick={() => onClose()}>No</div>
                <div className="delete-text yes" onClick={() => deleteProject()}>Yes</div>
            </div>
        </div>
    )
}