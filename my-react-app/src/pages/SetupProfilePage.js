// src/pages/SetupProfilePage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';
import './SetupProfilePage.css';

export default function SetupProfilePage() {
  const { userData, fetchUserData } = useUser();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Redirect to dashboard if profile is already completed
  useEffect(() => {
    if (
      userData &&
      userData.full_name &&
      userData.description &&
      userData.avatar_url &&
      userData.cover_url
    ) {
      navigate('/dashboard');
    }
  }, [userData, navigate]);

  // ✅ Pre-fill full name and description if already exists
  useEffect(() => {
    if (userData?.full_name) setFullName(userData.full_name);
    if (userData?.description) setDescription(userData.description);
  }, [userData]);

  const handleFileUpload = async (file, pathPrefix) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${pathPrefix}/${fileName}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = userData.avatar_url;
      let coverUrl = userData.cover_url;

      if (avatarFile) {
        avatarUrl = await handleFileUpload(avatarFile, 'avatars');
      }

      if (coverFile) {
        coverUrl = await handleFileUpload(coverFile, 'covers');
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          description,
          avatar_url: avatarUrl,
          cover_url: coverUrl,
        })
        .eq('id', userData.id);

      if (error) throw error;

      await fetchUserData(); // refresh updated profile data
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating profile:', err.message);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-profile-page">
      <h2>Setup Your Profile</h2>
      <form onSubmit={handleSubmit} className="setup-form">
        <label>
          Full Name:
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Profile Picture:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </label>

        <label>
          Cover Photo:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
