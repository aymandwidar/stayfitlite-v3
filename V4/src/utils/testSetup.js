/**
 * Test User Setup Helper
 * Run this in browser console to setup a test user
 */

export const setupTestUser = () => {
    const testUser = {
        id: 'test_user_1',
        name: 'Alex',
        age: 28,
        weight: 75,
        height: 180,
        goal: 'muscle_gain',
        level: 'intermediate',
        activityLevel: 'active',
        medicalConditions: 'None',
        recoveryScore: 85,
        hydrationToday: 3,
        sleepLogs: [],
        motivationLogs: [],
        stressLogs: [],
        workouts: [],
        meals: {},
        onboarded: true,
        joinedAt: new Date().toISOString()
    };

    localStorage.setItem('stayfitlite_v2_user', JSON.stringify(testUser));

    console.log('✅ Test user created:', testUser.name);
    console.log('Refresh the page to see the Smart Feed!');

    return testUser;
};

// Make available globally for easy testing
if (typeof window !== 'undefined') {
    window.setupTestUser = setupTestUser;
}
