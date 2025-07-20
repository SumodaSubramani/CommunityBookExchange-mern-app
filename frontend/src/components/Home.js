import React from 'react';
import { Link } from 'react-router-dom';


// Import the images from your assets folder
import listIcon from '../assets/how-it-works-1.png';
import discoverIcon from '../assets/how-it-works-2.png';
import exchangeIcon from '../assets/how-it-works-3.png';

const Home = () => {
    return (
        <div>
            {/* --- HERO SECTION --- */}
            <div className="container col-xxl-8 px-4 py-5 text-center">
                <h1 className="display-4 fw-bold lh-1 mb-3">Welcome to BookExchange</h1>
                <p className="lead" style={{ maxWidth: '600px', margin: '0 auto', color: '#6c757d' }}>
                    The best place to find, lend, and sell your favorite books. Discover hidden gems in your community and share your own collection with fellow readers.
                </p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                    <Link to="/browse" className="btn btn-primary btn-lg px-4 gap-3">Browse Books</Link>
                    <Link to="/register" className="btn btn-outline-secondary btn-lg px-4">Join Now</Link>
                </div>
            </div>



            {/* --- "HOW IT WORKS" SECTION --- */}
            <div className="container px-4 py-5" id="how-it-works">
                <h2 className="pb-2 border-bottom text-center mb-5">How It Works</h2>
                <div className="row g-4 py-3 row-cols-1 row-cols-lg-3">

                    <div className="col d-flex align-items-stretch">
                        <div className="card card-ui how-it-works-card">
                            <div className="icon-circle">
                                <img src={listIcon} alt="List your books" />
                            </div>
                            <h3 className="fs-4 fw-bold">1. List Your Books</h3>
                            <p>Easily add books from your collection that you're willing to lend or sell. Just enter the details and upload a photo.</p>
                        </div>
                    </div>

                    <div className="col d-flex align-items-stretch">
                        <div className="card card-ui how-it-works-card">
                            <div className="icon-circle">
                                <img src={discoverIcon} alt="Discover reads" />
                            </div>
                            <h3 className="fs-4 fw-bold">2. Discover Reads</h3>
                            <p>Browse or search for books available in your area. Add interesting finds to your wishlist or request them right away.</p>
                        </div>
                    </div>

                    <div className="col d-flex align-items-stretch">
                        <div className="card card-ui how-it-works-card">
                             <div className="icon-circle">
                                <img src={exchangeIcon} alt="Exchange and rate" />
                            </div>
                            <h3 className="fs-4 fw-bold">3. Exchange & Rate</h3>
                            <p>Connect with other users to arrange the exchange. After you've received your book, rate your experience to build community trust.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;