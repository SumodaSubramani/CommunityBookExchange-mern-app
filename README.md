# Community BookExchange - A Full-Stack MERN Application

BookExchange is a dynamic and feature-rich web application built with the MERN stack, designed to create a community for book lovers to lend, sell, and discover new books. This project demonstrates a complete full-stack development cycle, from backend API design and database management to a responsive, interactive frontend and real-time communication.

## Live Demo

[![BookExchange Demo Thumbnail](https://user-images.githubusercontent.com/139045863/293503254-20a2323f-e53b-47e0-b6f7-c91f543666b4.png)](https://youtu.be/BrB_dtJzFro)

**[Click here to watch the full project demo on YouTube!](https://youtu.be/BrB_dtJzFro)**

## Key Features

- **Full User Authentication:** Secure user registration and login system using JSON Web Tokens (JWT) and `bcrypt.js` for password hashing.
- **Book Listings (CRUD):** Users can create, read, and delete their book listings. The system supports both "Lend" and "Sell" types, complete with pricing.
- **Cloud Image Uploads:** Book cover images are a mandatory field for new listings, handled seamlessly using `multer` and stored permanently on **Cloudinary**.
- **Request & Delivery System:** A comprehensive transaction lifecycle where users can request books, and owners can accept or reject. An integrated "Mark as Delivered" feature updates the book's status to "exchanged," removing it from public listings to maintain data accuracy.
- **Real-Time In-App Chat:** Upon a request being accepted, a private chat room is created between the owner and the requester using **Socket.IO**, allowing users to coordinate the exchange directly on the platform.
- **User Dashboards & Management:**
    - **My Requests:** A dedicated page showing incoming and outgoing requests with their statuses.
    - **My Books:** A private page where users can view and manage all their listed books.
    - **Profile Dropdown:** A clean UI element showing the logged-in user's name with quick access to their listings and the logout function.
- **Interactive & Responsive UI:**
    - A responsive interface built with **React** and styled with **Bootstrap** for a consistent experience on all devices.
    - Interactive book cards with a hover-to-reveal condition feature.
    - Non-blocking toast notifications for a smooth user experience.
    - Professional confirmation modals for critical actions like deleting a book.

---

## Technology Stack

- **Frontend:** React, React Router, Socket.IO Client
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Real-Time Communication:** Socket.IO
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **Image Handling:** Cloudinary (Cloud Storage), Multer (Middleware)
- **Styling:** Bootstrap 5

---

## Local Setup and Installation

To run this project on your local machine, follow these steps:

### Prerequisites

- Node.js installed
- npm or yarn installed
- MongoDB installed and running locally
- A free Cloudinary account for image storage

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` root and add your credentials:
    ```
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

### Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.
