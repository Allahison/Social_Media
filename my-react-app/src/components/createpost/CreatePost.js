import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './CreatePost.css';
import { useUser } from '../../context/UserContext';
import SellProductModal from './SellProductModal';

// ✅ Central function to create post & send notifications
export const createPostWithNotification = async (
  userData,
  content,
  media_url,
  media_type,
  category = 'media'
) => {
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert([{
      user_id: userData.id,
      content,
      media_url,
      media_type,
      username: userData.full_name,
      avatar_url: userData.avatar_url,
      category,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (postError) return console.error('❌ Error creating post:', postError.message);

  const postId = postData.id;

  const { data: followers, error: followersError } = await supabase
    .from('followers')
    .select('follower_id')
    .eq('followed_id', userData.id);

  if (followersError) return console.error('❌ Fetch followers error:', followersError.message);
  if (!followers || followers.length === 0) return;

  const notifications = followers.map(f => ({
    sender_id: userData.id,
    receiver_id: f.follower_id,
    type: 'new_post',
    post_id: postId,
    created_at: new Date().toISOString(),
    read: false,
  }));

  const { error: notifError } = await supabase.from('notifications').insert(notifications);
  if (notifError) console.error('❌ Notification error:', notifError.message);
};

export default function CreatePost() {
  const { userData } = useUser();
  const [showExpanded, setShowExpanded] = useState(false);
  const [category, setCategory] = useState('media');
  const [showSellModal, setShowSellModal] = useState(false);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const avatarUrl = userData?.avatar_url || '/assets/default-avatar.png';
  const fullName = userData?.full_name || 'Anonymous';

  useEffect(() => {
    document.body.classList.toggle('modal-open', showExpanded || showSellModal);
  }, [showExpanded, showSellModal]);

  const handleMediaSelect = () => fileInputRef.current?.click();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) setMedia(file);
  };

  const handlePost = async () => {
    if (!content && !media) return;
    if (!userData?.id) return alert('User not authenticated.');

    setUploading(true);
    try {
      let mediaUrl = null, mediaType = null;

      if (media) {
        const fileExt = media.name.split('.').pop();
        const filePath = `${userData.id}/posts/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(filePath, media, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData, error: publicUrlError } = await supabase.storage
          .from('post-media')
          .getPublicUrl(filePath);

        if (publicUrlError) throw publicUrlError;

        mediaUrl = publicUrlData.publicUrl;
        mediaType = media.type.startsWith('image') ? 'image' : media.type.startsWith('video') ? 'video' : null;
      }

      // ✅ This sets the post category to 'media'
      await createPostWithNotification(userData, content, mediaUrl, mediaType, 'media');

      setContent('');
      setMedia(null);
      setShowExpanded(false);
      window.location.reload();
    } catch (err) {
      console.error('❌ Post Error:', err);
      alert('Something went wrong while posting.');
    }
    setUploading(false);
  };

  if (!userData) return null;

  return (
    <>
      <div className="create-post-container">
        <div className="create-post-collapsed" onClick={() => setShowExpanded(true)}>
          <img src={avatarUrl} alt="avatar" className="create-post-avatar" />
          <input type="text" placeholder="What's on your mind?" readOnly />
        </div>

        {showExpanded && (
          <div className="post-modal-backdrop">
            <div className="post-modal">
              <div className="post-modal-header">
                <img src={avatarUrl} alt="avatar" className="create-post-avatar" />
                <span>{fullName}</span>
                <select
                  value={category}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setCategory(selected);
                    if (selected === 'sell') {
                      setShowExpanded(false);
                      setShowSellModal(true); // 👈 open product modal only
                    }
                  }}
                >
                  <option value="media">Photo/Video</option>
                  <option value="sell">Sell Product</option>
                </select>
              </div>

              <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {media && (
                <div className="media-preview">
                  <p>{media.name}</p>
                </div>
              )}

              <div className="post-modal-actions">
                <button onClick={handleMediaSelect}>📷 Photo/Video</button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaChange}
                />
              </div>

              <div className="post-modal-footer">
                <button onClick={() => setShowExpanded(false)}>Cancel</button>
                <button
                  onClick={handlePost}
                  disabled={uploading || (!content && !media)}
                  className="createpost-button"
                >
                  {uploading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSellModal && <SellProductModal onClose={() => setShowSellModal(false)} />}
    </>
  );
}
