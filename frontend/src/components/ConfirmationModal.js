import React from 'react';
import './ConfirmationModal.css';

/**
 * A reusable modal component for confirming user actions.
 * @param {string} confirmText - (Optional) The text for the confirmation button. Defaults to 'Confirm'.
 */
export default function ConfirmationModal({ 
  show, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  confirmText = 'Confirm' 
}) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content card card-ui">
        <div className="modal-header card-header">
          <h5 className="modal-title card-title mb-0">{title}</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose} 
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body card-body">
          {children}
        </div>
        <div className="modal-footer card-footer d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}