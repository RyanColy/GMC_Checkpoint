import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useDebounce from "../../hooks/useDebounce";

const Avatar = ({ user }) => {
  if (user.avatar) {
    return <img src={user.avatar} alt={user.displayName} className="search-result__avatar" />;
  }
  return (
    <div className="search-result__avatar search-result__avatar--initials">
      {user.displayName[0].toUpperCase()}
    </div>
  );
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    api
      .get(`/users/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(({ data }) => {
        if (!cancelled) {
          setResults(data);
          setOpen(true);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (user) => {
    setQuery("");
    setOpen(false);
    // Phase 4 will handle the conversation creation — navigate to the user's conversation URL
    navigate(`/conversation/${user._id}`);
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <input
        className="search-bar__input"
        type="text"
        placeholder="Search by @handle…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />

      {loading && <span className="search-bar__spinner" />}

      {open && results.length > 0 && (
        <ul className="search-bar__results">
          {results.map((user) => (
            <li
              key={user._id}
              className="search-result"
              onMouseDown={() => handleSelect(user)}
            >
              <Avatar user={user} />
              <div className="search-result__info">
                <span className="search-result__name">{user.displayName}</span>
                <span className="search-result__handle">@{user.handle}</span>
              </div>
              {user.isOnline && <span className="search-result__online" />}
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && debouncedQuery.length >= 2 && (
        <div className="search-bar__empty">No users found</div>
      )}
    </div>
  );
};

export default SearchBar;
