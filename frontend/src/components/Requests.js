import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import ChatModal from './ChatModal';
import ConfirmationModal from './ConfirmationModal'; // We already have this component

export default function Requests({ token }) {
  const [requests, setRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatRequest, setChatRequest] = useState(null);
  const navigate = useNavigate();

  const [showDeliverConfirmModal, setShowDeliverConfirmModal] = useState(false);
  const [requestToDeliver, setRequestToDeliver] = useState(null);

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
        setSelectedContact(data);
    } catch(err) { toast.error(err.message); }
  };

  // --- DELIVERY HANDLING LOGIC ---

  // 1. This function now just OPENS the modal
  const handleDeliverClick = (request) => {
    setRequestToDeliver(request);
    setShowDeliverConfirmModal(true);
  };

  // 2. This function CLOSES the modal
  const handleCloseDeliverModal = () => {
    setRequestToDeliver(null);
    setShowDeliverConfirmModal(false);
  };

  // 3. This function runs the actual API call when the user confirms
  const handleConfirmDelivery = async () => {
    if (!requestToDeliver) return;

    try {
      const res = await fetch(`http://localhost:5000/api/requests/${requestToDeliver._id}/deliver`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to mark as delivered');
      }
      setRequests(requests.map(req => 
        req._id === requestToDeliver._id ? { ...req, isDelivered: true } : req
      ));
      toast.success('Book marked as delivered!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleCloseDeliverModal();
    }
  };

  const infoToShow = selectedContact ? (currentUserId === selectedContact.owner._id ? selectedContact.requester : selectedContact.owner) : null;
  const incoming = requests.filter(req => req.ownerId._id === currentUserId);
  const outgoing = requests.filter(req => req.requesterId._id === currentUserId);

  return (
    <div className="container py-2">
      {/* Render the chat modal */}
      {chatRequest && <ChatModal token={token} request={chatRequest} onClose={handleCloseChat} currentUserId={currentUserId} />}
      
      {/* --- RENDER THE NEW DELIVERY CONFIRMATION MODAL --- */}
      <ConfirmationModal
        show={showDeliverConfirmModal}
        onClose={handleCloseDeliverModal}
        onConfirm={handleConfirmDelivery}
        title="Confirm Delivery"
      >
        <p>Are you sure you have delivered the book titled: <strong>"{requestToDeliver?.bookId?.title}"</strong>?</p>
        <p className="text-danger">This action will remove the book from public listings and cannot be undone.</p>
      </ConfirmationModal>

      <h2 className="mb-4">My Requests</h2>
      {infoToShow && ( /* Contact Card JSX */
        <div className="card bg-light mb-4 border-secondary">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Contact Information</strong>
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedContact(null)}></button>
          </div>
          <div className="card-body">
            <p><strong>Username:</strong> {infoToShow.username}</p>
            <p><strong>Email:</strong> {infoToShow.email}</p>
            <p className="mb-0"><strong>Phone:</strong> {infoToShow.phone}</p>
          </div>
        </div>
      )}
      
      <div className="card card-ui">
        <div className="card-header bg-white py-3"><h4 className="mb-0">Incoming Requests (Books you own)</h4></div>
        <div className="card-body"><div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th scope="col">Book Title</th><th scope="col">Requester</th><th scope="col">Status</th><th scope="col" className="text-end">Actions</th></tr></thead>
            <tbody>{incoming.map(req => (<tr key={req._id}><td>{req.bookId.title}</td><td>{req.requesterId.username}</td><td>
              <span className={`badge rounded-pill text-bg-${req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}`}>{req.status}</span>
              {req.isDelivered && <span className="badge rounded-pill text-bg-dark ms-2">Delivered</span>}
            </td>
            <td className="text-end">
              <div className="d-flex justify-content-end gap-2">
                {req.status === 'pending' && (<><button onClick={() => handleStatusUpdate(req._id, 'accepted')} className="btn btn-success btn-sm">Accept</button><button onClick={() => handleStatusUpdate(req._id, 'rejected')} className="btn btn-danger btn-sm">Reject</button></>)}
                {req.status === 'accepted' && (
                  <>
                    {!req.isDelivered ? (
                      // The button now calls handleDeliverClick
                      <button onClick={() => handleDeliverClick(req)} className="btn btn-warning btn-sm">
                        Mark as Delivered
                      </button>
                    ) : (
                      <button className="btn btn-outline-success btn-sm" disabled>Completed</button>
                    )}
                    <button onClick={() => viewContact(req._id)} className="btn btn-secondary btn-sm">Contact</button>
                    <button onClick={() => setChatRequest(req)} className="btn btn-primary btn-sm">Chat</button>
                  </>
                )}
              </div>
            </td>
            </tr>))}</tbody>
          </table>
        </div></div>
      </div>

      <div className="card card-ui mt-5">
        <div className="card-header bg-white py-3"><h4 className="mb-0">Outgoing Requests (Books you want)</h4></div>
        <div className="card-body"><div className="table-responsive">
          <table className="table table-hover align-middle">
          <thead><tr><th scope="col">Book Title</th><th scope="col">Owner</th><th scope="col">Status</th><th scope="col" className="text-end">Actions</th></tr></thead>
            <tbody>{outgoing.map(req => (<tr key={req._id}><td>{req.bookId.title}</td><td>{req.ownerId.username}</td><td>
              <span className={`badge rounded-pill text-bg-${req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}`}>{req.status}</span>
              {req.isDelivered && <span className="badge rounded-pill text-bg-dark ms-2">Delivered</span>}
            </td>
            <td className="text-end">
              <div className="d-flex justify-content-end gap-2">
                {req.status === 'accepted' && (<><button onClick={() => viewContact(req._id)} className="btn btn-secondary btn-sm">Contact</button><button onClick={() => setChatRequest(req)} className="btn btn-primary btn-sm">Chat</button></>)}
              </div>
            </td>
            </tr>))}</tbody>
          </table>
        </div></div>
      </div>
    </div>
  );
}