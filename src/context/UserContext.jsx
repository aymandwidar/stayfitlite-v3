import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('stayfit_user', null);

    const updateUser = (data) => {
        setUser((prev) => ({ ...prev, ...data }));
    };

    const addXp = (amount) => {
        setUser((prev) => {
            const currentXp = (prev.xp || 0) + amount;
            const currentLevel = prev.level || 1;

            // Simple leveling logic: Level * 100 XP required for next level
            const xpToNextLevel = currentLevel * 100;

            if (currentXp >= xpToNextLevel) {
                return {
                    ...prev,
                    xp: currentXp - xpToNextLevel,
                    level: currentLevel + 1
                };
            }

            return {
                ...prev,
                xp: currentXp
            };
        });
    };

    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, updateUser, addXp, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
