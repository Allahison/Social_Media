// src/pages/Gaming/GamingPage.jsx
import React, { useState, useEffect } from 'react';
import './GamingPage.css';
import Navbar from '../../components/Navbar/Navbar';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaStar, FaClock, FaPlus } from 'react-icons/fa';

export default function GamingPage() {
  const allGames = [
    {
      title: 'Call of Duty',
      img: './assets/photos/call of.jpg',
      link: 'https://www.callofduty.com/',
      genre: 'FPS',
      description: 'A high-octane military shooter with immersive gameplay and cinematic storytelling.'
    },
    {
      title: 'FIFA 23',
      img: './assets/photos/fifa2.webp',
      link: 'https://www.ea.com/games/fifa/fifa-23',
      genre: 'Sports',
      description: 'The world’s most popular football simulation game with real teams and players.'
    },
    {
      title: 'PUBG Mobile',
      img: './assets/photos/chanel.jpg',
      link: 'https://www.pubgmobile.com/',
      genre: 'Battle Royale',
      description: 'Battle for survival in an intense multiplayer experience with realistic graphics.'
    },
    {
      title: 'GTA V',
      img: './assets/photos/call of.jpg',
      link: 'https://www.rockstargames.com/V/',
      genre: 'Action-Adventure',
      description: 'An open-world crime epic that blends storytelling, heists, and chaos.'
    },
    {
      title: 'Free Fire',
      img: './assets/photos/chanel.jpg',
      link: 'https://ff.garena.com/',
      genre: 'Survival',
      description: 'A fast-paced survival shooter with unique characters and abilities.'
    },
    {
      title: 'Minecraft',
      img: './assets/photos/be1.jpeg',
      link: 'https://www.minecraft.net/',
      genre: 'Sandbox',
      description: 'Create, explore, and survive in a blocky, procedurally-generated 3D world.'
    },
    {
      title: 'Fortnite',
      img: './assets/photos/t2.jpg',
      link: 'https://www.epicgames.com/fortnite/',
      genre: 'Battle Royale',
      description: 'A vibrant, fast-building shooter with live events and crossovers.'
    },
    {
      title: 'Valorant',
      img: './assets/photos/t1.jpg',
      link: 'https://playvalorant.com/',
      genre: 'Tactical Shooter',
      description: 'Strategic 5v5 shooter with unique agents and precise gunplay.'
    },
    {
      title: 'Among Us',
      img: './assets/photos/call of.jpg',
      link: 'https://innersloth.com/games/among-us/',
      genre: 'Social Deduction',
      description: 'Uncover the imposter among your crewmates in this fun party game.'
    },
    {
      title: 'Clash Royale',
      img: './assets/photos/chanel.jpg',
      link: 'https://supercell.com/en/games/clashroyale/',
      genre: 'Strategy',
      description: 'Real-time PvP tower defense game featuring your favorite Clash characters.'
    },
    {
      title: 'League of Legends',
      img: './assets/photos/fifa.jpg',
      link: 'https://www.leagueoflegends.com/',
      genre: 'MOBA',
      description: 'A 5v5 competitive strategy game where two teams battle to destroy the other’s base.'
    },
    {
      title: 'Asphalt 9',
      img: './assets/photos/be1.jpeg',
      link: 'https://www.gameloft.com/en/game/asphalt-9',
      genre: 'Racing',
      description: 'Race in the most fearless street cars from top brands around the world.'
    }
  ];

  const trendingGames = allGames.slice(0, 4);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGames, setFilteredGames] = useState(allGames);
  const [recentGames, setRecentGames] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState(() => {
    const saved = localStorage.getItem('favoriteGames');
    return saved ? JSON.parse(saved) : [];
  });
  const [customGames, setCustomGames] = useState(() => {
    const saved = localStorage.getItem('customGames');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'home');
  const [showPopup, setShowPopup] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameLink, setNewGameLink] = useState('');

  useEffect(() => {
    const filtered = allGames.filter((game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('customGames', JSON.stringify(customGames));
  }, [customGames]);

  useEffect(() => {
    localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));
  }, [favoriteGames]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleGameClick = (game) => {
    if (!recentGames.find((g) => g.title === game.title)) {
      setRecentGames((prev) => [game, ...prev].slice(0, 3));
    }
  };

  const toggleFavorite = (game) => {
    setFavoriteGames((prev) => {
      if (prev.find((g) => g.title === game.title)) {
        return prev.filter((g) => g.title !== game.title);
      } else {
        return [...prev, game];
      }
    });
  };

  const addCustomGame = () => {
    if (newGameTitle.trim() !== '' && newGameLink.trim() !== '') {
      const newGame = {
        title: newGameTitle,
        img: '',
        link: newGameLink,
        genre: 'Custom',
        description: ''
      };
      setCustomGames((prev) => [newGame, ...prev]);
      setNewGameTitle('');
      setNewGameLink('');
      setShowPopup(false);
    }
  };

  const deleteCustomGame = (title) => {
    setCustomGames((prev) => prev.filter((g) => g.title !== title));
  };

  const renderGames = (gamesList, allowDelete = false) => (
    <div className="game-grid">
      {gamesList.length > 0 ? (
        gamesList.map((game, i) => (
          <div className="game-card" key={i}>
            <a
              href={game.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleGameClick(game)}
            >
              {game.img ? <img src={game.img} alt={game.title} /> : <div className="custom-thumbnail">{game.title}</div>}
              <div className="game-details">
                <h4>{game.title}</h4>
                {game.genre && <p className="game-genre">{game.genre}</p>}
                {game.description && <p className="game-description">{game.description}</p>}
              </div>
            </a>

            <div className="card-actions">
              <FaStar
                className={`favorite-icon ${favoriteGames.find((g) => g.title === game.title) ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(game)}
                title="Add to Your Games"
              />
            </div>

            {allowDelete && (
              <button
                className="remove-button"
                onClick={() => deleteCustomGame(game.title)}
              >
                Remove
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No games found.</p>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Gaming</title>
      </Helmet>
      <Navbar />

      <div className="gaming-page">
        <aside className="gaming-sidebar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h3>Gaming Menu</h3>
          <ul>
            <li onClick={() => setActiveTab('home')}>🏠 Home</li>
            <li onClick={() => setActiveTab('live')}>🎮 Live Streams</li>
            <li onClick={() => setActiveTab('favorites')}>🕹️ Your Games</li>
            <li onClick={() => setActiveTab('trending')}>🔥 Trending</li>
            <li onClick={() => setActiveTab('custom')}>➕ My Added Games</li>
          </ul>

          <div className="recently-played">
            <h4>Recently Played</h4>
            {recentGames.length > 0 ? (
              recentGames.map((game, i) => (
                <a
                  href={game.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recent-game"
                  key={i}
                  onClick={() => handleGameClick(game)}
                >
                  {game.img ? <img src={game.img} alt={game.title} /> : <div className="recent-thumbnail">{game.title}</div>}
                  <span>{game.title}</span>
                </a>
              ))
            ) : (
              <p style={{ fontSize: '14px', color: '#888' }}>No recently played games.</p>
            )}
          </div>
        </aside>

        <main className="gaming-content">
          <h2>
            {activeTab === 'home' && 'Popular Games'}
            {activeTab === 'favorites' && 'Your Favorite Games'}
            {activeTab === 'live' && 'Live Streams'}
            {activeTab === 'trending' && 'Trending Games'}
            {activeTab === 'custom' && (
              <>
                My Added Games
                <FaPlus
                  className="add-icon"
                  onClick={() => setShowPopup(true)}
                  style={{ cursor: 'pointer', float: 'right' }}
                />
              </>
            )}
          </h2>

          {activeTab === 'home' && renderGames(filteredGames)}
          {activeTab === 'favorites' && renderGames(favoriteGames)}
          {activeTab === 'trending' && renderGames(trendingGames)}
          {activeTab === 'custom' && renderGames(customGames, true)}
          {activeTab === 'live' && (
            <div className="coming-soon">
              <FaClock className="soon-icon" />
              <p>Live streaming feature coming soon...</p>
            </div>
          )}
        </main>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h3>Add Your Game</h3>
              <input
                type="text"
                placeholder="Game Name"
                value={newGameTitle}
                onChange={(e) => setNewGameTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Game Link"
                value={newGameLink}
                onChange={(e) => setNewGameLink(e.target.value)}
              />
              <div className="popup-buttons">
                <button onClick={addCustomGame}>Add</button>
                <button onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
