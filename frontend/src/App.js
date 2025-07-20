import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './components/Home'; // Import new Home
import Footer from './components/Footer'; // Import new Footer
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import AddBook from './components/AddBook';
import BrowseBooks from './components/BrowseBooks';
import Requests from './components/Requests';
import MyBooks from './components/MyBooks';
import Profile from './components/Profile';
import Wishlist from './components/Wishlist';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleSetToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
        <Navbar token={token} logout={logout} />
        <main className="container my-4 my-md-5 flex-grow-1">
          <Routes>
            {/* --- REPLACE THE OLD HOME ROUTE --- */}
            <Route path="/" element={<Home />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setToken={handleSetToken} />} />
            <Route path="/add-book" element={<AddBook token={token} />} />
            <Route path="/browse" element={<BrowseBooks token={token} />} />
            <Route path="/requests" element={<Requests token={token} />} />
            <Route path="/my-books" element={<MyBooks token={token} />} />
            <Route path="/profile" element={<Profile token={token} />} />
            <Route path="/wishlist" element={<Wishlist token={token} />} />
          </Routes>
        </main>
        {/* --- ADD THE FOOTER COMPONENT --- */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;