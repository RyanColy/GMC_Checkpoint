import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import Sidebar from "../components/conversation/Sidebar";

const mergeAndSort = (conversations, groups) => {
  const tagged = [
    ...conversations.map((c) => ({ ...c, _type: "conversation" })),
    ...groups.map((g) => ({ ...g, _type: "group" })),
  ];
  return tagged.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

const MainPage = () => {
  const socket = useSocket();
  const { pathname } = useLocation();
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  // On mobile, hide sidebar when a chat is open
  const mobileSidebarHidden = pathname !== "/";

  const fetchAll = () => {
    Promise.all([api.get("/conversations"), api.get("/groups")])
      .then(([{ data: convs }, { data: grps }]) => {
        setConversations(convs);
        setGroups(grps);
      })
      .catch(console.error);
  };

  useEffect(() => { fetchAll(); }, []);

  // Refresh sidebar on any new message
  useEffect(() => {
    if (!socket) return;
    socket.on("message:receive", fetchAll);
    return () => socket.off("message:receive", fetchAll);
  }, [socket]);

  const handleGroupCreated = (group) => {
    setGroups((prev) => [{ ...group, _type: "group" }, ...prev]);
  };

  return (
    <div className="main-layout">
      <Sidebar
        items={mergeAndSort(conversations, groups)}
        onGroupCreated={handleGroupCreated}
        mobileHidden={mobileSidebarHidden}
      />
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainPage;
