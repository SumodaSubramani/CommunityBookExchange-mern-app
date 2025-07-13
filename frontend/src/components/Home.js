import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="p-5 mb-4 bg-light rounded-3 text-center">
            <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold">Welcome to BookExchange</h1>
                <p className="fs-4">The best place to find, lend, and sell your favorite books. Join our community and start swapping today!</p>
                <Link className="btn btn-primary btn-lg" to="/browse">Browse Books</Link>
            </div>
        </div>
    );
}