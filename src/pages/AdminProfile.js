import React from 'react';

const AdminProfile = ({ userData }) => {
  return (
    <div>
      <h2>Admin Profile</h2>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Role:{userData.role}</p>
      {/* Display other user-specific content */}
    </div>
  );
};

export default AdminProfile;
