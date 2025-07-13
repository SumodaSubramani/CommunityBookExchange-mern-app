import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';

export default function MyBooks({ token }) {
  const [myBooks, setMyBooks] = useState([]);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMyBooks();
  }, [token, navigate]); // Removed fetchMyBooks from here to prevent loops

  // We define fetchMyBooks outside useEffect so it can be called again after a deletion
  const fetchMyBooks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/books/my-books', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      setMyBooks(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowConfirmModal(true);
  };

  const handleCloseModal = () => {
    setBookToDelete(null);
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/books/${bookToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to delete book');
      }

      // Instead of just filtering, we re-fetch the list to get the most up-to-date data
      fetchMyBooks();
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="container py-4">
      <ConfirmationModal
        show={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        confirmText="Confirm Deletion"
      >
        <p>Are you sure you want to permanently delete the book titled: <strong>"{bookToDelete?.title}"</strong>?</p>
        <p className="text-danger">This action cannot be undone.</p>
      </ConfirmationModal>

      <h2 className="mb-4">My Book Listings</h2>
      <div className="card card-ui">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Image</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Condition</th>
                  {/* --- NEW STATUS COLUMN --- */}
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myBooks.length > 0 ? (
                  myBooks.map(book => (
                    <tr key={book._id}>
                      <td>
                        <img 
                          src={book.imageUrl || 'https://via.placeholder.com/60x80?text=No+Image'} 
                          alt={book.title} 
                          style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td>{book.title}</td>
                      <td><span className={`badge text-bg-${book.type === 'sell' ? 'success' : 'info'}`}>{book.type}</span></td>
                      <td>{book.condition}</td>
                      {/* --- DISPLAY THE BOOK STATUS --- */}
                      <td>
                        <span className={`badge text-bg-${book.status === 'available' ? 'primary' : 'secondary'}`}>
                          {book.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {/* --- DISABLE DELETE BUTTON IF EXCHANGED --- */}
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(book)}
                          disabled={book.status === 'exchanged'}
                        >
                          <i className="bi bi-trash-fill me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">You have not listed any books yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}