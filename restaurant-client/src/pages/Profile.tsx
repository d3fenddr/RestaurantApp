// src/pages/Profile.tsx
import React from 'react';

const Profile: React.FC = () => {
  // Получаем пользователя из localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container">
      <h1>Your Profile</h1>
      <p><strong>Full Name:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {/* Дополнительно можно добавить кнопку для редактирования профиля */}
    </div>
  );
};

export default Profile;
