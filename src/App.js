import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CustomSidebar from './components/CustomSidebar/CustomSidebar';
import { DarkThemeProvider } from './contexts/DarkThemeContext';
import Home from './pages/SmallPages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
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
import EmailConfirm from './pages/EmailConfirm/EmailConfirm';
import ResetPassword from './pages/ResetPassword/ResetPassword';

import io, { Socket } from 'socket.io-client';
import { ModalProvider } from './contexts/ModalContext';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import SpecificRoom from './pages/SmallPages/Room/SpecificRoom';
import axios from 'axios';

import { toast, Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound/NotFound';
import { NotFoundPage } from './pages/NotFound/NotFound';


const App = () => {

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);


  return (
    <DarkThemeProvider>
      <ModalProvider>
        <UserProvider>
          <AuthProvider>
            <TrackProvider>
              <RoomProvider>
                <Router>
                  <AppContent />
                  <Toaster containerStyle={{ zIndex: 9999 }} />
                </Router>
              </RoomProvider>
            </TrackProvider>
          </AuthProvider>
        </UserProvider>
      </ModalProvider>
    </DarkThemeProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const isBigPage = location.pathname === '/login' || location.pathname === '/register' || /\/room\/\d+/.test(location.pathname) || location.pathname === '/email-confirm' || /\/reset-password\/.*/.test(location.pathname);
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

            // Get the current time in Unix timestamp format
            const currentTime = Math.floor(Date.now() / 1000);
            localStorage.setItem('current_time', currentTime)

            // Get the Spotify token expiry time
            const spotifyExpireAt = localStorage.getItem('spotify_expires_at');

            const timeRemaining = (spotifyExpireAt - currentTime) / 60;

            localStorage.setItem('Time remaining', timeRemaining.toFixed(2));

            // If the Spotify token will expire in 5 minutes or less, refresh it
            if (spotifyExpireAt - currentTime <= 300) {
                const refreshResponse = await axios.post('http://127.0.0.1:8080/spotify/refresh', {withCredentials: true})
                localStorage.setItem('spotify_token', refreshResponse.data.spotify_token)
                localStorage.setItem('spotify_expires_at', refreshResponse.data.spotify_expires_at)
            }

            // Handle response...
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Refresh the token if the request fails with a 401 status
                const refreshResponse = await axios.post('http://127.0.0.1:8080/spotify/refresh', {withCredentials: true})
                localStorage.setItem('spotify_token', refreshResponse.data.spotify_token)
                localStorage.setItem('spotify_expires_at', refreshResponse.data.spotify_expires_at)
            }
        }
    };

    checkScope();

    // Then run checkScope every 2 minutes
    const intervalId = setInterval(checkScope, 2 * 60 * 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
}, []);


  useEffect(() => {
    console.log(openModalId);
  },[openModalId])


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
      <Navbar  setSearchValue={setSearchValue} />
      <RecentTrackProvider>
        <PlaylistProvider>
          <div className='sidenav-content'>
            <CustomSidebar/>
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
                <Route path='*' element={<NotFound />} />
              </Routes>
              <TrackPlayer />
            </div>
          </div>
        </PlaylistProvider>
      </RecentTrackProvider>
    </div>
      )}

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/room/:encode_id' element={<SpecificRoom />} />
        <Route path='/email-confirm' element={<EmailConfirm />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
