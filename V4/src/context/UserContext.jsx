import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    // User profile and data
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('stayfitlite_v2_user');
        return saved ? JSON.parse(saved) : null;
    });

    // AI state
    const [currentCard, setCurrentCard] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [lastAIUpdate, setLastAIUpdate] = useState(null);

    // AI memory
    const [aiMemory, setAiMemory] = useState(() => {
        const saved = localStorage.getItem('stayfitlite_v2_memory');
        return saved ? JSON.parse(saved) : {
            user_preferences: {
                disliked_exercises: [],
                loved_exercises: [],
                equipment_preferences: [],
                preferred_training_times: {}
            },
            injury_watch: [],
            psychological_patterns: [],
            workout_memory: [],
            progression_status: {}
        };
    });

    // Persist user data
    useEffect(() => {
        if (user) {
            localStorage.setItem('stayfitlite_v2_user', JSON.stringify(user));
        }
    }, [user]);

    // Persist AI memory
    useEffect(() => {
        localStorage.setItem('stayfitlite_v2_memory', JSON.stringify(aiMemory));
    }, [aiMemory]);

    // Update user data
    const updateUser = (data) => {
        setUser((prev) => ({ ...prev, ...data }));
    };

    // Process AI decision (update UI based on AI output)
    const processAIDecision = (decision) => {
        setCurrentCard(decision);
        setLastAIUpdate(new Date().toISOString());
    };

    // Log sleep quality
    const logSleep = (quality) => {
        const today = new Date().toISOString().split('T')[0];
        const sleepLogs = user.sleepLogs || [];
        sleepLogs.push({ quality, date: today, timestamp: new Date().toISOString() });

        updateUser({
            sleepLogs,
            lastSleepLog: today
        });

        // Trigger AI recalculation
        return true; // Signal to refresh
    };

    // Log motivation/energy
    const logMotivation = (level) => {
        const today = new Date().toISOString().split('T')[0];
        const motivationLogs = user.motivationLogs || [];
        motivationLogs.push({ level, date: today, timestamp: new Date().toISOString() });

        updateUser({
            motivationLogs,
            todayMotivation: level,
            lastMotivationLog: today
        });

        return true;
    };

    // Log stress level
    const logStress = (level) => {
        const today = new Date().toISOString().split('T')[0];
        const stressLogs = user.stressLogs || [];
        stressLogs.push({ level, date: today, timestamp: new Date().toISOString() });

        updateUser({
            stressLogs,
            todayStress: level,
            lastStressLog: today
        });

        return true;
    };

    // Add hydration
    const addHydration = (count = 1) => {
        const current = user.hydrationToday || 0;
        updateUser({ hydrationToday: current + count });
        return true;
    };

    // Log meal
    const logMeal = (mealType, eaten) => {
        const today = new Date().toISOString().split('T')[0];
        const meals = user.meals || {};
        meals[mealType] = { eaten, date: today };

        updateUser({ meals });
        return true;
    };

    // Complete day and reset daily stats
    const completeDay = (stats) => {
        const today = new Date().toISOString().split('T')[0];
        const history = user.history || [];

        history.push({
            date: today,
            stats: {
                ...stats,
                hydration: user.hydrationToday || 0,
                recoveryScore: user.recoveryScore || 0
            },
            timestamp: new Date().toISOString()
        });

        // Reset daily trackers
        updateUser({
            history,
            hydrationToday: 0,
            meals: {},
            todayMotivation: null,
            todayStress: null,
            lastCompletedDay: today
        });

        return true;
    };

    // Update AI memory
    const updateMemory = (memoryData) => {
        setAiMemory((prev) => ({
            ...prev,
            ...memoryData
        }));
    };

    // Get memory context for AI
    const getMemoryContext = () => {
        return aiMemory;
    };

    // Clear all data (reset)
    const clearUser = () => {
        localStorage.removeItem('stayfitlite_v2_user');
        localStorage.removeItem('stayfitlite_v2_memory');
        setUser(null);
        setAiMemory({
            user_preferences: {
                disliked_exercises: [],
                loved_exercises: [],
                equipment_preferences: [],
                preferred_training_times: {}
            },
            injury_watch: [],
            psychological_patterns: [],
            workout_memory: [],
            progression_status: {}
        });
    };

    const value = {
        user,
        updateUser,
        processAIDecision,
        currentCard,
        aiSuggestion,
        lastAIUpdate,
        aiMemory,
        updateMemory,
        getMemoryContext,
        // Logging functions
        logSleep,
        logMotivation,
        logStress,
        addHydration,
        logMeal,
        completeDay,
        clearUser
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
