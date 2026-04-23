import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

function UserList() {
  const [listOfUsers, setListOfUsers] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setListOfUsers(response.data));
  }, []);

  return (
    <div className="user-list">
      <h1>Utilisateurs</h1>
      <p className="subtitle">{listOfUsers.length} utilisateurs trouvés</p>
      <div className="user-grid">
        {listOfUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <div className="user-avatar">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2>{user.name}</h2>
                <div className="username">@{user.username}</div>
              </div>
            </div>
            <div className="user-card-info">
              <div className="info-row">
                <span className="info-icon">✉️</span>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">📍</span>
                <span>{user.address.city}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">🏢</span>
                <span>{user.company.name}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">🌐</span>
                <span>{user.website}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
