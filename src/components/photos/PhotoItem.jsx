// src/components/photos/PhotoItem.jsx
import React from "react";

const PhotoItem = ({ photo, onEdit, onDelete }) => {
  return (
    <div className="photo-item">
      <img src={photo.imageUrl} alt={photo.title} width={200} />
      <h4>{photo.title}</h4>
      <p>{photo.description}</p>
      <button onClick={() => onEdit(photo)}>Modifier</button>
      <button onClick={() => onDelete(photo)}>Supprimer</button>
    </div>
  );
};

export default PhotoItem;
