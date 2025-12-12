import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { shareAlbum, unshareAlbum } from "../../firebase";

const AlbumShare = ({ album }) => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleShare = async () => {
    if (!email) return;

    // Recherche de l'utilisateur par email
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setFeedback("Utilisateur introuvable.");
      return;
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;

    await shareAlbum(album.id, userId);
    setFeedback("Album partagé avec succès.");
    setEmail("");
  };

  const handleUnshare = async (uid) => {
    await unshareAlbum(album.id, uid);
    setFeedback("Accès retiré.");
  };

  return (
    <div className="album-share">
      <h3>Partager cet album</h3>

      <input
        type="email"
        placeholder="Email de l'utilisateur"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleShare}>Partager</button>

      {feedback && <p>{feedback}</p>}

      <h4>Utilisateurs ayant accès :</h4>
      <ul>
        {album.sharedWith?.map((uid) => (
          <li key={uid}>
            {uid}
            <button onClick={() => handleUnshare(uid)}>Retirer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumShare;
