import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const projectName = "BookExchange"; 
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer mt-auto">
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
                        <h4 className="text-white">{projectName}</h4>
                        <p className="text-white-50">Connecting communities, one book at a time.</p>
                        <div className="footer-socials mt-3">
                            <a href="#!" title="Facebook" className="text-white me-3"><i className="bi bi-facebook"></i></a>
                            <a href="#!" title="Twitter" className="text-white me-3"><i className="bi bi-twitter"></i></a>
                            <a href="#!" title="Instagram" className="text-white"><i className="bi bi-instagram"></i></a>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                        <h5>Navigate</h5>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/browse">Browse Books</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                        <h5>Get Started</h5>
                        <ul className="list-unstyled footer-links">
                            <li><Link to="/add-book">Add a Book</Link></li>
                            <li><Link to="/requests">My Requests</Link></li>
                            <li><Link to="/wishlist">My Wishlist</Link></li>
                            <li><Link to="/profile">My Profile</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
                        <h5>Stay Updated</h5>
                        <p className="text-white-50">Join our newsletter for the latest updates.</p>
                        <form>
                            <div className="input-group">
                                <input type="email" className="form-control" placeholder="your-email@example.com" />
                                <button className="btn btn-secondary" type="button">Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="footer-bottom text-center py-3">
                <p className="mb-0 text-white-50">© {currentYear} {projectName}. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;