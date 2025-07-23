import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './storePage.css';
import PostFeedLoader from '../../components/createpost/PostFeedLoader';
import Navebar from '../../components/Navbar/Navbar';

export default function MarketPage() {
  const [sellPosts, setSellPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSellPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('category', 'Sell Product')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sell posts:', error);
        setErrorMsg('Failed to load products. Please try again later.');
      } else {
        setSellPosts(data);
      }
      setLoading(false);
    };

    fetchSellPosts();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setSelectedMethod('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setSelectedMethod('');
  };

  const handleMethodClick = (method) => {
    setSelectedMethod(method);
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      alert("Failed to delete post.");
      console.error(error);
    } else {
      setSellPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const getAccountInfo = () => {
    const name = selectedPost?.profiles?.full_name || 'Seller';
    const contact = selectedPost?.contact || 'N/A';
    const linkedWithJazzCash = selectedPost?.linkedWithJazzCash || 'no';
    const bankName = selectedPost?.bank_name;
    const accountTitle = selectedPost?.bank_account_title;
    const accountNumber = selectedPost?.bank_account_number;

    switch (selectedMethod) {
      case 'EasyPaisa':
      case 'JazzCash':
        return linkedWithJazzCash === 'yes' ? (
          <div className="account-info">
            <p><strong>Account Title:</strong> {name}</p>
            <p><strong>Mobile No:</strong> {contact}</p>
          </div>
        ) : (
          <p style={{ color: 'red' }}>Seller has not linked this number with JazzCash or EasyPaisa.</p>
        );

      case 'Bank Transfer':
        return linkedWithJazzCash === 'no' && bankName && accountNumber && accountTitle ? (
          <div className="account-info">
            <p><strong>Bank Name:</strong> {bankName}</p>
            <p><strong>Account Title:</strong> {accountTitle}</p>
            <p><strong>Account No:</strong> {accountNumber}</p>
          </div>
        ) : (
          <p style={{ color: 'red' }}>Bank details are not provided.</p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="market-page">
      <Navebar />
      <h2 className="market-heading">🛒 Explore Marketplace</h2>

      {loading ? (
        <p className="loading-msg"><PostFeedLoader /></p>
      ) : errorMsg ? (
        <p className="error-msg">{errorMsg}</p>
      ) : sellPosts.length === 0 ? (
        <p className="no-posts-msg">No products available for sale right now.</p>
      ) : (
        <div className="market-grid">
          {sellPosts.map((post) => (
            <div key={post.id} className="product-card">
              <div className="user-info">
                <img
                  src={post.profiles?.avatar_url || '/default-avatar.png'}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <div>
                  <p className="user-name">{post.profiles?.full_name || 'Unknown User'}</p>
                  <p className="post-date">{formatDateTime(post.created_at)}</p>
                </div>
              </div>

              {post.media_url ? (
                <img
                  src={post.media_url}
                  alt="Product"
                  className="product-image"
                />
              ) : (
                <div className="image-placeholder">No Image</div>
              )}

              <div className="product-details">
                <h3 className="product-title">{post.title || 'Untitled Product'}</h3>
                <p className="product-desc"><strong>Description:</strong> {post.content || 'No description provided.'}</p>
                <p className="product-price"><strong>Price:</strong> {post.price ? `${post.price} PKR` : 'Not listed'}</p>
                <p className="product-contact">
                  <strong>Contact:</strong> {post.contact || 'N/A'}
                  {post.linkedWithJazzCash === 'yes' && <span> (JazzCash/EasyPaisa)</span>}
                </p>

                <button className="shop-now-btn" onClick={() => openModal(post)}>Shop Now</button>

                {post.user_id === currentUserId && (
                  <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>🗑 Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">🛍 Purchase Options</h3>
            <p><strong>Product:</strong> {selectedPost.title}</p>
            <p><strong>Price:</strong> {selectedPost.price} PKR</p>

            <div className="payment-options">
              <p><strong>Select Payment Method:</strong></p>
              <div className="payment-buttons">
                <button onClick={() => handleMethodClick('EasyPaisa')}>EasyPaisa</button>
                <button onClick={() => handleMethodClick('JazzCash')}>JazzCash</button>
                <button onClick={() => handleMethodClick('Bank Transfer')}>Bank Transfer</button>
              </div>
              {selectedMethod && getAccountInfo()}
            </div>

            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
