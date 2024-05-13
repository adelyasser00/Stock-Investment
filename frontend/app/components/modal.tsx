import {addToWatchlist} from "@/lib/actions/user.actions"
import {NextResponse} from "next/server";
const clerkId = "user_2g68Nh5cYus1MDTKiDb6gNxxas8"; // This should be the clerkId you intend to use
const companyId = '66379b9f12886f5c474c40ed'; // This should be the companyId you intend to add to the watchlist

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // Improved overlay handling
    const handleOverlayClick = (e) => {
        console.log("Overlay clicked");
        onClose();
    };

    const handleContentClick = async (e) => {
        // Prevents the overlay click handler from firing when clicking inside the modal
        e.stopPropagation();
        try {
            const added = await addToWatchlist(clerkId, companyId);
            console.log('User added:', added);
        }
        catch (error) {
            console.error('Error updating user:', error);
            // Handle the error appropriately, e.g., show a message to the user
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                {children}
                <button onClick={onClose} className="modal-close">X</button>
            </div>
        </div>
    );
};

export default Modal;
