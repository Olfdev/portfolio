import React from "react";

export default function DeleteModal({ onCancelDelete, onApproveDelete }) {
    return (
        <div className="card-mask">
            <h1>Delete this Project?</h1>
            <div className="delete-yes-no-container">
                <div className="delete-text" onClick={() => onCancelDelete()}>NO</div>
                <div className="delete-text yes" onClick={() => onApproveDelete()}>YES</div>
            </div>
        </div>
    );
}