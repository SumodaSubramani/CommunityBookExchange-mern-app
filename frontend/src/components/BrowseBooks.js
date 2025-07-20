import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const ImagePlaceholder = () => (
  <div className="d-flex align-items-center justify-content-center bg-secondary-subtle" style={{ height: '250px', color: '#6c757d' }}>
    <i className="bi bi-book fs-1"></i>
  </div>
);

export default function BrowseBooks({ token }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState({ city: '', state: '' });
  const [wishlist, setWishlist] = useState([]); // State to hold wishlist book IDs
  const navigate = useNavigate();

  const currentUserId = token ? jwtDecode(token).userId : null;

  // --- Fetch both books and the user's wishlist on component load ---
  useEffect(() => {
    // Fetch all available books
    const fetchBooks = (city = '', state = '') => {
      fetch(`http://localhost:5000/api/books?city=${city}&state=${state}`)
        .then(res => res.json()).then(setBooks).catch(err => console.error(err));
    };

    // Fetch the user's wishlist to know which buttons to disable
    const fetchWishlist = async () => {
      if (!token) return; // Don't fetch if user is not logged in
      try {
        const res = await fetch(`http://localhost:5000/api/user/wishlist`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        // We only need the IDs for quick lookups
        setWishlist(data.map(book => book._id));
      } catch (err) {
        console.error("Could not fetch wishlist");
      }
    };
    
    fetchBooks();
    fetchWishlist();
  }, [token]);

  const handleSearchChange = (e) => setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Re-fetch books with search parameters
    fetch(`http://localhost:5000/api/books?city=${search.city}&state=${search.state}`)
      .then(res => res.json()).then(setBooks).catch(err => console.error(err));
  };

  const handleRequest = async (bookId) => {
    if (!token) { toast.warn('Please log in to make a request.'); navigate('/login'); return; }
    try {
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Request sent successfully!');
    } catch (err) { toast.error(err.message); }
  };

  // --- New function to handle adding a book to the wishlist ---
  const handleAddToWishlist = async (bookId) => {
    if (!token) { toast.warn("Please log in to add to wishlist"); return; }
    try {
        await fetch(`http://localhost:5000/api/user/wishlist/${bookId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success("Added to your wishlist!");
        // Optimistically update the local wishlist state to disable the button immediately
        setWishlist([...wishlist, bookId]);
    } catch (error) {
        toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Find Your Next Read</h1>
        <p className="fs-5 text-muted">Browse books available from our community.</p>
        <form onSubmit={handleSearchSubmit} className="row g-2 mt-4 justify-content-center">
            <div className="col-sm-4 col-md-3"><input type="text" name="city" value={search.city} onChange={handleSearchChange} placeholder="City" className="form-control form-control-lg" /></div>
            <div className="col-sm-4 col-md-3"><input type="text" name="state" value={search.state} onChange={handleSearchChange} placeholder="State" className="form-control form-control-lg" /></div>
            <div className="col-auto"><button type="submit" className="btn btn-primary btn-lg">Search</button></div>
        </form>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {books.map(book => {
          if (!book.userId) return null;

          const isOwner = currentUserId === book.userId._id;
          const isInWishlist = wishlist.includes(book._id);

          return (
            <div key={book._id} className="col">
              <div className="card card-ui h-100 overflow-hidden">
                <div className="image-overlay-container">
                  {book.imageUrl ? (<img src={book.imageUrl} className="card-img-top" alt={book.title} style={{ height: '250px', objectFit: 'cover' }} />) : (<ImagePlaceholder />)}
                  <div className="image-overlay-content"><h5 className="mb-1">Condition</h5><p className="fs-4 fw-bold">{book.condition}</p></div>
                </div>
                <div className="card-body d-flex flex-column p-3">
                  <div className="mb-2"><span className={`badge rounded-pill text-bg-${book.type === 'sell' ? 'success' : 'info'}`}>{book.type === 'sell' ? `For Sale: $${book.price}` : 'For Lend'}</span></div>
                  <h5 className="card-title fw-semibold">{book.title}</h5>
                  <p className="card-text text-muted small mb-3">by {book.author}</p>
                  <div className="small text-muted"><i className="bi bi-person me-2"></i>{book.userId.username}</div>
                  <div className="small text-muted"><i className="bi bi-geo-alt me-2"></i>{book.city}, {book.state}</div>
                  
                  <div className="mt-auto pt-3 d-grid gap-2">
                    <button onClick={() => handleRequest(book._id)} className={`btn ${isOwner ? 'btn-outline-secondary' : 'btn-primary'}`} disabled={isOwner}>
                      {isOwner ? 'This is Your Book' : 'Request Book'}
                    </button>
                    {/* --- NEW WISHLIST BUTTON WITH CONDITIONAL LOGIC --- */}
                    {!isOwner && token && (
                      <button 
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => handleAddToWishlist(book._id)}
                        disabled={isInWishlist}
                      >
                        <i className="bi bi-star-fill me-1"></i> 
                        {isInWishlist ? 'In Your Wishlist' : 'Add to Wishlist'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}