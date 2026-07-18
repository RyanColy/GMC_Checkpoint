import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useSocket } from "../../context/SocketContext";
import useDebounce from "../../hooks/useDebounce";

const MemberSearch = ({ selectedMembers, onAdd }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); return; }
    api.get(`/users/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(({ data }) => setResults(data.filter((u) => !selectedMembers.find((m) => m._id === u._id))))
      .catch(() => {});
  }, [debouncedQuery, selectedMembers]);

  return (
    <div className="member-search">
      <input
        placeholder="Add member by @handle or name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.map((u) => (
        <div key={u._id} className="member-search__result" onMouseDown={() => { onAdd(u); setQuery(""); setResults([]); }}>
          <strong>{u.displayName}</strong> <span>@{u.handle}</span>
        </div>
      ))}
    </div>
  );
};

const GroupManager = ({ onClose, onCreated }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Group name is required");
    if (members.length < 1) return setError("Add at least 1 other member");

    setLoading(true);
    setError("");
    try {
      const { data: group } = await api.post("/groups", {
        name: name.trim(),
        memberIds: members.map((m) => m._id),
      });
      // Join the new group socket room without reconnecting
      socket?.emit("group:join-room", { groupId: group._id });
      onCreated?.(group);
      navigate(`/group/${group._id}`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>New Group</h3>
        {error && <p className="auth-form__error">{error}</p>}
        <form onSubmit={handleCreate}>
          <label>
            Group name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <MemberSearch selectedMembers={members} onAdd={(u) => setMembers((p) => [...p, u])} />
          <div className="modal__members">
            {members.map((m) => (
              <span key={m._id} className="modal__tag">
                {m.displayName}
                <button type="button" onClick={() => setMembers((p) => p.filter((x) => x._id !== m._id))}>×</button>
              </span>
            ))}
          </div>
          <div className="modal__actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? "Creating…" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupManager;
