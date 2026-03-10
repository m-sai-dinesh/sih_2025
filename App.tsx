
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EducationModules from './components/EducationModules';
import VirtualDrill from './components/VirtualDrill';
import RegionalHazards from './components/RegionalHazards';
import ResourceVideos from './components/ResourceVideos';
import DisasterPlans from './components/DisasterPlans';
import Login from './components/Login';
import Chatbot from './components/Chatbot';
import { AppView, User } from './types';
import { getCurrentUser, logout } from './auth/authService';
import { LanguageProvider } from './contexts/LanguageContext';
import { useTranslation } from './hooks/useTranslation';

const MainApp: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const { t, loadingTranslations } = useTranslation();

  useEffect(() => {
    // Check for a logged-in user in session storage on initial load
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveView(AppView.DASHBOARD); 
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  const renderView = useCallback(() => {
    if (!currentUser) return null;

    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard currentUser={currentUser} setActiveView={setActiveView} />;
      case AppView.EDUCATION:
        return <EducationModules />;
      case AppView.VIRTUAL_DRILL:
        return <VirtualDrill currentUser={currentUser} />;
      case AppView.DISASTER_PLANS:
        return <DisasterPlans />;
      case AppView.REGIONAL_HAZARDS:
        return <RegionalHazards />;
      case AppView.RESOURCE_VIDEOS:
        return <ResourceVideos />;
      default:
        return <Dashboard currentUser={currentUser} setActiveView={setActiveView} />;
    }
  }, [activeView, currentUser]);
  
  if (loadingTranslations) {
      return (
          <div className="bg-dark-900 min-h-screen flex items-center justify-center">
              <div className="text-center font-mono">
                  <p className="text-lg font-semibold text-secondary animate-pulse">[booting EduDisaster_OS...]</p>
              </div>
          </div>
      );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-dark-900 min-h-screen font-sans text-dark-200 flex">
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(0, 164, 228, 0.1) 2%, transparent 0%), 
            radial-gradient(circle at 75px 75px, rgba(88, 101, 242, 0.1) 2%, transparent 0%)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      <Sidebar 
        user={currentUser} 
        activeView={activeView} 
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderView()}
        </main>
        <footer className="text-center p-4 text-dark-500 text-xs font-mono bg-dark-900 border-t border-dark-700">
          {t('app.footer')}
        </footer>
      </div>
      <Chatbot />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <MainApp />
  </LanguageProvider>
);


export default App;
