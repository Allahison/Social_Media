import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';
import './SetupProfilePage.css';
import ImageCropModal from '../pages/ImageCropModal';

// 🔧 Crop utility
const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        resolve(blob);
      }, 'image/jpeg');
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
};

export default function SetupProfilePage() {
  const { userData, fetchUserData } = useUser();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppingImageType, setCroppingImageType] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropAspect, setCropAspect] = useState(1);
  const [currentImageSrc, setCurrentImageSrc] = useState(null);

  useEffect(() => {
    if (
      userData?.full_name &&
      userData?.description &&
      userData?.avatar_url &&
      userData?.cover_url
    ) {
      navigate('/dashboard');
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (userData?.full_name) setFullName(userData.full_name);
    if (userData?.description) setDescription(userData.description);
  }, [userData]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileUpload = async (fileBlob, folder) => {
    const fileName = `${Date.now()}.jpeg`;
    const filePath = `${folder}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('profile')
      .upload(filePath, fileBlob, { contentType: 'image/jpeg' });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('profile').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleImageSelection = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);

    setCurrentImageSrc(preview);
    setCroppingImageType(type);
    setCropAspect(type === 'avatar' ? 1 : 16 / 9);
    setIsCropModalOpen(true);
  };

  const handleCropConfirm = async () => {
    if (!currentImageSrc || !croppedAreaPixels) return;
    setIsCropModalOpen(false);

    try {
      const croppedBlob = await getCroppedImg(currentImageSrc, croppedAreaPixels);
      const folder = croppingImageType === 'avatar' ? 'avatars' : 'covers';
      const uploadedUrl = await handleFileUpload(croppedBlob, folder);

      if (croppingImageType === 'avatar') {
        setAvatarPreview(URL.createObjectURL(croppedBlob));
        setAvatarUrl(uploadedUrl);
      } else {
        setCoverPreview(URL.createObjectURL(croppedBlob));
        setCoverUrl(uploadedUrl);
      }
    } catch (error) {
      console.error('❌ Cropping/upload error:', error);
      alert('Failed to upload cropped image.');
    }
  };

  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setCurrentImageSrc(null);
    setCroppedAreaPixels(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userData.id)
        .single();

      const profilePayload = {
        id: userData.id,
        full_name: fullName,
        description,
        avatar_url: avatarUrl || userData?.avatar_url,
        cover_url: coverUrl || userData?.cover_url,
        updated_at: new Date(),
      };

      let response;
      if (fetchError) {
        response = await supabase.from('profiles').insert(profilePayload);
      } else {
        response = await supabase.from('profiles').update(profilePayload).eq('id', userData.id);
      }

      if (response.error) throw response.error;

      await fetchUserData();
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error saving profile:', err.message);
      alert('Failed to save profile. Please try again.');
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
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>

        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>

        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={(e) => handleImageSelection(e, 'avatar')} />
          {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="preview-image" />}
        </label>

        <label>
          Cover Photo:
          <input type="file" accept="image/*" onChange={(e) => handleImageSelection(e, 'cover')} />
          {coverPreview && <img src={coverPreview} alt="coverpreview-image" className="coverpreview-image" />}
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      <ImageCropModal
        open={isCropModalOpen}
        imageSrc={currentImageSrc}
        crop={crop}
        zoom={zoom}
        aspect={cropAspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}
