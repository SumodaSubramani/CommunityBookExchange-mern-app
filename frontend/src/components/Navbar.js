import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar({ token, logout }) {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) { 
        logout(); 
      }
    } else {
      setUsername(null);
    }
  }, [token, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        {/* ... (Navbar brand, toggler, and main links are the same) ... */}
        <Link className="navbar-brand fw-bolder fs-4" to="/">BookExchange</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/browse">Browse Books</Link></li>
            {token && <li className="nav-item"><Link className="nav-link" to="/add-book">Add Book</Link></li>}
            {token && <li className="nav-item"><Link className="nav-link" to="/requests">My Requests</Link></li>}
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
          </ul>
          <div className="d-flex align-items-center">
            {token && username ? (
              <div className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle bg-transparent border-0 p-2" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  aria-label="User menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                </button>
                
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow-lg border-0 mt-2">
                  <li><h6 className="dropdown-header">Signed in as</h6></li>
                  <li><span className="dropdown-item-text"><strong>{username}</strong></span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/profile" className="dropdown-item d-flex align-items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill me-2" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-books" className="dropdown-item d-flex align-items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-book-half me-2" viewBox="0 0 16 16"><path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388 1.175.885.652 1.098 1.79 1.002 3.102-.098 1.313-.59 2.582-1.175 3.388-.585.806-1.212 1.24-1.936 1.488A6.954 6.954 0 0 1 11.5 14H8.5V2.687zM8.5 1.5C7.382.155 5.468-.582 3.896.155 1.794.996.5 3.29.5 6c0 2.685 1.294 4.953 3.396 5.845.3.118.63.2.98.223.334.024.66.01.953-.034a7.065 7.065 0 0 0 1.666-.334c.33-.09.65-.213.955-.371.325-.166.623-.38.896-.646.273-.266.52-.578.717-.92.196-.342.34-.744.408-1.213.068-.469.043-.993-.06-1.554a3.27 3.27 0 0 1-.41-.92c-.15-.365-.355-.715-.605-1.037a4.91 4.91 0 0 0-.852-.95c-.34-.28-.75-.52-1.229-.684-.48-.164-1.02-.27-1.582-.275a5.26 5.26 0 0 0-1.666.248zM8.5 14V1H11.5a5.95 5.95 0 0 1 2.914.823c.97.555 1.621 1.545 1.68 2.823.058 1.278-.474 2.37-1.39 3.185-.918.814-2.22 1.2-3.488.994A5.95 5.95 0 0 1 8.5 14z"/></svg>
                      My Books
                    </Link>
                  </li>
                  <li>
                    <Link to="/wishlist" className="dropdown-item d-flex align-items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill me-2" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                      My Wishlist
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right me-2" viewBox="0 0 16 16"><path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/><path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-light">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}