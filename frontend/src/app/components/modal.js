const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // Improved overlay handling
    const handleOverlayClick = (e) => {
        console.log("Overlay clicked");
        onClose();
    };

    const handleContentClick = (e) => {
        // Prevents the overlay click handler from firing when clicking inside the modal
        e.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                {children}
                <button onClick={onClose} className="modal-close">Close</button>
            </div>
        </div>
    );
};

export default Modal;
