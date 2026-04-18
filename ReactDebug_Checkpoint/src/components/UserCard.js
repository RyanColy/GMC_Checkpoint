import React from 'react';

// BUG 2: expects email prop but it's never passed from App
function UserCard({ name, age, email }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, marginBottom: 16 }}>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Email:</strong> {email || 'No email provided'}</p>
    </div>
  );
}

export default UserCard;
