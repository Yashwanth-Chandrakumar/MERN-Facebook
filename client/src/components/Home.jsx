import React from 'react';

export default function Home() {
  const userName = localStorage.getItem('fb_user_name');
  const userPicture = localStorage.getItem('fb_user_picture');

  return (
    <div>
      <h1>Home</h1>
      {userName && <p>Welcome, {userName}!</p>}
      {userPicture && <img src={userPicture} alt={`${userName}'s profile`} />}
      <p>Access Token: {localStorage.getItem('fb_access_token')}</p>
    </div>
  );
}
