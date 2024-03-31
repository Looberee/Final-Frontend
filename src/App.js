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
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import { RecentTrackProvider } from './contexts/RecentTrackContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Genres from './pages/SmallPages/Genres/Genres';
import GenreDetail from './pages/SmallPages/Genres/GenreDetail';
import Tracks from './pages/SmallPages/Tracks/Tracks';
import { TrackProvider } from './contexts/TrackContext';
import { useTrack } from './contexts/TrackContext';
import WaitingList from './pages/SmallPages/WaitingList/WaitingList';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);

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

  return (
    <DarkThemeProvider>
      <UserProvider>
        <AuthProvider>
          <TrackProvider>
            <Router>
              <AppContent isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} onTokenRefresh={handleTokenRefresh}/>
            </Router>
          </TrackProvider>
        </AuthProvider>
      </UserProvider>
    </DarkThemeProvider>
  );
};

const AppContent = ({ isLoggedIn, onLogin, onLogout, onTokenRefresh}) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const { pyppoTrack } = useTrack();

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
                {searchValue ? <Searched searchValue={searchValue}/> :
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/personal/playlists/:encode_id/tracks" element={<UserPlaylist />} />
                  <Route path="/personal/profile" element={<UserProfile/>}/>
                  <Route path='/waiting/tracks' element={<WaitingList />} />
                  <Route path="/genres" element={<Genres/>}/>
                  <Route path='/genres/:genre_name' element={<GenreDetail />} />
                  <Route path='/artists' element={<Artists/>}/>
                  <Route path='/tracks' element={<Tracks/>}/>
                </Routes>}

                <TrackPlayer/>

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
