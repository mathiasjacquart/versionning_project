import { useState, useEffect } from "react";

const PhotoForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
  }, [initialData.title, initialData.description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Le titre est obligatoire !");
    onSubmit({ title, description, file });
    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="photo-form">
      <h3 className="photo-form__title">
        {initialData.id ? "Modifier la photo" : "Ajouter une nouvelle photo"}
      </h3>
      <div className="photo-form__field">
        <label htmlFor="photo-title">Titre :</label>
        <input
          id="photo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre de la photo"
          required
        />
      </div>

      <div className="photo-form__field">
        <label htmlFor="photo-description">Description :</label>
        <textarea
          id="photo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ajoutez une description (optionnel)"
        />
      </div>

      {!initialData.id && (
        <div className="photo-form__field">
          <label htmlFor="photo-file">Photo :</label>
          <input
            id="photo-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
      )}

      <div className="photo-form__actions">
        <button type="submit" className="photo-form__submit-btn">
          {initialData.id ? "Modifier" : "Ajouter"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="photo-form__cancel-btn"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default PhotoForm;
