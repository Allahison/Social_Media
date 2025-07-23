import React from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import './ImageCropModal.css';

export default function ImageCropModal({
  open,
  imageSrc,
  crop,
  zoom,
  aspect,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Crop Image</h3>

        <div className="cropper-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            cropShape={aspect === 1 ? 'round' : 'rect'}
            showGrid={false}
          />
        </div>

        <div className="slider-container">
          <label>Zoom</label>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e, z) => onZoomChange(z)}
            aria-label="Zoom"
          />
        </div>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
