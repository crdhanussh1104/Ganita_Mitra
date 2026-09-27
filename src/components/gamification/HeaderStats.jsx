import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, BookOpen, HelpCircle, Box, User, Flame, Star, Gem, Trophy, LogOut, ChevronDown, Edit3 } from 'lucide-react';
import { ClassSelector } from '../ui/ClassSelector';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeToggle';

import { logOutGoogle } from '../../services/firebaseAuth';

export const HeaderStats = ({ currentPage, onNavigate }) => {
  const { gameState, logoutStudent, updateStudentName } = useGame();
  const { t } = useLanguage();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(gameState.studentProfile?.name || 'Student');
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
        setIsEditingName(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

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

        {/* Desktop Header Navigation (Always visible on desktop & zoomed screens) */}
        <nav className="desktop-header-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={`Navigate to ${item.label}`}
                title={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? 'var(--primary)' : '#ffffff',
                  fontWeight: '700',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span className="nav-btn-label" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Real Stats Counters (Streak, XP, Gems) & Theme Toggle in Right Corner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
            className="hide-on-tight-screen"
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
            className="hide-on-tight-screen"
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

          {/* Student Profile Dropdown Menu */}
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setEditedName(gameState.studentProfile?.name || 'Student');
                setIsEditingName(false);
              }}
              title={`Logged in as ${gameState.studentProfile?.name || 'Student'}. Click for options.`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.35)',
                backgroundColor: isProfileMenuOpen ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={14} />
              <span className="hide-on-tight-screen">{(gameState.studentProfile?.name || 'Student').split(' ')[0]}</span>
              <ChevronDown size={13} style={{ transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Pull Down Options Popup Menu */}
            {isProfileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                minWidth: '220px',
                backgroundColor: 'var(--bg-card-solid, #ffffff)',
                border: '1.5px solid var(--border-light, #cbd5e1)',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                padding: '8px',
                zIndex: 1200,
                color: 'var(--text-main, #0f172a)'
              }}>
                {/* Header info */}
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-light, #e2e8f0)', marginBottom: '6px' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--primary, #3b82f6)' }}>
                    {gameState.studentProfile?.name || 'Student'}
                  </div>
                  {gameState.studentProfile?.email && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', wordBreak: 'break-all' }}>
                      {gameState.studentProfile.email}
                    </div>
                  )}
                </div>

                {/* Inline Name Editing or Pull-Down Actions */}
                {isEditingName ? (
                  <div style={{ padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                      Enter New Name:
                    </label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateStudentName(editedName);
                          setIsEditingName(false);
                          setIsProfileMenuOpen(false);
                        }
                      }}
                      autoFocus
                      style={{
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: '1.5px solid var(--primary)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        outline: 'none',
                        color: 'var(--text-main)',
                        backgroundColor: 'var(--bg-main)'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setIsEditingName(false)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-light)',
                          background: 'transparent',
                          color: 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateStudentName(editedName);
                          setIsEditingName(false);
                          setIsProfileMenuOpen(false);
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--primary)',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* Option 1: Change Name */}
                    <button
                      onClick={() => setIsEditingName(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-main)',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light, #eff6ff)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Edit3 size={15} color="var(--primary)" />
                      <span>Change Name</span>
                    </button>

                    {/* Option 2: View Profile */}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onNavigate) onNavigate('profile');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-main)',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light, #eff6ff)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User size={15} color="var(--primary)" />
                      <span>View Profile & Wardrobe</span>
                    </button>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'var(--border-light, #e2e8f0)', margin: '4px 0' }} />

                    {/* Option 3: Sign Out */}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={15} color="#ef4444" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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
