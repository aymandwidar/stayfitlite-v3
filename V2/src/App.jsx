import { UserProvider, useUser } from './context/UserContext';
import SmartFeed from './pages/SmartFeed';
import Onboarding from './pages/Onboarding';
import AICoach from './pages/AICoach';
import Settings from './pages/Settings';
import { useState } from 'react';

function AppContent() {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState('feed');

  // Show onboarding if user hasn't completed it
  if (!user || !user.onboarded) {
    return <Onboarding />;
  }

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <SmartFeed />;
      case 'coach':
        return <AICoach />;
      case 'settings':
        return <Settings />;
      default:
        return <SmartFeed />;
    }
  };

  return (
    <div className="relative">
      {renderView()}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card-prominent border-t border-white/10 z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${currentView === 'feed' ? 'text-white bg-white/20' : 'text-gray-400 hover:text-white'
              }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('coach')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${currentView === 'coach' ? 'text-white bg-white/20' : 'text-gray-400 hover:text-white'
              }`}
          >
            <span className="text-xl">💬</span>
            <span className="text-xs">Coach</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${currentView === 'settings' ? 'text-white bg-white/20' : 'text-gray-400 hover:text-white'
              }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <div className="App">
        <AppContent />
      </div>
    </UserProvider>
  );
}

export default App;
