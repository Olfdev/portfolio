import React from 'react';

function Modal({isOpen, onClose, imageUrl}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="View in full size" />
                {/* <button onClick={onClose}>Close Modal</button> */}
            </div>
        </div>
    );
}

export default Modal;