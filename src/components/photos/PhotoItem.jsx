import React from "react";

const PhotoItem = ({ photo, onEdit, onDelete }) => {
  return (
    <div className="photo-item">
      <div className="photo-item__image-wrapper">
        <img src={photo.imageUrl} alt={photo.title || "Photo"} />
      </div>
      <div className="photo-item__content">
        {photo.title && <h4>{photo.title}</h4>}
        {photo.description && <p>{photo.description}</p>}
      </div>
      <div className="photo-item__actions">
        <button className="photo-item__edit-btn" onClick={() => onEdit(photo)}>
          Modifier
        </button>
        <button
          className="photo-item__delete-btn"
          onClick={() => onDelete(photo)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default PhotoItem;
