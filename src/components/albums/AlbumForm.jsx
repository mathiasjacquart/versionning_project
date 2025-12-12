// src/components/albums/AlbumForm.jsx
import { useState, useEffect } from "react";

const AlbumForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Le titre est obligatoire !");
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="album-form" onSubmit={handleSubmit}>
      <div>
        <label>Titre :</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Enregistrer</button>
      {onCancel && <button type="button" onClick={onCancel}>Annuler</button>}
    </form>
  );
};

export default AlbumForm;
