import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import EditProfileModal from './EditProfileModal';

export default function Profile({ token }) {
    const [profile, setProfile] = useState(null);
    const [givenRatings, setGivenRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    // The function to fetch data is perfect as is.
    const fetchAllData = useCallback(async () => {
        if (!token) return;
        // Don't set loading to true here on every focus, only on initial load.
        // This prevents a jarring "Loading..." flicker.
        try {
            const [profileRes, givenRatingsRes] = await Promise.all([
                fetch('http://localhost:5000/api/user/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/user/ratings/given', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (!profileRes.ok || !givenRatingsRes.ok) throw new Error('Failed to fetch profile data');
            const profileData = await profileRes.json();
            const givenRatingsData = await givenRatingsRes.json();
            setProfile(profileData);
            setGivenRatings(givenRatingsData);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false); // Stop loading once done.
        }
    }, [token]);

    // This useEffect handles the INITIAL data load when the component first mounts.
    useEffect(() => {
        if (!token) navigate('/login');
        else fetchAllData();
    }, [token, navigate, fetchAllData]);

    // --- THIS IS THE NEW FIX ---
    // This useEffect adds an event listener to re-fetch data whenever the
    // user navigates back to this page or brings the browser tab into focus.
    useEffect(() => {
        const handleFocus = () => {
            console.log("Window focused, re-fetching profile data...");
            fetchAllData();
        };

        // Add the event listener
        window.addEventListener('focus', handleFocus);

        // Cleanup function: This is crucial to prevent memory leaks.
        // It removes the listener when the component unmounts.
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [fetchAllData]); // The dependency array ensures the listener always has the latest fetchAllData function.

    // The handler for the "Edit Profile" modal also re-fetches data.
    const handleProfileUpdate = async (updatedData) => {
        try {
            await fetch('http://localhost:5000/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedData)
            });
            toast.success("Profile updated successfully!");
            setIsEditModalOpen(false);
            fetchAllData(); // Re-fetch after an edit
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Loading Profile...</h4></div>;
    if (!profile) return <div className="text-center p-5"><h4>Could not load profile.</h4></div>;

    // The JSX part of your component is correct and remains unchanged.
    return (
        <>
            <EditProfileModal
                show={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={profile}
                onUpdate={handleProfileUpdate}
            />
            <div className="container py-4">
                {/* Profile Info Card */}
                <div className="card card-ui mb-5">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <h2 className="mb-0">My Profile</h2>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditModalOpen(true)}>
                                <i className="bi bi-pencil-square me-1"></i> Edit Profile
                            </button>
                        </div>
                        <div className="text-center">
                            <i className="bi bi-person-circle" style={{ fontSize: '6rem', color: '#6c757d' }}></i>
                            <h3 className="card-title mt-3">{profile.username}</h3>
                            <p className="text-muted mb-1">{profile.email}</p>
                            <p className="text-muted">{profile.phone ? `${profile.phone} | ` : ''}{profile.city}, {profile.state}</p>
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <StarRating rating={profile.averageRating} readOnly={true} />
                                <span className="ms-2 fs-5 text-muted">({profile.ratings.length} ratings)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings Received Section */}
                <div className="mb-5">
                    <h3 className="mb-3">Ratings You've Received</h3>
                    {profile.ratings.length > 0 ? (
                        <div className="list-group">
                            {profile.ratings.map((r) => (
                                <div key={r._id} className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between align-items-center">
                                        <h5 className="mb-1">{r.user?.username || 'A user'} rated you</h5>
                                        <StarRating rating={r.rating} readOnly={true} />
                                    </div>
                                    {r.comment && <p className="mb-1 mt-2 fst-italic">"{r.comment}"</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-3 bg-light rounded"><p className="mb-0">You have not received any ratings yet.</p></div>
                    )}
                </div>

                {/* Ratings Given Section */}
                <div>
                    <h3 className="mb-3">Ratings You've Given</h3>
                    {givenRatings.length > 0 ? (
                        <div className="list-group">
                            {givenRatings.map((r) => (
                                <div key={r._id} className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between align-items-center">
                                        <h5 className="mb-1">You rated {r.ratedUser?.username || 'a user'}</h5>
                                        <StarRating rating={r.rating} readOnly={true} />
                                    </div>
                                    {r.comment && <p className="mb-1 mt-2 fst-italic">"{r.comment}"</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-3 bg-light rounded"><p className="mb-0">You have not rated any users yet.</p></div>
                    )}
                </div>
            </div>
        </>
    );
}