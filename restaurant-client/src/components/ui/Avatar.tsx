import React from 'react';
import './css/Avatar.css';

interface AvatarProps {
  imageUrl?: string;
  fullName?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, fullName = '', size = 100 }) => {
  const initials = fullName.charAt(0).toUpperCase();

  if (imageUrl?.trim()) {
    return (
      <img
        src={imageUrl}
        alt="User Avatar"
        className="avatar-image"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="avatar-placeholder"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
