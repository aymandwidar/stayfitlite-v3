import React, { useState } from 'react';
import { useUser } from './context/UserContext';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import WorkoutPlayer from './pages/WorkoutPlayer';
import AICoach from './pages/AICoach';
import History from './pages/History';
import Settings from './pages/Settings';
import { Home, Clock, Settings as SettingsIcon, Bot } from 'lucide-react';

function App() {
  const { user, updateUser, addXp } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeWorkout, setActiveWorkout] = useState(null);

  if (!user?.onboarded) {
    return <Onboarding />;
  }

  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setCurrentView('player');
  };

  const finishWorkout = () => {
    const completedWorkout = {
      ...activeWorkout,
      date: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    const newHistory = [...(user.history || []), completedWorkout];
    updateUser({ history: newHistory });

    // Award XP (e.g., 10 XP per minute or flat 50 XP)
    // Simple: 50 XP for completing a workout
    addXp(50);

    setCurrentView('dashboard');
    setActiveWorkout(null);
  };

  const exitWorkout = () => {
    if (confirm("Are you sure you want to quit this workout?")) {
      setCurrentView('dashboard');
      setActiveWorkout(null);
    }
  };

  if (currentView === 'player' && activeWorkout) {
    return (
      <WorkoutPlayer
        workout={activeWorkout}
        onComplete={finishWorkout}
        onExit={exitWorkout}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStartWorkout={startWorkout} />;
      case 'coach':
        return <AICoach />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onStartWorkout={startWorkout} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-20">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-4 z-50 flex justify-between items-center pb-8">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'dashboard' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>

        {/* Coach Button (Center, Prominent) */}
        <button
          onClick={() => setCurrentView('coach')}
          className={`relative -top-6 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${currentView === 'coach' ? 'bg-primary text-darker shadow-[0_0_20px_rgba(0,242,234,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          <Bot className="w-8 h-8" />
        </button>

        <button
          onClick={() => setCurrentView('history')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'history' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Clock className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
        </button>
        <button
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'settings' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
