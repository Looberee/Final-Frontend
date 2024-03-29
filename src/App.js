import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CustomSidebar from './components/CustomSidebar/CustomSidebar';
import { DarkThemeProvider } from './contexts/DarkThemeContext';
import Home from './pages/SmallPages/Home/Home';
import Playlists from './components/PersonalPlaylists/PersonalPlaylists';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Banner from './components/Banner/Banner';
import Navbar from './components/Navbar/Navbar';
import Albums from './components/Recommendation/Albums/Albums';
import './App.css';
import TrackPlayer from './components/TrackPlayer/TrackPlayer';
import UserProfile from './pages/SmallPages/UserProfile/UserProfile';
import Artists from './pages/SmallPages/Artists/Artists';
import UserPlaylist from './pages/SmallPages/UserPlaylist/UserPlaylist';
import Searched from './pages/SmallPages/Searched/Searched';
import { refreshTokens } from './Auth';
import jwt_decode from "jwt-decode";
import SpotifyPlayer from './components/SpotifyTrackPlayer/SpotifyTrackPlayer';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import { RecentTrackProvider } from './contexts/RecentTrackContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Genres from './pages/SmallPages/Genres/Genres';
import GenreDetail from './pages/SmallPages/Genres/GenreDetail';
import Tracks from './pages/SmallPages/Tracks/Tracks';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleTokenRefresh = async () => {
    try {
      const accessToken = await refreshTokens(); // Refresh tokens
      localStorage.setItem('token', accessToken); // Store new access token
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      handleLogout(); // Log out user if token refresh fails
    }
  };

  const handleSpotifyTokenRefresh = async () => {
    try {
      const spotifyAccessToken = await refreshTokens(); // Refresh tokens
      localStorage.setItem('spotify_token', spotifyAccessToken); // Store new access token
    } catch (error) {
      console.error('Failed to refresh spotify tokens:', error);
      handleLogout(); // Log out user if token refresh fails
    }
  };

  return (
    <DarkThemeProvider>
      <UserProvider>
        <AuthProvider>
          <Router>
            <AppContent isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} onTokenRefresh={handleTokenRefresh} onSpotifyTokenRefresh={handleSpotifyTokenRefresh}/>
          </Router>
        </AuthProvider>
      </UserProvider>
    </DarkThemeProvider>
  );
};

const AppContent = ({ isLoggedIn, onLogin, onLogout, onTokenRefresh, onSpotifyTokenRefresh}) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [selectedTrack, setSelectedTrack] = useState();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleTrackSelected = (track) => {
    setSelectedTrack(track);
  };

  useEffect(() => {
    // Check if access token is expired and refresh if needed
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token); // Decode the JWT token
      const tokenExpTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = new Date().getTime();
      if (tokenExpTime < currentTime) {
        // Token expired, refresh it
        onTokenRefresh();
      }
    }
  }, [onTokenRefresh]);

  // useEffect(() => {
  //   const spotifyToken = localStorage.getItem('spotify_token');
  //   if (spotifyToken) {
  //     const decodedToken = jwt_decode(spotifyToken); // Decode the Spotify access token
  //     const tokenExpTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
  //     const currentTime = new Date().getTime();
  //     if (tokenExpTime < currentTime) {
  //       // Token expired, refresh it
  //       onSpotifyTokenRefresh();
  //     }
  //   }
  // }, [onSpotifyTokenRefresh]);
  

  return (
    <div>
      {!isAuthPage && (
        <div className='App'>
          <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} setSearchValue={setSearchValue} />
          <RecentTrackProvider>
            <PlaylistProvider>
            <div className='sidenav-content'>
              <CustomSidebar isLoggedIn={isLoggedIn} onLogout={onLogout} />
              <div className='content'>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/personal/playlists/:encode_id/tracks" element={<UserPlaylist onTrackSelected={handleTrackSelected} />} />
                  <Route path="/personal/profile" element={<UserProfile/>}/>
                  <Route path="/genres" element={<Genres/>}/>
                  <Route path='/genres/:genre_name' element={<GenreDetail />} />
                  <Route path='/artists' element={<Artists/>}/>
                  <Route path='/tracks' element={<Tracks/>}/>
                </Routes>
                {searchValue ? <Searched searchValue={searchValue} onTrackSelected={handleTrackSelected} /> : <div></div>}
                {selectedTrack ? <TrackPlayer trackSelected={selectedTrack} /> : <div></div>}
              </div>
            </div>
            </PlaylistProvider>
          </RecentTrackProvider>
        </div>
      )}

      <Routes>
        <Route path='/login' element={<Login onLogin={onLogin} />} />
        <Route path='/register' element={<Register onRegister={onLogin} />} />
      </Routes>
    </div>
  );
};

export default App;
