import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useUser } from '../../../../context/UserContext';
import './CommentModal.css';

export default function CommentBox({ postId }) {
  const { userData } = useUser();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const inputRef = useRef(null);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching comments:', error.message);
    } else {
      setComments(data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      // ✅ Step 1: Insert comment
      const { data: insertedComment, error: insertError } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            user_id: userData.id,
            comment: commentText.trim(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error posting comment:', insertError.message);
        return;
      }

      setCommentText('');

      // ✅ Step 2: Get Post Owner
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (postError) {
        console.error('❌ Error getting post owner:', postError.message);
        return;
      }

      // ✅ Step 3: Insert Notification
      if (postData?.user_id && postData.user_id !== userData.id) {
        const { error: notifError } = await supabase.from('comment_notifications').insert([
          {
            sender_id: userData.id,
            receiver_id: postData.user_id,
            post_id: postId,
            comment_id: insertedComment.id,
            type: 'comment',
            created_at: new Date().toISOString(),
          },
        ]);

        if (notifError) {
          console.error('❌ Error sending comment notification:', notifError.message);
        }
      }

      await fetchComments();
    } catch (err) {
      console.error('❌ Unexpected error:', err.message);
    }
  };

  const handleDelete = async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userData.id);

    if (error) {
      console.error('❌ Error deleting comment:', error.message);
    } else {
      await fetchComments();
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditedText(comment.comment);
  };

  const handleEditSubmit = async () => {
    if (!editedText.trim()) return;

    const { error } = await supabase
      .from('comments')
      .update({ comment: editedText.trim() })
      .eq('id', editingCommentId)
      .eq('user_id', userData.id);

    if (error) {
      console.error('❌ Error updating comment:', error.message);
    } else {
      setEditingCommentId(null);
      setEditedText('');
      await fetchComments();
    }
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditedText('');
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comment-box always-show">
      <div className="comment-section">
        <div className="comment-input-wrapper">
          <textarea
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 200)}
            placeholder="Write a comment..."
          />
          {(inputFocused || commentText.trim()) && (
            <button
              className="post-button"
              onClick={handleSubmit}
              disabled={!commentText.trim()}
            >
              Post
            </button>
          )}
        </div>

        <div className="comment-list">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <img
                  src={comment.profiles?.avatar_url || '/assets/default-avatar.png'}
                  alt="avatar"
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <strong>{comment.profiles?.full_name || 'User'}</strong>

                  {editingCommentId === comment.id ? (
                    <div className="edit-wrapper">
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="edit-textarea"
                      />
                      <div className="edit-buttons">
                        <button onClick={handleEditSubmit} className="save-btn">💾 Save</button>
                        <button onClick={cancelEdit} className="cancel-btn">❌ Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p>{comment.comment}</p>
                  )}
                </div>

                {comment.user_id === userData.id && editingCommentId !== comment.id && (
                  <div className="comment-actions">
                    <button
                      className="edit-comment-button"
                      onClick={() => handleEdit(comment)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-comment-button"
                      onClick={() => handleDelete(comment.id)}
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
