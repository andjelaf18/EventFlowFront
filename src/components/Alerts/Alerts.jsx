/*function Alert({ tip = "primary", poruka, onClose }) {
    if (!poruka) return null;

    return (
        <div className={`alert alert-${tip} alert-dismissible fade show`} role="alert">
            {poruka}
            {onClose && (
                <button 
                    type="button" 
                    className="btn-close" 
                    onClick={onClose}>
                </button>
            )}
        </div>
    );
}

export default Alert;

function Alert({ tip = "success", poruka, onClose }) {

    if (!poruka) return null;

    return (
        <div className={`alert alert-${tip} custom-alert`} role="alert">

            <span>{poruka}</span>

            <button
                type="button"
                className="btn-close"
                onClick={onClose}
            ></button>

        </div>
    );
}

export default Alert;

import './Alert.css';
function Alert({ tip = "primary", poruka, onClose }) {

    if (!poruka) return null;

    return (
        <div className={`custom-alert alert alert-${tip} alert-dismissible fade show`}>
            {poruka}

            <button
                type="button"
                className="btn-close"
                onClick={onClose}
            ></button>
        </div>
    );
}

export default Alert;*/

import { useEffect } from 'react';
import './Alert.css';

function Alert({ tip = "primary", poruka, onClose }) {

    useEffect(() => {
        if (!poruka) return;

        const timer = setTimeout(() => {
            onClose();
        }, 4000); // Automatski zatvara posle 4 sekunde

        return () => clearTimeout(timer); // Čišćenje tajmera ako se komponenta unmount-uje
    }, [poruka, onClose]);

    if (!poruka) return null;

    return (
        <div className={`custom-alert alert alert-${tip} alert-dismissible fade show`}>
            {poruka}
            <button
                type="button"
                className="btn-close"
                onClick={onClose}
            ></button>
        </div>
    );
}

export default Alert;