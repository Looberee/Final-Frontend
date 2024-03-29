import React, { createContext, useContext, useState } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create the UserProvider
export const UserProvider = ({ children }) => {
    const [userState, setUserState] = useState({
        userProfile: null,
        setUserProfile: (newProfile) => setUserState({ ...userState, userProfile: newProfile })
    });

    return (
        <UserContext.Provider value={userState}>
            {children}
        </UserContext.Provider>
    );
    };

// Create the useUser hook
export const useUser = () => useContext(UserContext);
