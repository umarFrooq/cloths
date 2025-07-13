import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { getContactMessages } from '../../services/adminApiService';
import { useAuth } from '../../contexts/AuthContext';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getContactMessages(user.token);
        setMessages(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch contact messages.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchMessages();
    }
  }, [user]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Contact Messages</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Received</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr key={msg._id}>
              <td>{index + 1}</td>
              <td>{msg.name}</td>
              <td><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
              <td>{msg.phone || 'N/A'}</td>
              <td>{msg.subject}</td>
              <td>{msg.message}</td>
              <td>{new Date(msg.createdAt).toLocaleString()}</td>
              <td>
                <Badge bg={msg.isRead ? 'secondary' : 'success'}>
                  {msg.isRead ? 'Read' : 'Unread'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ContactMessagesPage;
