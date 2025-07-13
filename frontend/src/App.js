import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import AddBook from './components/AddBook';
import BrowseBooks from './components/BrowseBooks';
import Requests from './components/Requests';
import MyBooks from './components/MyBooks'; // --- IMPORT THE NEW COMPONENT ---
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
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
      <Navbar token={token} logout={logout} />
      <main className="container my-4 my-md-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={handleSetToken} />} />
          <Route path="/add-book" element={<AddBook token={token} />} />
          <Route path="/browse" element={<BrowseBooks token={token} />} />
          <Route path="/requests" element={<Requests token={token} />} />
          {/* --- ADD THE NEW ROUTE HERE --- */}
          <Route path="/my-books" element={<MyBooks token={token} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;