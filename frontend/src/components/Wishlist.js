import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';

export default function Wishlist({ token }) {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookToRemove, setBookToRemove] = useState(null);
    const navigate = useNavigate();

    const fetchWishlist = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/user/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                 const errorData = await res.json();
                 throw new Error(errorData.message || 'Failed to fetch wishlist');
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setWishlist(data);
            } else {
                setWishlist([]);
            }
        } catch (error) {
            toast.error(error.message);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchWishlist();
        }
    }, [token, navigate, fetchWishlist]);

    const handleRemoveClick = (book) => {
        setBookToRemove(book);
        setShowConfirmModal(true);
    };

    const handleCloseModal = () => {
        setBookToRemove(null);
        setShowConfirmModal(false);
    };

    const handleConfirmRemove = async () => {
        if (!bookToRemove) return;
        try {
            await fetch(`http://localhost:5000/api/user/wishlist/${bookToRemove._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Book removed from your wishlist!');
            setWishlist(prevWishlist => prevWishlist.filter(book => book._id !== bookToRemove._id));
        } catch (error) {
            toast.error(error.message);
        } finally {
            handleCloseModal();
        }
    };

    if (loading) {
        return <div className="text-center p-5"><h4>Loading your wishlist...</h4></div>;
    }

    return (
        <div className="container py-4">
            <ConfirmationModal
                show={showConfirmModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmRemove}
                title="Remove from Wishlist"
                confirmText="Yes, Remove"
                confirmButtonClass="btn-danger"
            >
                <p>Are you sure you want to remove <strong>"{bookToRemove?.title}"</strong> from your wishlist?</p>
            </ConfirmationModal>

            <h2 className="mb-4">My Wishlist</h2>
            {wishlist.length > 0 ? (
                <div className="card card-ui">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>Image</th>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Owner</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wishlist.map(book => (
                                        <tr key={book._id}>
                                            <td>
                                                <img src={book.imageUrl || 'https://via.placeholder.com/60x80?text=No+Image'} alt={book.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                            </td>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.userId?.username || 'N/A'}</td>
                                            <td className="text-end">
                                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveClick(book)}>
                                                    <i className="bi bi-trash-fill me-1"></i> Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-5 bg-light rounded">
                    <h4>Your wishlist is empty.</h4>
                    <p className="text-muted">Add books you're interested in while browsing.</p>
                    <Link to="/browse" className="btn btn-primary mt-3">Browse Books</Link>
                </div>
            )}
        </div>
    );
}