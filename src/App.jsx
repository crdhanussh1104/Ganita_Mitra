import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useGame } from './context/GameContext';
import { GameProvider } from './context/GameContext';
import { LanguageProvider } from './context/LanguageContext';
import { HeaderStats } from './components/gamification/HeaderStats';
import { FloatingPiBot } from './components/chat/FloatingPiBot';
import { OfflineNotice } from './components/ui/OfflineNotice';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Home } from './pages/Home';

import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import './styles/global.css';

// Lazy-loaded routes for code splitting and Web Vitals optimization
const ThreeLab = lazy(() => import('./pages/ThreeLab').then(m => ({ default: m.ThreeLab })));
const ARLab = lazy(() => import('./pages/ARLab').then(m => ({ default: m.ARLab })));
const OlympiadHub = lazy(() => import('./pages/OlympiadHub').then(m => ({ default: m.OlympiadHub })));
const Library = lazy(() => import('./pages/Library').then(m => ({ default: m.Library })));

const VALID_PAGES = ['home', 'login', 'learn', 'olympiadHub', 'quiz', 'library', 'threeLab', 'arLab', 'dashboard', 'profile'];

const getInitialPage = () => {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (VALID_PAGES.includes(hash)) return hash;
    const saved = localStorage.getItem('mme_currentPage');
    if (VALID_PAGES.includes(saved)) return saved;
  } catch (e) {
    console.warn('Unable to read initial page from hash/storage:', e);
  }
  return 'home';
};

const getInitialChapter = () => {
  try {
    return localStorage.getItem('mme_selectedChapterId') || 'chap_1';
  } catch (e) {
    return 'chap_1';
  }
};

function AppContent() {
  const { gameState } = useGame();
  const isLoggedIn = Boolean(gameState.studentProfile?.isLoggedIn && gameState.studentProfile?.name);

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [selectedChapterId, setSelectedChapterIdState] = useState(getInitialChapter);

  // When not logged in OR when explicitly on 'login' page, hide all navbar / headers
  const isLoginPage = !isLoggedIn || currentPage === 'login';

  const navigateTo = (page) => {
    if (VALID_PAGES.includes(page)) {
      setCurrentPage(page);
      try {
        window.location.hash = page;
        localStorage.setItem('mme_currentPage', page);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setSelectedChapterId = (chapId) => {
    setSelectedChapterIdState(chapId);
    if (chapId) {
      try {
        localStorage.setItem('mme_selectedChapterId', chapId);
      } catch (e) {}
    }
  };

  // Sync hash and page state on browser back/forward and page refresh
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (VALID_PAGES.includes(hash)) {
        setCurrentPage(hash);
        try {
          localStorage.setItem('mme_currentPage', hash);
        } catch (e) {}
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Ensure hash reflects current page on load
    const currentHash = window.location.hash.replace(/^#\/?/, '');
    if (currentHash !== currentPage && VALID_PAGES.includes(currentPage)) {
      window.location.hash = currentPage;
    }
    try {
      localStorage.setItem('mme_currentPage', currentPage);
    } catch (e) {}

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  // Register PWA Service Worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration standby:', err);
      });
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-main)' }}>
      {/* Offline Toast Notification */}
      <OfflineNotice />

      {/* Top Header & Mobile Bottom Nav ONLY when logged in and not on login page */}
      {!isLoginPage && (
        <HeaderStats currentPage={currentPage} onNavigate={navigateTo} />
      )}

      {/* Main Content Area */}
      <ErrorBoundary key={currentPage}>
        <main className={!isLoginPage ? "app-main-content page-enter" : "page-enter"} style={isLoginPage ? { padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' } : {}}>
          <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontWeight: '800', color: 'var(--primary)' }}>Loading interactive module...</div>}>
            {isLoginPage ? (
              <Login onNavigate={navigateTo} />
            ) : (
              <>
                {currentPage === 'home' && (
                  <Home
                    onNavigate={navigateTo}
                    onSelectChapter={setSelectedChapterId}
                  />
                )}

                {currentPage === 'learn' && (
                  <Learn
                    selectedChapterId={selectedChapterId}
                    onNavigate={navigateTo}
                    onSelectChapter={setSelectedChapterId}
                  />
                )}

                {currentPage === 'olympiadHub' && (
                  <OlympiadHub
                    onNavigate={navigateTo}
                    onSelectChapter={setSelectedChapterId}
                  />
                )}

                {currentPage === 'quiz' && (
                  <Quiz
                    selectedChapterId={selectedChapterId}
                    onNavigate={navigateTo}
                  />
                )}

                {currentPage === 'library' && <Library />}

                {currentPage === 'threeLab' && <ThreeLab />}

                {currentPage === 'arLab' && <ARLab />}

                {currentPage === 'dashboard' && <Dashboard />}

                {currentPage === 'profile' && <Profile />}
              </>
            )}
          </Suspense>
        </main>
      </ErrorBoundary>

      {/* Global Floating Pi-Bot Assistant ONLY when logged in and inside the app */}
      {!isLoginPage && <FloatingPiBot onNavigate={navigateTo} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </GameProvider>
    </ErrorBoundary>
  );
}

