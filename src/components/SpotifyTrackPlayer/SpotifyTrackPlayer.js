import React, { useEffect } from 'react';

const SpotifyTrackPlayer = () => {
    useEffect(() => {
        const initSpotifyPlayer = () => {
            console.log('Initializing Spotify player...');
            // Check if Spotify object is available
            if (window.Spotify) {
                console.log('Spotify object is available:', window.Spotify);
                // Your Spotify player initialization code here...
                const spotify_access_token = localStorage.getItem('spotify_token');
                console.log('Access token:', spotify_access_token);
                
                if (!spotify_access_token) {
                    spotify_access_token = 'BQB3MhjqShi1_G7V6a-Sq3UnoEORmrzstbvAvjQG-E6PBek8jzIT2tzUgf1x0zQZE5m7q_rqOgaQPr7c760x7Uk39lCN-Ldoy2ounUrH26tsHf4WE0v1zQ-OiGWu7CtIfy7BitjpgzM1bqcNlX4DjcZ3KkGykSH98tLVVbrJoezBzwdbIk1gYAxKroML_abVrrpqG2JgB6GqJQvjT2DkTSeopIOW'
                    console.error('Access token not found in local storage');
                    return;
                }

                const player = new window.Spotify.Player({
                    name: 'Web Playback SDK Quick Start Player',
                    getOAuthToken: cb => { cb(spotify_access_token); },
                    volume : 0.5
                });

                // Error handling
                player.addListener('initialization_error', ({ message }) => { console.error('Initialization error:', message); });
                player.addListener('authentication_error', ({ message }) => { console.error('Authentication error:', message); });
                player.addListener('account_error', ({ message }) => { console.error('Account error:', message); });
                player.addListener('playback_error', ({ message }) => { console.error('Playback error:', message); });


                player.addListener('ready', ({ device_id }) => {
                    console.log('The Web Playback SDK is ready to play music!');
                    console.log('Device ID', device_id);
                });

                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID is not ready for playback', device_id);
                });

                // Playback status updates
                player.addListener('player_state_changed', state => { 
                    console.log('Player state changed:', state); 
                    if (state.paused) {
                        player.resume().then(() => {
                            console.log('Playback resumed successfully');
                        }).catch(error => {
                            console.error('Failed to resume playback:', error);
                        });
                    } else {
                        console.log('Playback is not paused');
                    }
                });

                // Connect to the player
                player.connect().then(success => {
                    console.log('Connect success:', success);
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                        // You can now control the player
                    }
                });
            } else {
                // Spotify object not available yet, try again after a delay
                console.log('Spotify object not available yet. Trying again after a delay...');
                setTimeout(initSpotifyPlayer, 100);
            }
            
        };

        // Initialize Spotify player
        initSpotifyPlayer();
    }, []);

    return <div>Spotify Track Player Loading...</div>;
};

export default SpotifyTrackPlayer;
