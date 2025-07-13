import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import './ChatModal.css';

const SOCKET_URL = 'http://localhost:5000';

export default function ChatModal({ token, request, onClose, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null); // This state holds the ID
  const [isReady, setIsReady] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!request) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('receiveMessage', (incomingMessage) => {
      setMessages(prevMessages => {
        if (prevMessages.some(msg => msg._id === incomingMessage._id)) {
          return prevMessages;
        }
        return [...prevMessages, incomingMessage];
      });
    });

    const setupChat = async () => {
      try {
        const convRes = await fetch(`http://localhost:5000/api/messages/request/${request._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!convRes.ok) throw new Error('Could not fetch conversation.');
        const conversation = await convRes.json();
        
        
        setConversationId(conversation._id);
        socketRef.current.emit('joinRoom', conversation._id);
        
        const messagesRes = await fetch(`http://localhost:5000/api/messages/conversation/${conversation._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!messagesRes.ok) throw new Error('Could not fetch messages.');
        const messageHistory = await messagesRes.json();

        setMessages(messageHistory);
        setIsReady(true);
      } catch (error) {
        toast.error(error.message || 'Failed to initialize chat.');
        onClose();
      }
    };
    
    setupChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage');
        socketRef.current.disconnect();
      }
    };
  }, [request, token, onClose]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !isReady || !socketRef.current) return;
    
    socketRef.current.emit('sendMessage', {
      conversationId: conversationId, 
      senderId: currentUserId,
      content: newMessage,
    });
    
    setNewMessage('');
  };

  if (!request) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-content">
        <div className="chat-modal-header">
          <h5>Chat about: {request.bookId.title}</h5>
          <button onClick={onClose} className="btn-close"></button>
        </div>
        <div className="chat-modal-body">
          {!isReady && (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading chat...</span>
              </div>
            </div>
          )}
          {isReady && messages.map((msg) => (
            <div key={msg._id} className={`message-bubble ${msg.senderId._id === currentUserId ? 'sent' : 'received'}`}>
              <strong>{msg.senderId.username}</strong>
              <p>{msg.content}</p>
              <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-modal-footer">
          <form onSubmit={handleSendMessage} className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder={isReady ? "Type a message..." : "Connecting to chat..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              autoComplete="off"
              disabled={!isReady}
            />
            <button type="submit" className="btn btn-primary ms-2" disabled={!isReady}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}