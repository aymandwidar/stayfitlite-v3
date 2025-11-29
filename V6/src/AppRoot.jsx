import { UserProvider, useUser } from './context/UserContext';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import AICoach from './pages/AICoach';
import Settings from './pages/Settings';
import WorkoutTemplates from './pages/WorkoutTemplates';
import WorkoutHistory from './pages/WorkoutHistory';
import { useState, useEffect } from 'react';
import React from 'react';

function AppContent() {
  const { user } = useUser();

  // Detect initial view from URL hash
  const getInitialView = () => {
    const hash = window.location.hash;
    if (hash.includes('coach')) return 'coach';
    if (hash.includes('templates')) return 'templates';
    if (hash.includes('history')) return 'history';
    if (hash.includes('settings')) return 'settings';
    return 'home';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  // Update URL hash when view changes
  useEffect(() => {
    window.location.hash = currentView === 'home' ? '' : currentView;
  }, [currentView]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('coach')) setCurrentView('coach');
      else if (hash.includes('settings')) setCurrentView('settings');
      else setCurrentView('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show onboarding if user hasn't completed it
  if (!user || !user.onboarded) {
    return <Onboarding />;
  }

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard />;
      case 'coach':
        return <AICoach />;
      case 'templates':
        return <WorkoutTemplates />;
      case 'history':
        return <WorkoutHistory />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Content */}
      <div className="pb-24">
        {renderView()}
      </div>

      {/* Bottom Navigation - NUCLEAR FIX */}
      <div
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          width: '100%',
          height: '80px',
          backgroundColor: '#0f172a',
          borderTop: '2px solid #06b6d4',
          zIndex: 2147483647, // Max z-index
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <div className="w-full max-w-md px-1 grid grid-cols-5 gap-1">
          <button
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: currentView === 'home' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: currentView === 'home' ? '#22d3ee' : '#9ca3af',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            className="flex flex-col items-center justify-center py-2 rounded-xl"
          >
            <span className="text-xl mb-1">🏠</span>
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('coach')}
            style={{
              backgroundColor: currentView === 'coach' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: currentView === 'coach' ? '#22d3ee' : '#9ca3af',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            className="flex flex-col items-center justify-center py-2 rounded-xl"
          >
            <span className="text-xl mb-1">💬</span>
            <span className="text-[10px] font-bold">Coach</span>
          </button>

          <button
            onClick={() => setCurrentView('templates')}
            style={{
              backgroundColor: currentView === 'templates' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: currentView === 'templates' ? '#22d3ee' : '#9ca3af',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            className="flex flex-col items-center justify-center py-2 rounded-xl"
          >
            <span className="text-xl mb-1">💾</span>
            <span className="text-[10px] font-bold">Templates</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            style={{
              backgroundColor: currentView === 'history' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: currentView === 'history' ? '#22d3ee' : '#9ca3af',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            className="flex flex-col items-center justify-center py-2 rounded-xl"
          >
            <span className="text-xl mb-1">📊</span>
            <span className="text-[10px] font-bold">History</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            style={{
              backgroundColor: currentView === 'settings' ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              color: currentView === 'settings' ? '#22d3ee' : '#9ca3af',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            className="flex flex-col items-center justify-center py-2 rounded-xl"
          >
            <span className="text-xl mb-1">⚙️</span>
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Error caught by boundary
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: 'black', height: '100vh', overflow: 'auto' }}>
          <h2 style={{ color: '#ff5555' }}>Application Error</h2>
          <p>Please take a screenshot and send it to support.</p>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#444', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Clear Data & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
      <UserProvider>
        <div className="App">
          <AppContent />
        </div>
      </UserProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
