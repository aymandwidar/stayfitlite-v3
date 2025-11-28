import { UserProvider, useUser } from './context/UserContext';
import SmartFeed from './pages/SmartFeed';
import Onboarding from './pages/Onboarding';
import AICoach from './pages/AICoach';
import Settings from './pages/Settings';
import { useState, useEffect } from 'react';

function AppContent() {
  const { user } = useUser();

  // Detect initial view from URL hash
  const getInitialView = () => {
    const hash = window.location.hash;
    if (hash.includes('coach')) return 'coach';
    if (hash.includes('settings')) return 'settings';
    return 'feed';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  // Update URL hash when view changes
  useEffect(() => {
    window.location.hash = currentView === 'feed' ? '' : currentView;
  }, [currentView]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('coach')) setCurrentView('coach');
      else if (hash.includes('settings')) setCurrentView('settings');
      else setCurrentView('feed');
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
      {/* Top Navigation - iOS Style with Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-[9999]" style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        paddingTop: 'env(safe-area-inset-top)'
      }}>
        <div className="flex justify-around items-center h-14 max-w-md mx-auto px-4">
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${currentView === 'feed'
              ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('coach')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${currentView === 'coach'
              ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-medium">Coach</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${currentView === 'settings'
              ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Content with top padding to account for fixed nav */}
      <div className="pt-14">
        {renderView()}
      </div>
    </div>
  );
}

class ErrorBoundary extends useState {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl text-red-500 mb-4">Something went wrong</h1>
          <pre className="bg-gray-900 p-4 rounded overflow-auto max-w-full text-xs">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-blue-600 rounded-lg"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Fix: ErrorBoundary must be a class component, so we can't extend useState directly. 
// Let's use a proper React class component.
import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
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

function DebugOverlay() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 99999, padding: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%' }}
      >
        🐞
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', top: '60px', left: '10px', right: '10px', bottom: '80px', zIndex: 99999, background: 'rgba(0,0,0,0.9)', color: '#0f0', padding: '10px', overflow: 'auto', borderRadius: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong>DEBUG MODE</strong>
        <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}>CLOSE</button>
      </div>

      <button
        onClick={() => {
          if (confirm('Reset all data?')) {
            localStorage.clear();
            window.location.reload();
          }
        }}
        style={{ width: '100%', padding: '10px', background: '#d00', color: 'white', border: 'none', marginBottom: '10px', borderRadius: '5px' }}
      >
        HARD RESET APP
      </button>

      <div>
        <strong>Current URL Hash:</strong> {window.location.hash}<br />
        <strong>User Loaded:</strong> {user ? 'YES' : 'NO'}<br />
        <strong>Onboarded:</strong> {user?.onboarded ? 'YES' : 'NO'}<br />
      </div>

      <pre style={{ marginTop: '10px', borderTop: '1px solid #333', paddingTop: '10px' }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
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
