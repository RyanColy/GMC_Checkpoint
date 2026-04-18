"use client";

import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { UserFactory } from "../../lib/patterns/UserFactory";
import { UserPlus } from "lucide-react";

export default function UsersPage() {
  const { users, addUser } = useLibrary();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("student");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    addUser(UserFactory.createUser(type, `u-${Date.now()}`, name, email));
    setName("");
    setEmail("");
    setOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">{users.length} members registered</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded-md transition-colors"
        >
          <UserPlus size={13} />
          Add User
        </button>
      </header>

      <main className="p-8 flex flex-col gap-5">
        {open && (
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">New Member</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <button className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-md transition-colors">
                Create
              </button>
            </form>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Email</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{u.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                      u.getRole() === "Teacher"
                        ? "bg-violet-50 text-violet-700 ring-violet-200"
                        : "bg-sky-50 text-sky-700 ring-sky-200"
                    }`}>
                      {u.getRole()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
