import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Moon, Sun, Plus, Gear } from "@phosphor-icons/react";
import { formatConversationDate } from "../../utils/formatDate";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../search/SearchBar";
import GroupManager from "../group/GroupManager";
import useDarkMode from "../../hooks/useDarkMode";

const ConversationItem = ({ item, currentUserId, isActive }) => {
  const navigate = useNavigate();
  const isGroup = item._type === "group";
  const displayName = isGroup ? item.name : item.participants?.find((p) => p._id !== currentUserId)?.displayName;
  const avatar = isGroup ? item.avatar : item.participants?.find((p) => p._id !== currentUserId)?.avatar;
  const isOnline = !isGroup && item.participants?.find((p) => p._id !== currentUserId)?.isOnline;
  const last = item.lastMessage;

  const handleClick = () => {
    if (isGroup) navigate(`/group/${item._id}`);
    else {
      const other = item.participants?.find((p) => p._id !== currentUserId);
      if (other) navigate(`/conversation/${other._id}`);
    }
  };

  return (
    <li className={`sidebar-item ${isActive ? "sidebar-item--active" : ""}`} onClick={handleClick}>
      <div className="sidebar-item__avatar-wrap">
        <div className="sidebar-item__avatar">
          {avatar ? <img src={avatar} alt={displayName} /> : <span>{displayName?.[0]?.toUpperCase()}</span>}
        </div>
        {isOnline && <span className="sidebar-item__online" />}
        {isGroup && <span className="sidebar-item__group-badge">G</span>}
      </div>
      <div className="sidebar-item__body">
        <div className="sidebar-item__top">
          <span className="sidebar-item__name">{displayName}</span>
          <span className="sidebar-item__time">{formatConversationDate(item.updatedAt)}</span>
        </div>
        <p className="sidebar-item__preview">
          {!last
            ? "No messages yet"
            : isGroup
              ? `${last.sender?._id?.toString() === currentUserId ? "You" : last.sender?.displayName}: ${last.content || "📎 File"}`
              : last.content || "📎 File"}
        </p>
      </div>
    </li>
  );
};

const Sidebar = ({ items, onGroupCreated, mobileHidden }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { userId, groupId } = useParams();
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [dark, setDark] = useDarkMode();

  return (
    <aside className={`sidebar${mobileHidden ? " sidebar--hidden" : ""}`}>
      <div className="sidebar__header">
        <Link to="/profile" className="sidebar__self-avatar" title="Profile">
          {user?.avatar
            ? <img src={user.avatar} alt={user?.displayName} />
            : <span>{user?.displayName?.[0]?.toUpperCase()}</span>}
        </Link>
        <h2 className="sidebar__title">NexTalk</h2>
        <div style={{ display: "flex", gap: "0.375rem" }}>
          <button className="theme-toggle" onClick={() => setDark((d) => !d)} title="Toggle theme">
            {dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
          </button>
          <Link to="/profile" className="theme-toggle" title="Settings">
            <Gear size={16} weight="bold" />
          </Link>
          <button className="sidebar__new-group" onClick={() => setShowGroupManager(true)} title="New group">
            <Plus size={16} weight="bold" />
          </button>
        </div>
      </div>
      <div className="sidebar__search">
        <SearchBar />
      </div>
      <ul className="sidebar__list">
        {items.length === 0 ? (
          <li className="sidebar__empty">
            Search a @handle to start a conversation
          </li>
        ) : items.map((item) => (
          <ConversationItem
            key={item._id}
            item={item}
            currentUserId={user?.id}
            isActive={item._type === "group" ? item._id === groupId : item.participants?.find((p) => p._id !== user?.id)?._id === userId}
          />
        ))}
      </ul>
      {showGroupManager && (
        <GroupManager
          onClose={() => setShowGroupManager(false)}
          onCreated={onGroupCreated}
        />
      )}
    </aside>
  );
};

export default Sidebar;
