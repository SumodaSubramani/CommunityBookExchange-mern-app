// frontend/src/components/RatingModal.js

import React, { useState } from 'react';
// --- IMPORT YOUR CUSTOM STAR RATING COMPONENT ---
import StarRating from './StarRating'; 

export default function RatingModal({ show, onClose, onSubmit, title }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0); // For your StarRating component
    const [comment, setComment] = useState('');

    if (!show) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // The onSubmit function is passed down from Requests.js
        onSubmit(rating, comment);
        
        // Reset state for the next time the modal opens
        setRating(0);
        setHoverRating(0);
        setComment('');
    };
    
    // This function will be passed to the StarRating component
    const handleRating = (newRating) => {
        setRating(newRating);
    };

    // This function will handle the hover effect
    const handleHover = (hoverValue) => {
        setHoverRating(hoverValue);
    };

    return (
        // The modal-overlay is just a semi-transparent background
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1050
        }}>
            <div className="modal-content card card-ui" style={{ maxWidth: '500px', width: '90%' }}>
                <div className="modal-header card-header">
                    <h5 className="modal-title card-title mb-0">{title}</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body card-body">
                        <p>How was your experience with this exchange? Please leave a rating.</p>
                        
                        {/* --- USE YOUR STAR RATING COMPONENT HERE --- */}
                        <div className="mb-3 d-flex justify-content-center">
                           <StarRating
                                rating={rating}
                                onRating={handleRating}
                                hoverRating={hoverRating}
                                onHover={handleHover}
                           />
                        </div>

                        {/* Comment Input */}
                        <div className="form-floating">
                            <textarea
                                className="form-control"
                                placeholder="Leave a comment here (optional)"
                                id="ratingComment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                style={{ height: '100px' }}
                            ></textarea>
                            <label htmlFor="ratingComment">Optional Comment</label>
                        </div>
                    </div>
                    <div className="modal-footer card-footer d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={rating === 0}>
                            Submit Rating
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}