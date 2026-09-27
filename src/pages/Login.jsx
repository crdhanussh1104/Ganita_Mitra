import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { CardRounded } from '../components/ui/CardRounded';
import { Button3D } from '../components/ui/Button3D';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { soundFx } from '../utils/audioSynth';
import { signInWithGoogle, logOutGoogle } from '../services/firebaseAuth';
import {
  User, Mail, ArrowRight, Check, Sparkles, X, LogOut, ChevronRight,
  GraduationCap, CheckCircle2, Shield, AlertCircle, Loader2
} from 'lucide-react';

const CLASS_OPTIONS = [
  { id: 'class1', num: 1, title: 'Class 1', tag: 'Primary' },
  { id: 'class2', num: 2, title: 'Class 2', tag: 'Primary' },
  { id: 'class3', num: 3, title: 'Class 3', tag: 'Elementary' },
  { id: 'class4', num: 4, title: 'Class 4', tag: 'Elementary' },
  { id: 'class5', num: 5, title: 'Class 5', tag: 'Elementary' },
  { id: 'class6', num: 6, title: 'Class 6', tag: 'Middle' },
  { id: 'class7', num: 7, title: 'Class 7', tag: 'Junior' },
  { id: 'class8', num: 8, title: 'Class 8', tag: 'Junior' },
  { id: 'class9', num: 9, title: 'Class 9', tag: 'Senior' },
  { id: 'class10', num: 10, title: 'Class 10', tag: 'ICSE Board' }
];

export const Login = ({ onNavigate }) => {
  const { gameState, loginStudent, logoutStudent, changeClass } = useGame();
  const { t } = useLanguage();

  const currentProfile = gameState.studentProfile || {};
  const isLoggedIn = Boolean(currentProfile.isLoggedIn && currentProfile.name);

  const [isLoading, setIsLoading] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [studentName, setStudentName] = useState(currentProfile.name || '');
  const [selectedClassId, setSelectedClassId] = useState(gameState.selectedClass || 'class6');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Trigger Real Google OAuth Popup (accounts.google.com)
  const handleGoogleSignInClick = async () => {
    setIsLoading(true);
    setErrorMsg('');
    soundFx.playClick();

    const res = await signInWithGoogle();
    setIsLoading(false);

    if (res.success && res.user) {
      setGoogleUser(res.user);
      setStudentName(res.user.name || res.user.email.split('@')[0]);
      setShowClassModal(true);
      soundFx.playCorrect();
    } else {
      if (res.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please choose a Google account to proceed.');
      } else if (res.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setErrorMsg(res.message || 'Failed to authenticate with Google. Please try again.');
        soundFx.playIncorrect();
      }
    }
  };

  // 2. Confirm Class Selection & Enter Classroom
  const handleConfirmLogin = (e) => {
    if (e) e.preventDefault();
    if (!googleUser || !googleUser.email) {
      setErrorMsg('Google Authentication required.');
      soundFx.playIncorrect();
      return;
    }

    const finalName = (studentName || googleUser.name || 'Student').trim();
    if (!finalName || finalName.length < 2) {
      setErrorMsg('Please enter a valid student name.');
      soundFx.playIncorrect();
      return;
    }

    loginStudent({
      name: finalName,
      email: googleUser.email,
      selectedClass: selectedClassId
    });

    changeClass(selectedClassId);
    setShowClassModal(false);

    if (onNavigate) {
      onNavigate('home');
    }
  };

  const handleLogout = async () => {
    await logOutGoogle();
    logoutStudent();
    setGoogleUser(null);
    setShowClassModal(false);
  };

  return (
    <div className="login-screen-wrapper" style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(10px, 2vw, 24px)',
      boxSizing: 'border-box'
    }}>
      

      {/* 16:9 Landscape Card Container */}
      <div className="login-card-landscape" style={{
        width: '100%',
        maxWidth: '1240px',
        maxHeight: '94vh',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        
        {/* Top-Right Header Controls: Language Selector & Theme Toggle */}
        <div style={{
          position: 'absolute',
          top: 'clamp(12px, 2vh, 20px)',
          right: 'clamp(14px, 2.5vw, 24px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <LanguageSelector variant="login" />
          <ThemeToggle />
        </div>

        
        {/* Main Grid: Left Boy Illustration & Right Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(18px, 3vh, 36px) clamp(20px, 3vw, 44px)',
          gap: 'clamp(20px, 3vw, 40px)',
          flex: 1
        }}>
          
          {/* Left Side: Prominent, High-Resolution Boy Illustration */}
          <div style={{
            flex: '1.15 1 420px',
            maxWidth: '560px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className="login-illus-box" style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/boy-illustration-large.png"
                alt="Student studying math formulas"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 'clamp(320px, 60vh, 520px)',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Vertical Blue Divider Line */}
          <div className="login-divider-line" style={{
            width: '3.5px',
            alignSelf: 'stretch',
            borderRadius: '2px',
            margin: '0 4px',
            minHeight: '280px'
          }} />

          {/* Right Side: Ganita Mitra Title, Quote & Google Login Button */}
          <div style={{
            flex: '1 1 360px',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '8px 0'
          }}>
            
            {/* Big Title */}
            <div className="login-title-main" style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: '900',
              fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
              lineHeight: '1.02',
              letterSpacing: '-1.5px',
              marginBottom: 'clamp(14px, 2.5vh, 24px)'
            }}>
              <div>Ganita</div>
              <div>Mitra</div>
            </div>

            {/* Shakuntala Devi Quote */}
            <div style={{ marginBottom: 'clamp(18px, 3.2vh, 32px)' }}>
              <p className="login-quote-text" style={{
                fontSize: 'clamp(0.95rem, 1.6vw, 1.22rem)',
                fontWeight: '700',
                margin: '0 0 4px 0',
                lineHeight: '1.35'
              }}>
                Everything around you is mathematics.
              </p>
              <p className="login-quote-text" style={{
                fontSize: 'clamp(0.95rem, 1.6vw, 1.22rem)',
                fontWeight: '700',
                margin: '0 0 6px 0',
                lineHeight: '1.35'
              }}>
                Everything around you is numbers
              </p>
              <div className="login-quote-author" style={{
                fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                fontWeight: '800',
                textAlign: 'right',
                paddingRight: '12px'
              }}>
                – Shakuntala Devi
              </div>
            </div>

            {errorMsg && (
              <div style={{
                background: '#fef2f2',
                border: '1.5px solid #f87171',
                color: '#dc2626',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} color="#dc2626" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Action Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '400px' }}>
              
              {!isLoggedIn ? (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignInClick}
                  className="login-google-btn hover-lift"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    padding: 'clamp(12px, 2vh, 16px) clamp(20px, 2.5vw, 28px)',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                    cursor: isLoading ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={24} className="animate-spin" color="#4285F4" />
                  ) : (
                    /* Google Multicolor Logo */
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  )}
                  <span>{isLoading ? 'Connecting to Google...' : 'Login with Google'}</span>
                </button>
              ) : (
                /* Logged In As State */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* Active Session Card */}
                  <div className="login-session-card" style={{
                    padding: '12px 18px',
                    borderRadius: '14px',
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.08)'
                  }}>
                    <div>
                      <div className="login-session-title" style={{ fontSize: '0.75rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        LOGGED IN AS
                      </div>
                      <div className="login-session-name" style={{ fontSize: '1.08rem', fontWeight: '800', color: '#14532d', marginTop: '2px' }}>
                        {currentProfile.name}
                      </div>
                      <div className="login-session-sub" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803d', marginTop: '2px' }}>
                        Class {gameState.selectedClass?.replace(/\D/g, '') || '6'} ICSE • {currentProfile.email}
                      </div>
                    </div>
                    <span style={{ fontSize: '1.8rem' }}>🎓</span>
                  </div>

                  {/* Button Actions: Enter Website, Switch Account, and Logout */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1.8fr) minmax(80px, 1fr) minmax(95px, 1.1fr)', gap: '8px', width: '100%' }}>
                    <Button3D
                      onClick={() => onNavigate && onNavigate('home')}
                      variant="primary"
                      style={{ padding: '12px 10px', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                    >
                      <span>Enter Website</span>
                      <ArrowRight size={16} />
                    </Button3D>

                    <Button3D
                      onClick={handleGoogleSignInClick}
                      variant="outline"
                      style={{ padding: '12px 8px', fontSize: '0.9rem', fontWeight: '700', whiteSpace: 'nowrap' }}
                      title="Switch Google Account"
                    >
                      Switch
                    </Button3D>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="hover-lift"
                      style={{
                        padding: '12px 8px',
                        borderRadius: '12px',
                        border: '1.5px solid #fca5a5',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                      title="Log Out"
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Bottom Cyan Wave Accent */}
        <div style={{
          height: 'clamp(18px, 2.5vh, 28px)',
          background: 'linear-gradient(90deg, transparent 65%, #67e8f9 100%)',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px'
        }} />

      </div>

      {/* ========================================================================= */}
      {/* GOOGLE AUTHENTICATED: SELECT CLASS TO VISIT MODAL */}
      {/* ========================================================================= */}
      {showClassModal && googleUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          
          <div className="login-modal-box" style={{
            borderRadius: '24px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            
            {/* Modal Header */}
            <div className="login-modal-header" style={{
              padding: '20px 24px 14px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Google Logo */}
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
                    Google Verified Account
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700' }}>
                    ✓ Authenticated via Google
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowClassModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmLogin} style={{ padding: '18px 24px' }}>
              
              {/* Google Verified Account Banner */}
              <div className="login-session-card" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                marginBottom: '18px'
              }}>
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                ) : (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#4285F4',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.1rem'
                  }}>
                    {googleUser.name ? googleUser.name[0] : 'G'}
                  </div>
                )}
                <div>
                  <div className="login-session-name" style={{ fontWeight: '800', color: '#14532d', fontSize: '0.98rem' }}>
                    {googleUser.name}
                  </div>
                  <div className="login-session-sub" style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: '600' }}>
                    {googleUser.email}
                  </div>
                </div>
              </div>

              {/* Student Name */}
              <div style={{ marginBottom: '16px' }}>
                <label className="login-modal-label" style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', marginBottom: '6px' }}>
                  STUDENT NAME:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="login-modal-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Class to Visit Picker */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="login-modal-label" style={{ fontSize: '0.82rem', fontWeight: '800' }}>
                    WHICH CLASS DO YOU WANT TO VISIT TODAY?
                  </label>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary, #4f46e5)' }}>
                    Class {selectedClassId.replace(/\D/g, '')} ICSE
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px'
                }}>
                  {CLASS_OPTIONS.map(c => {
                    const isSel = selectedClassId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedClassId(c.id);
                          soundFx.playClick();
                        }}
                        className={isSel ? 'login-class-pill-selected' : 'login-class-pill-unselected'}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '10px',
                          fontWeight: isSel ? '900' : '700',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{c.num}</span>
                        <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>{c.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enter Button */}
              <Button3D
                type="submit"
                variant="primary"
                style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Sparkles size={18} />
                <span>Enter Class {selectedClassId.replace(/\D/g, '')} & Start Learning</span>
                <ArrowRight size={18} />
              </Button3D>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};
