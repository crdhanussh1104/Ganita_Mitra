import React from 'react';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, BookOpen, HelpCircle, Box, User, Flame, Star, Gem, Trophy, LogOut } from 'lucide-react';
import { ClassSelector } from '../ui/ClassSelector';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeToggle';

import { logOutGoogle } from '../../services/firebaseAuth';

export const HeaderStats = ({ currentPage, onNavigate }) => {
  const { gameState, logoutStudent } = useGame();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logOutGoogle();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    logoutStudent();
    if (onNavigate) {
      onNavigate('login');
    }
    window.location.hash = '#login';
  };

  const navItems = [
    { id: 'home', label: t('nav_home') || 'Home', icon: Home },
    { id: 'learn', label: t('nav_learn') || 'Syllabus', icon: BookOpen },
    { id: 'quiz', label: t('nav_practice') || 'Practice', icon: HelpCircle },
    { id: 'threeLab', label: t('nav_lab') || '3D Lab', icon: Box },
    { id: 'profile', label: t('nav_profile') || 'Profile', icon: User }
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Brand Logo, Class Switcher & Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            onClick={() => onNavigate && onNavigate('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            title="Ganita Mitra"
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ffffff',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.05rem',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              GM
            </div>
          </div>

          {/* Class Selector */}
          <ClassSelector />

          {/* Global Language Selector */}
          <LanguageSelector />
        </div>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hide-on-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={`Navigate to ${item.label}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? 'var(--primary)' : '#ffffff',
                  fontWeight: '700',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Real Stats Counters (Streak, XP, Gems) & Theme Toggle in Right Corner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggle />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '0.82rem',
              color: '#fff8d6',
              backgroundColor: 'rgba(0,0,0,0.15)',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
            title="Daily Learning Streak"
          >
            <Flame size={15} fill="#ff9600" color="#ff9600" />
            <span>{gameState.streak}d</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '0.82rem',
              color: '#ddf4ff',
              backgroundColor: 'rgba(0,0,0,0.15)',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
            title="XP Points"
          >
            <Star size={15} fill="#1cb0f6" color="#1cb0f6" />
            <span>{gameState.xp}</span>
          </div>

          <div
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '0.82rem',
              color: '#f6e5ff',
              backgroundColor: 'rgba(0,0,0,0.15)',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
            title="Gems"
          >
            <Gem size={15} fill="#ce82ff" color="#ce82ff" />
            <span>{gameState.gems}</span>
          </div>

          {/* Student Profile & Logout Button (Image 1) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => onNavigate && onNavigate('login')}
              title={`Logged in as ${gameState.studentProfile?.name || 'Student'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.35)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <User size={14} />
              <span className="hide-on-mobile">{(gameState.studentProfile?.name || 'Student').split(' ')[0]}</span>
            </button>

            <button
              onClick={handleLogout}
              title="Log out of Ganita Mitra"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(239, 68, 68, 0.35)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>


      {/* Sleek Mobile Bottom Navigation Bar for SmartPhones */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
