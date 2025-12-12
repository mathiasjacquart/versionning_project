// src/components/albums/AlbumItem.jsx
import React from "react";

const AlbumItem = ({ album, onEdit, onDelete }) => {
  return (
    <div className="album-item">
      <h3>{album.title}</h3>
      <p>{album.description}</p>
      <button onClick={() => onEdit(album)}>Modifier</button>
      <button onClick={() => onDelete(album.id)}>Supprimer</button>
    </div>
  );
};

export default AlbumItem;
