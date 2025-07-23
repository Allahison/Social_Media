import React, { useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { useUser } from '../../context/UserContext';
import './SellProductModal.css';

export default function SellProductModal({ onClose }) {
  const { userData } = useUser();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const [linkedWithJazzCash, setLinkedWithJazzCash] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handlePost = async () => {
    if (!title || !price || !contact || !details || !image || linkedWithJazzCash === '') {
      return alert("Please fill all fields and confirm payment method.");
    }

    if (linkedWithJazzCash === 'no' && (!bankName || !accountTitle || !accountNumber)) {
      return alert("Please enter your bank account details.");
    }

    setUploading(true);
    try {
      const fileExt = image.name.split('.').pop();
      const filePath = `${userData.id}/products/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, image, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData, error: publicUrlError } = await supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);
      if (publicUrlError) throw publicUrlError;

      const mediaUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from('posts').insert([
        {
          user_id: userData.id,
          username: userData.username || '',
          avatar_url: userData.avatar_url || '',
          category: 'Sell Product',
          title,
          price,
          contact,
          content: details,
          media_url: mediaUrl,
          media_type: 'image',
          bank_name: linkedWithJazzCash === 'no' ? bankName : null,
          bank_account_title: linkedWithJazzCash === 'no' ? accountTitle : null,
          bank_account_number: linkedWithJazzCash === 'no' ? accountNumber : null,
        }
      ]);

      if (insertError) throw insertError;

      alert("✅ Product posted successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("❌ Error posting product:", err);
      alert("Something went wrong while posting the product.");
    }

    setUploading(false);
  };

  return (
    <div className="post-modal-backdrop">
      <div className="post-modal">
        <h3>MarketPlace+</h3>

        {/* USER INFO */}
        <div className="user-profile-section">
          <img
            src={userData?.avatar_url || '/default-avatar.png'}
            alt="User Avatar"
            className="user-avatar"
          />
          <div className="user-details">
            <strong>{userData?.full_name || 'Unknown User'}</strong>
            <span style={{ fontSize: '13px', color: '#777' }}>Posting a new product</span>
          </div>
        </div>

        {/* PRODUCT FORM */}
        <input type="text" placeholder="Product Title" onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Price (PKR)" onChange={(e) => setPrice(e.target.value)} />
        <input
          type="text"
          placeholder="Contact Number"
          onChange={(e) => {
            setContact(e.target.value);
            setLinkedWithJazzCash(''); // reset on contact change
          }}
        />
        <textarea placeholder="Product Details" onChange={(e) => setDetails(e.target.value)} />
        <input type="file" ref={fileRef} onChange={(e) => setImage(e.target.files[0])} />

        {/* PAYMENT METHOD LOGIC */}
        {contact.length >= 10 && (
          <div className="payment-section">
            <p>Is this number linked with JazzCash or EasyPaisa?</p>
            <label>
              <input
                type="radio"
                name="payment_linked"
                value="yes"
                checked={linkedWithJazzCash === 'yes'}
                onChange={() => setLinkedWithJazzCash('yes')}
              /> Yes
            </label>
            <label style={{ marginLeft: '15px' }}>
              <input
                type="radio"
                name="payment_linked"
                value="no"
                checked={linkedWithJazzCash === 'no'}
                onChange={() => setLinkedWithJazzCash('no')}
              /> No
            </label>
          </div>
        )}

        {linkedWithJazzCash === 'no' && (
          <div className="bank-details">
            <input type="text" placeholder="Bank Name" onChange={(e) => setBankName(e.target.value)} />
            <input type="text" placeholder="Account Title" onChange={(e) => setAccountTitle(e.target.value)} />
            <input type="text" placeholder="Account Number" onChange={(e) => setAccountNumber(e.target.value)} />
          </div>
        )}

        {/* LIVE PREVIEW */}
        <div className="product-preview">
          <h4>📌 Live Preview:</h4>
          {title && <p><strong>Title:</strong> {title}</p>}
          {price && <p><strong>Price:</strong> {price} PKR</p>}
          {contact && <p><strong>Contact:</strong> {contact}</p>}
          {details && <p><strong>Details:</strong> {details}</p>}
          {image && (
            <div>
              <strong>Image Preview:</strong><br />
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="post-modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handlePost} disabled={uploading}>
            {uploading ? 'Posting...' : 'Post Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
