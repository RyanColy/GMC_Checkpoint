import { useState, useRef } from "react";
import { Camera } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ displayName: user?.displayName || "", bio: user?.bio || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put("/users/profile", form);
      setUser((prev) => ({ ...prev, ...data }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const { data } = await api.put("/users/profile", formData);
      setUser((prev) => ({ ...prev, avatar: data.avatar }));
    } catch {
      setError("Failed to upload avatar");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Your Profile</h2>

        <div className="profile-avatar-wrap" onClick={() => fileRef.current?.click()}>
          {user?.avatar
            ? <img src={user.avatar} alt={user.displayName} />
            : <span>{user?.displayName?.[0]?.toUpperCase()}</span>}
          <div className="profile-avatar-wrap__overlay"><Camera size={20} weight="bold" /></div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />

        {error && <p className="auth-form__error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Display name
            <input name="displayName" value={form.displayName} onChange={handleChange} required />
          </label>
          <label>
            Handle
            <input value={`@${user?.handle}`} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
          </label>
          <label>
            Bio
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} maxLength={160} placeholder="Tell others about yourself..." />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
