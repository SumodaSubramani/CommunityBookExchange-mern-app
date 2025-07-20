import React from 'react';

const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <span
        style={{ cursor: 'pointer', color: filled ? '#ffc107' : '#e4e5e9', fontSize: '1.5rem', transition: 'color 0.2s' }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        ★
    </span>
);

const StarRating = ({ rating = 0, onRating, readOnly = false, hoverRating = 0, onHover }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div>
            {stars.map((starValue) => (
                <Star
                    key={starValue}
                    filled={hoverRating >= starValue || (!hoverRating && rating >= starValue)}
                    // This onClick is what makes the rating selection work
                    onClick={() => !readOnly && onRating && onRating(starValue)}
                    onMouseEnter={() => !readOnly && onHover && onHover(starValue)}
                    onMouseLeave={() => !readOnly && onHover && onHover(0)}
                />
            ))}
            {readOnly && rating > 0 && <span className="ms-2 text-muted fw-bold">({rating})</span>}
        </div>
    );
};

export default StarRating;