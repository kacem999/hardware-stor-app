const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
            {/* Modal Panel */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg z-50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;