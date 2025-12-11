import "./UserProfile.css";

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <div className="user-profile__avatar">
        {(user.displayName || user.email || "U")
          .charAt(0)
          .toUpperCase()}
      </div>
      <div className="user-profile__info">
        <p className="user-profile__name">
          {user.displayName || user.email}
        </p>
        {user.displayName && (
          <p className="user-profile__email">{user.email}</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

