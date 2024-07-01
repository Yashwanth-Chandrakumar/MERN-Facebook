import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const userName = localStorage.getItem('fb_user_name');
  const userPicture = localStorage.getItem('fb_user_picture');
  const [pages, setPages] = useState([]);
  const accessToken = localStorage.getItem('fb_access_token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch(`https://graph.facebook.com/me/accounts/?access_token=${accessToken}`);
        const data = await response.json();
        setPages(data.data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchPages();
  }, [accessToken]);

  const handleCardClick = (pageId, pageAccessToken) => {
    navigate(`/page/${pageId}?pageAccessToken=${encodeURIComponent(pageAccessToken)}`);
  };

  return (
    <div>
      <h1>Home</h1>
      {userName && <p>Welcome, {userName}!</p>}
      {userPicture && <img src={userPicture} alt={`${userName}'s profile`} />}
      <div className="page-list">
        {pages.map((page) => (
          <div key={page.id} className="page-card" onClick={() => handleCardClick(page.id, page.access_token)}>
            <h2>{page.name}</h2>
            <p>Category: {page.category}</p>
            <p>Tasks: {page.tasks.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
