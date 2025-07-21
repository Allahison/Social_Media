import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './CreatePost.css';
import { useUser } from '../../context/UserContext';

// ✅ External Post Creation with Notification
export const createPostWithNotification = async (userData, content, media_url, media_type) => {
  const { data: postData, error: postError } = await supabase.from('posts').insert([
    {
      user_id: userData.id,
      content,
      media_url,
      media_type,
      username: userData.full_name,
      avatar_url: userData.avatar_url,
      created_at: new Date().toISOString()
    }
  ]).select().single();

  if (postError) {
    console.error("❌ Error creating post:", postError.message);
    return;
  }

  const postId = postData.id;

  const { data: followers, error: followersError } = await supabase
    .from('followers')
    .select('follower_id')
    .eq('followed_id', userData.id);

  if (followersError) {
    console.error("❌ Error fetching followers:", followersError.message);
    return;
  }

  if (!followers || followers.length === 0) {
    console.log("ℹ️ No followers to notify.");
    return;
  }

  const notifications = followers.map(follower => ({
    sender_id: userData.id,
    receiver_id: follower.follower_id,
    type: 'new_post',
    post_id: postId,
    created_at: new Date().toISOString(),
    read: false
  }));

  const { error: notifError } = await supabase
    .from('notifications')
    .insert(notifications);

  if (notifError) {
    console.error("❌ Error inserting notifications:", notifError.message);
    return;
  }

  console.log("✅ Post created and notifications sent!");
};

export default function CreatePost() {
  const { userData } = useUser();
  const [showExpanded, setShowExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const avatarUrl = userData?.avatar_url || '/assets/default-avatar.png';
  const fullName = userData?.full_name || 'Anonymous';

  useEffect(() => {
    document.body.classList.toggle('modal-open', showExpanded);
  }, [showExpanded]);

  const handleMediaSelect = () => {
    fileInputRef.current?.click();
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) setMedia(file);
  };

  const handlePost = async () => {
    if (!content && !media) return;
    if (!userData?.id) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    setUploading(true);

    let mediaUrl = null;
    let mediaType = null;

    try {
      if (media) {
        const fileExt = media.name.split('.').pop();
        const filePath = `${userData.id}/posts/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(filePath, media, { upsert: true });

        if (uploadError) {
          console.error("❌ Upload error:", uploadError.message);
          alert('Upload failed: ' + uploadError.message);
          setUploading(false);
          return;
        }

        const { data: publicUrlData, error: publicUrlError } = await supabase.storage
          .from('post-media')
          .getPublicUrl(filePath);

        if (publicUrlError || !publicUrlData?.publicUrl) {
          console.error("❌ Failed to get public URL:", publicUrlError?.message);
          alert('Failed to get media URL.');
          setUploading(false);
          return;
        }

        mediaUrl = publicUrlData.publicUrl;

        if (media.type.startsWith('image')) mediaType = 'image';
        else if (media.type.startsWith('video')) mediaType = 'video';

        console.log("✅ File uploaded. URL:", mediaUrl);
      }

      // ✅ Create post with notification
      await createPostWithNotification(userData, content, mediaUrl, mediaType);

      setContent('');
      setMedia(null);
      setShowExpanded(false);
      window.location.reload();
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert('Something went wrong while posting.');
    }

    setUploading(false);
  };

  if (!userData) return null;

  return (
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
  );
}
