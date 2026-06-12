import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function Wishlists() {
  const { token } = useAuth();
  const { notify } = useNotifications();

  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [newWishlist, setNewWishlist] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlists();
  }, [token]);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wishlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch wishlists');
      const data = await response.json();
      setWishlists(data);
    } catch (err) {
      setError(err.message);
      notify('Failed to load wishlists', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newWishlist),
      });

      if (!response.ok) throw new Error('Failed to create wishlist');

      const created = await response.json();
      setWishlists([...wishlists, created]);
      setNewWishlist({ name: '', description: '' });
      setShowCreateForm(false);
      notify('Wishlist created successfully');
    } catch (err) {
      setError(err.message);
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    if (!window.confirm('Are you sure you want to delete this wishlist?')) return;

    try {
      const response = await fetch(`/api/wishlists/${wishlistId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete wishlist');

      setWishlists(wishlists.filter((w) => w._id !== wishlistId));
      setSelectedWishlist(null);
      notify('Wishlist deleted successfully');
    } catch (err) {
      setError(err.message);
      notify(err.message, 'error');
    }
  };

  return (
    <div className="container">
      <h1>My Collections</h1>

      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="primary-btn"
        style={{ marginBottom: '2rem' }}
      >
        {showCreateForm ? 'Cancel' : '+ Create Collection'}
      </button>

      {showCreateForm && (
        <form
          onSubmit={handleCreateWishlist}
          className="panel"
          style={{ marginBottom: '2rem', padding: '1.5rem' }}
        >
          <h2>New Collection</h2>
          <label>
            Collection Name *
            <input
              value={newWishlist.name}
              onChange={(e) => setNewWishlist({ ...newWishlist, name: e.target.value })}
              placeholder="e.g., Career Gems"
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={newWishlist.description}
              onChange={(e) => setNewWishlist({ ...newWishlist, description: e.target.value })}
              placeholder="What's this collection for?"
              rows="3"
            />
          </label>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Collection'}
          </button>
        </form>
      )}

      {loading && !wishlists.length ? (
        <p>Loading collections...</p>
      ) : wishlists.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No collections yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {wishlists.map((wishlist) => (
            <div
              key={wishlist._id}
              className="panel"
              style={{ cursor: 'pointer', padding: '1.5rem' }}
              onClick={() => setSelectedWishlist(wishlist._id)}
            >
              <h3>{wishlist.name}</h3>
              {wishlist.description && <p style={{ fontSize: '0.9rem', color: '#666' }}>{wishlist.description}</p>}
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {wishlist.gemstones?.length || 0} gemstones
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWishlist(wishlist._id);
                  }}
                  style={{ padding: '0.5rem 1rem', color: '#d32f2f', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWishlist && (
        <div className="panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
          <h2>
            {wishlists.find((w) => w._id === selectedWishlist)?.name} Details
          </h2>
          <p>Gemstones in this collection:</p>
          <ul>
            {wishlists
              .find((w) => w._id === selectedWishlist)
              ?.gemstones?.map((gem) => (
                <li key={gem._id}>{gem.name}</li>
              )) || <li>No gemstones yet</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
