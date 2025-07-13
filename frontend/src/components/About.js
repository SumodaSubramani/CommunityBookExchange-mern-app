import React from 'react';

export default function About() {
  return (
    <div className="container py-4">
      
      {/* Header Section */}
      <div className="card card-ui mb-4 text-center">
        <div className="card-body p-4 p-md-5">
          <h1 className="display-5 fw-bold">About BookExchange</h1>
          <p className="fs-5 text-muted mb-0">
            Your community-driven platform to connect, share, and discover.
          </p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="row g-4">

        {/* Column 1: Our Mission */}
        <div className="col-md-6 d-flex">
          <div className="card card-ui w-100">
            <div className="card-body p-4">
              <h2 className="mb-3">Our Mission</h2>
              <p>
                Our mission is to build a sustainable community where books find new homes and readers find new adventures. We make sharing books easy, personal, and efficient.
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: How It Works - Compact and Direct */}
        <div className="col-md-6 d-flex">
          <div className="card card-ui w-100">
            <div className="card-body p-4">
              <h2 className="mb-3">Core Features</h2>
              {/* Using a compact list structure */}
              <ul className="list-unstyled d-grid gap-3">
                
                <li className="d-flex align-items-center">
                  <i className="bi bi-person-plus-fill fs-4 me-3 text-primary"></i>
                  <div>
                    <strong>Join the Community:</strong> Register with your contact details and location.
                  </div>
                </li>

                <li className="d-flex align-items-center">
                  <i className="bi bi-cloud-arrow-up-fill fs-4 me-3 text-primary"></i>
                  <div>
                    <strong>List Your Books:</strong> Add books to lend or sell with uploaded cover images.
                  </div>
                </li>

                <li className="d-flex align-items-center">
                  <i className="bi bi-search fs-4 me-3 text-primary"></i>
                  <div>
                    <strong>Discover Reads:</strong> Search for books by location and hover to see their condition.
                  </div>
                </li>

                <li className="d-flex align-items-center">
                  <i className="bi bi-chat-dots-fill fs-4 me-3 text-primary"></i>
                  <div>
                    <strong>Connect & Exchange:</strong> Use contact details or in-app chat after a request is accepted.
                  </div>
                </li>

              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}