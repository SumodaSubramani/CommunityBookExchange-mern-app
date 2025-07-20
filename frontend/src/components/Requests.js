import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import ChatModal from './ChatModal';
import ConfirmationModal from './ConfirmationModal';
import RatingModal from './RatingModal';

export default function Requests({ token }) {
  const [requests, setRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [chatRequest, setChatRequest] = useState(null);
  const [showDeliverConfirmModal, setShowDeliverConfirmModal] = useState(false);
  const [requestToDeliver, setRequestToDeliver] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [requestToRate, setRequestToRate] = useState(null);
  const navigate = useNavigate();

  const handleCloseChat = useCallback(() => setChatRequest(null), []);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const decoded = jwtDecode(token);
    setCurrentUserId(decoded.userId);
    fetch('http://localhost:5000/api/requests', { headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json()).then(setRequests).catch(console.error);
  }, [token, navigate]);

  const handleStatusUpdate = async (id, status) => {
    await fetch(`http://localhost:5000/api/requests/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }),});
    setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
    toast.success(`Request has been ${status}.`);
  };
  
  const viewContact = async (id) => {
    try {
        const res = await fetch(`http://localhost:5000/api/requests/${id}/contact`, { headers: { Authorization: `Bearer ${token}` }});
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setContactInfo(data);
    } catch(err) { toast.error(err.message); }
  };

  // --- THIS IS THE MISSING FUNCTION ---
  const handleMarkAsSent = async (requestId) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${requestId}/sent`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(req => req._id === requestId ? { ...req, deliveryStatus: 'sent' } : req));
      toast.success('Marked as sent! Waiting for receiver to confirm.');
    } catch (error) { toast.error(error.message || 'Failed to mark as sent'); }
  };

  const handleDeliverClick = (request) => {
    setRequestToDeliver(request);
    setShowDeliverConfirmModal(true);
  };

  const handleCloseDeliverModal = () => {
    setRequestToDeliver(null);
    setShowDeliverConfirmModal(false);
  };

  const handleConfirmDelivery = async () => {
    if (!requestToDeliver) return;
    try {
      await fetch(`http://localhost:5000/api/requests/${requestToDeliver._id}/receive`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(req => req._id === requestToDeliver._id ? { ...req, deliveryStatus: 'received' } : req));
      toast.success('Receipt confirmed! The transaction is complete.');
    } catch (error) {
      toast.error(error.message || 'Failed to confirm receipt');
    } finally {
      handleCloseDeliverModal();
    }
  };

  const handleRateClick = (request) => {
    setRequestToRate(request);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating, comment) => {
    if (!requestToRate) return;
    const userToRateId = currentUserId === requestToRate.ownerId._id ? requestToRate.requesterId._id : requestToRate.ownerId._id;
    const isOwnerRating = currentUserId === requestToRate.ownerId._id;
    try {
        await fetch(`http://localhost:5000/api/user/rate/${userToRateId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ rating, comment, requestId: requestToRate._id })
        });
        toast.success("Thank you for your rating!");
        setRequests(requests.map(r => {
          if (r._id === requestToRate._id) {
            return isOwnerRating ? { ...r, isRatedByOwner: true } : { ...r, isRatedByRequester: true };
          }
          return r;
        }));
        setShowRatingModal(false);
    } catch (error) { 
        toast.error("Failed to submit rating"); 
    }
  };

  const infoToShow = contactInfo && contactInfo.owner ? (currentUserId === contactInfo.owner._id ? contactInfo.requester : contactInfo.owner) : null;
  const incoming = requests.filter(req => req.ownerId._id === currentUserId);
  const outgoing = requests.filter(req => req.requesterId._id === currentUserId);
  const hasUserRated = (req) => {
      const isOwner = req.ownerId._id === currentUserId;
      return isOwner ? req.isRatedByOwner : req.isRatedByRequester;
  };

  return (
    <div className="container py-2">
      {chatRequest && <ChatModal token={token} request={chatRequest} onClose={handleCloseChat} currentUserId={currentUserId} />}
      <ConfirmationModal show={showDeliverConfirmModal} onClose={handleCloseDeliverModal} onConfirm={handleConfirmDelivery} title="Confirm Receipt" confirmText="Yes, I've Received It" confirmButtonClass="btn-success">
        <p>Please confirm that you have received the book titled: <strong>"{requestToDeliver?.bookId?.title}"</strong>?</p>
        <p className="text-muted">This will complete the transaction.</p>
      </ConfirmationModal>
      <RatingModal 
        show={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        title={`Rate your exchange for "${requestToRate?.bookId?.title}"`}
      />

      <h2 className="mb-4">My Requests</h2>
      {infoToShow && (
        <div className="card bg-light mb-4 border-secondary">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Contact Information</strong>
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setContactInfo(null)}></button>
          </div>
          <div className="card-body">
            <p><strong>Username:</strong> {infoToShow.username}</p>
            <p><strong>Email:</strong> {infoToShow.email}</p>
            <p className="mb-0"><strong>Phone:</strong> {infoToShow.phone}</p>
          </div>
        </div>
      )}
      
      <div className="card card-ui">
        <div className="card-header bg-white py-3"><h4 className="mb-0">Incoming Requests</h4></div>
        <div className="card-body"><div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Book Title</th><th>Requester</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
            <tbody>{incoming.map(req => (<tr key={req._id}>
                <td>{req.bookId.title}</td><td>{req.requesterId.username}</td>
                <td>
                  <span className={`badge rounded-pill text-bg-${req.status === 'accepted' ? 'success' : 'warning'}`}>{req.status}</span>
                  {req.deliveryStatus === 'sent' && <span className="badge rounded-pill text-bg-info ms-2">Sent</span>}
                  {req.deliveryStatus === 'received' && <span className="badge rounded-pill text-bg-dark ms-2">Completed</span>}
                </td>
                <td className="text-end"><div className="d-flex justify-content-end gap-2">
                    {req.status === 'pending' && (<><button onClick={() => handleStatusUpdate(req._id, 'accepted')} className="btn btn-success btn-sm">Accept</button><button onClick={() => handleStatusUpdate(req._id, 'rejected')} className="btn btn-danger btn-sm">Reject</button></>)}
                    {req.status === 'accepted' && req.deliveryStatus === 'pending' && (
                        <button onClick={() => handleMarkAsSent(req._id)} className="btn btn-warning btn-sm">Mark as Sent</button>
                    )}
                    {req.status === 'accepted' && req.deliveryStatus === 'sent' && (<span className="text-muted fst-italic">Waiting for receiver...</span>)}
                    {req.status === 'accepted' && (<><button onClick={() => viewContact(req._id)} className="btn btn-secondary btn-sm">Contact</button><button onClick={() => setChatRequest(req)} className="btn btn-primary btn-sm">Chat</button></>)}
                    {req.deliveryStatus === 'received' && !hasUserRated(req) && (<button onClick={() => handleRateClick(req)} className="btn btn-info btn-sm">Rate Requester</button>)}
                    {req.deliveryStatus === 'received' && hasUserRated(req) && (<span className="text-muted fst-italic ms-2"><i className="bi bi-check-circle-fill text-success"></i> Rated</span>)}
                </div></td>
            </tr>))}</tbody>
          </table>
        </div></div>
      </div>

      <div className="card card-ui mt-5">
        <div className="card-header bg-white py-3"><h4 className="mb-0">Outgoing Requests</h4></div>
        <div className="card-body"><div className="table-responsive">
          <table className="table table-hover align-middle">
          <thead><tr><th>Book Title</th><th>Owner</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
            <tbody>{outgoing.map(req => (<tr key={req._id}>
                <td>{req.bookId.title}</td><td>{req.ownerId.username}</td>
                <td>
                  <span className={`badge rounded-pill text-bg-${req.status === 'accepted' ? 'success' : 'warning'}`}>{req.status}</span>
                  {req.deliveryStatus === 'sent' && <span className="badge rounded-pill text-bg-info ms-2">Shipped</span>}
                  {req.deliveryStatus === 'received' && <span className="badge rounded-pill text-bg-dark ms-2">Completed</span>}
                </td>
                <td className="text-end"><div className="d-flex justify-content-end gap-2">
                    {req.status === 'accepted' && req.deliveryStatus === 'sent' && (<button onClick={() => handleDeliverClick(req)} className="btn btn-success btn-sm">Confirm Receipt</button>)}
                    {req.status === 'accepted' && (<><button onClick={() => viewContact(req._id)} className="btn btn-secondary btn-sm">Contact</button><button onClick={() => setChatRequest(req)} className="btn btn-primary btn-sm">Chat</button></>)}
                    {req.deliveryStatus === 'received' && !hasUserRated(req) && (<button onClick={() => handleRateClick(req)} className="btn btn-info btn-sm">Rate Owner</button>)}
                    {req.deliveryStatus === 'received' && hasUserRated(req) && (<span className="text-muted fst-italic ms-2"><i className="bi bi-check-circle-fill text-success"></i> Rated</span>)}
                </div></td>
            </tr>))}</tbody>
          </table>
        </div></div>
      </div>
    </div>
  );
}