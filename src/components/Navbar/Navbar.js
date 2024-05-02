import React, {useEffect, useState} from "react";
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faRightFromBracket, faCircleUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRoom } from "../../contexts/RoomContext";


const Navbar = ({ isLoggedIn, onLogout, setSearchValue }) => {
    const { isAuthenticated, alreadyAuth } = useAuth();
    const { roomState, setRoomState} = useRoom();
    const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
    };

    const handleSidebarResponsive = () => {
        const track_sidebar = document.querySelector('.track-sidebar');
        track_sidebar.classList.toggle('responsive');
        const icon_sidebar = document.querySelector('.icon-sidebar');
        icon_sidebar.classList.toggle('responsive');
    }

    return (
        <div>
            <nav className="navigation">
                <div className="branch-container">
                    <Link to="/" onClick={() => setRoomState(false)}><h1>Pyppo</h1></Link>

                    <FontAwesomeIcon icon={faBars} className="bars-responsive" onClick={handleSidebarResponsive} />
                </div>


                <div className="user-container">
                    <div className="searchbar-container">
                        <input type="text" onChange={handleInputChange} className="searchbar" placeholder="Search for songs, artists, albums..."></input>
                    </div>

                    <div className="notification-profile-container">
                        {/* <a className="notification">
                            <FontAwesomeIcon className="notification-icon" icon={faBell} />
                        </a> */}

                        <a className="profile-login">
                            {alreadyAuth ? (
                                <div></div>
                            ) : (
                                <Link to="/login" className="login-button">Log in</Link>
                            )}

                        </a>
                    </div>
                </div>
            </nav>
        </div>
    )

};

export default Navbar;