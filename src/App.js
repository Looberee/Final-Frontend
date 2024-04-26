import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import Room from './pages/SmallPages/Room/Room';
import { RoomProvider } from './contexts/RoomContext';
import Cookies from 'js-cookie';
import { useModal } from './contexts/ModalContext';
import ArtistDetail from './pages/SmallPages/ArtistDetail/ArtistDetail';

import io, { Socket } from 'socket.io-client';
import { ModalProvider } from './contexts/ModalContext';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import SpecificRoom from './pages/SmallPages/Room/SpecificRoom';
import axios from 'axios';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const token = Cookies.get('access_token_cookie');

  useEffect(() => {
    if (token) {
      console.log('Access token: ' + token);
    }
    else{
      console.log('No access token');
    }
  },[])

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

  return (
    <DarkThemeProvider>
      <ModalProvider>
        <UserProvider>
          <AuthProvider>
            <TrackProvider>
              <RoomProvider>
                <Router>
                  <AppContent isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout}/>
                </Router>
              </RoomProvider>
            </TrackProvider>
          </AuthProvider>
        </UserProvider>
      </ModalProvider>
    </DarkThemeProvider>
  );
};

const AppContent = ({ isLoggedIn, onLogin, onLogout}) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const isBigPage = location.pathname === '/login' || location.pathname === '/register' || /\/room\/\d+/.test(location.pathname);
  const { pyppoTrack } = useTrack();
  const { openModalId } = useModal();
  const [routeClicked, setRouteClicked] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const checkScope = async () => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/melody/v1/check_scope?scope=web-playback', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
                }
            });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const response = await axios.post('http://127.0.0.1:8080/spotify/refresh');
                    if (localStorage.getItem('spotify_token') !== response.data.spotify_access_token) {
                      console.log(response.data.message);
                      console.log(response.data.spotify_access_token)
                      localStorage.setItem('spotify_token', response.data.spotify_access_token);
                    }

                }
                catch (err) {
                    console.error('Error refreshing spotify token:', err);
                }
            }
        }
    };

    checkScope();
}, [pyppoTrack]);

  useEffect(() => {
    console.log(openModalId);
  },[openModalId])

  // const handleInputChange = (event) => {
  //   const value = event.target.value;
  //   setSearchValue(value);

  //   // Navigate to the search page whenever the input value changes
  //   history.push({
  //       pathname: '/search',
  //       search: `?query=${encodeURIComponent(value)}`,
  //   });
  // }

  useEffect(() => {
    if (searchValue) {
        setIsSearching(true);
    }
  }, [searchValue]);

  useEffect(() => {
    if (isSearching) {
        navigate({
            pathname: '/search',
            search: `?query=${encodeURIComponent(searchValue)}`,
        });
        setIsSearching(false);
    }
  }, [isSearching, searchValue, navigate]);

  return (
    <div>
      {!isBigPage && (
            <div className='App'>
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} setSearchValue={setSearchValue} />
      <RecentTrackProvider>
        <PlaylistProvider>
          <div className='sidenav-content'>
            <CustomSidebar isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <div className='content'>
              <Routes>
                <Route path='/search' element={<Searched searchValue={searchValue} />} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/personal/playlists/:encode_id/tracks" element={<UserPlaylist />} />
                <Route path="/personal/profile" element={<UserProfile/>}/>
                <Route path='/waiting/tracks' element={<WaitingList />} />
                <Route path="/genres" element={<Genres/>}/>
                <Route path='/genres/:genre_name' element={<GenreDetail />} />
                <Route path='/artists' element={<Artists/>}/>
                <Route path='/tracks' element={<Tracks/>}/>
                <Route path='/room' element={<Room/>}/>
                <Route path='/artist/:artist_id' element={<ArtistDetail/>}/>
              </Routes>
              <TrackPlayer />
            </div>
          </div>
        </PlaylistProvider>
      </RecentTrackProvider>
    </div>
      )}

      <Routes>
        <Route path='/login' element={<Login onLogin={onLogin} />} />
        <Route path='/register' element={<Register onRegister={onLogin} />} />
        <Route path='/room/:id' element={<SpecificRoom />} />
      </Routes>
    </div>
  );
};

export default App;
