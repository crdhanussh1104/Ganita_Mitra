import React from 'react';
import { getChaptersForClass } from '../data/chapters';
import { AvatarCharacter } from '../components/avatar/AvatarCharacter';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Play, BookOpen, HelpCircle, Box, Trophy, Lightbulb
} from 'lucide-react';

export const Home = ({ onNavigate, onSelectChapter }) => {
  const { gameState } = useGame();
  const { t } = useLanguage();
  const isDark = gameState?.theme === 'dark' || gameState?.theme === 'space' || gameState?.theme === 'cyber';
  
  const selectedClassId = gameState.selectedClass || 'class4';
  const classNum = selectedClassId.replace('class', '');
  const chapters = getChaptersForClass(selectedClassId);

  // Daily Math Spark Quote
  const dailyQuote = {
    text: "Mathematics is not about numbers, equations, or algorithms: it is about understanding!",
    author: "William Paul Thurston"
  };

  // Calculate Real Progress based on Student's Completed Lessons for THIS class
  const allLessons = [];
  chapters.forEach(chap => {
    chap.lessons.forEach(les => {
      allLessons.push({ ...les, chapterId: chap.id, chapterNumber: chap.number, chapterTitle: chap.title, color: chap.color });
    });
  });

  const completedSet = new Set(gameState.completedLessons || []);
  const classCompletedCount = allLessons.filter(l => completedSet.has(l.id)).length;
  const uncompletedLesson = allLessons.find(l => !completedSet.has(l.id)) || allLessons[allLessons.length - 1] || null;
  const resumeChap = uncompletedLesson ? chapters.find(c => c.id === uncompletedLesson.chapterId) : chapters[0];
  const realProgressPct = allLessons.length > 0 ? Math.round((classCompletedCount / allLessons.length) * 100) : 0;

  // Shared Card Style
  const cardStyle = {
    background: 'var(--bg-card-solid)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 32px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-card)'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      width: '100%',
      maxWidth: '100%',
      paddingBottom: '60px'
    }}>
      
      {/* 1. Welcome Section */}
      <div style={{
        ...cardStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap-reverse',
        gap: '24px',
        padding: '32px'
      }}>
        <div style={{ flex: '1 1 500px', minWidth: '280px' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px', lineHeight: '1.25' }}>
            👋 {gameState.studentProfile?.isLoggedIn && gameState.studentProfile.name ? `Welcome back, ${gameState.studentProfile.name}!` : t('home_hero_title')}
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '800px', lineHeight: '1.6' }}>
            {gameState.studentProfile?.isLoggedIn ? `Ready to conquer Class ${classNum} Mathematics today? Continue your chapters and practice below.` : t('home_hero_desc')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', color: 'var(--text-main)', fontWeight: '700', fontSize: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔥 {t('header_streak', { streak: gameState.streak })}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⭐ {t('header_xp', { xp: gameState.xp })}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🏆 {(gameState.claimedMissions || []).length} {t('completed')}</span>
          </div>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <AvatarCharacter avatarState={gameState.equippedAvatar} size={120} animate={true} />
        </div>
      </div>

      {/* 2. Continue Learning */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800', paddingLeft: '4px' }}>
          📚 {t('continue')} {t('nav_learn')}
        </h2>
        {chapters.length > 0 && resumeChap ? (
          <div style={{
            ...cardStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            padding: '28px 32px'
          }}>
            <div style={{ flex: '1 1 450px', minWidth: '260px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                {t('tab_syllabus')} • {t('class_label', { classNum })}
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                {resumeChap.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {t('next')}: <strong>{uncompletedLesson?.title || t('completed')}</strong>
              </p>
              
              {/* Progress Bar Container */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ flex: 1, height: '12px', backgroundColor: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${realProgressPct}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '99px',
                    transition: 'width 0.5s ease-in-out'
                  }} />
                </div>
                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {realProgressPct}% {t('completed')}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                onSelectChapter(resumeChap.id);
                onNavigate('learn');
              }}
              className="hover-lift"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: '1.05rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <Play size={20} fill="currentColor" />
              {t('continue')}
            </button>
          </div>
        ) : (
          <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-muted)' }}>
            Curriculum content for {t('class_label', { classNum })} is coming soon! Check back later.
          </div>
        )}
      </div>

      {/* 3. Quick Actions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800', paddingLeft: '4px' }}>
          {t('explore')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
          
          <div onClick={() => onNavigate('learn')} className="hover-lift" style={{ ...cardStyle, backgroundColor: 'var(--accent-blue)', cursor: 'pointer', padding: '24px' }}>
            <BookOpen size={30} color="#2b3a4a" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2b3a4a' }}>{t('nav_learn')}</h3>
            <p style={{ fontSize: '0.88rem', color: '#2b3a4a', opacity: 0.85, marginTop: '6px', lineHeight: '1.4' }}>{t('learn_subtitle', { classNum })}</p>
          </div>

          <div onClick={() => onNavigate('quiz')} className="hover-lift" style={{ ...cardStyle, backgroundColor: 'var(--accent-green)', cursor: 'pointer', padding: '24px' }}>
            <HelpCircle size={30} color="#2b3a4a" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2b3a4a' }}>{t('nav_practice')}</h3>
            <p style={{ fontSize: '0.88rem', color: '#2b3a4a', opacity: 0.85, marginTop: '6px', lineHeight: '1.4' }}>{t('quiz_subtitle')}</p>
          </div>

          <div onClick={() => onNavigate('threeLab')} className="hover-lift" style={{ ...cardStyle, backgroundColor: 'var(--accent-purple)', cursor: 'pointer', padding: '24px' }}>
            <Box size={30} color="#2b3a4a" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2b3a4a' }}>{t('nav_lab')}</h3>
            <p style={{ fontSize: '0.88rem', color: '#2b3a4a', opacity: 0.85, marginTop: '6px', lineHeight: '1.4' }}>{t('lab_subtitle')}</p>
          </div>

          <div onClick={() => onNavigate('olympiadHub')} className="hover-lift" style={{ ...cardStyle, backgroundColor: 'var(--accent-yellow)', cursor: 'pointer', padding: '24px' }}>
            <Trophy size={30} color="#2b3a4a" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2b3a4a' }}>{t('nav_olympiad')}</h3>
            <p style={{ fontSize: '0.88rem', color: '#2b3a4a', opacity: 0.85, marginTop: '6px', lineHeight: '1.4' }}>{t('olympiad_subtitle')}</p>
          </div>

        </div>
      </div>

      {/* 4. Chapters Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800', paddingLeft: '4px' }}>
          📚 {t('home_curriculum_title')} ({t('class_label', { classNum })})
        </h2>
        {chapters.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
            {chapters.map((chap, idx) => (
              <div key={chap.id} className="hover-lift" onClick={() => { onSelectChapter(chap.id); onNavigate('learn'); }} style={{ ...cardStyle, cursor: 'pointer', padding: '22px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>
                  {['🔢', '➕', '✖️', '➗', '📐', '📏', '📊', '🧩', '📈', '🎯'][idx % 10]}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.35' }}>
                  {chap.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {t('chapter_lessons', { count: chap.lessons.length })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-muted)' }}>
            More chapters being added for this class soon!
          </div>
        )}
      </div>

      {/* 5. Daily Math Spark */}
      <div
        className="daily-math-wonder"
        style={{
          ...cardStyle,
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#FFFBEA',
          border: isDark ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1px solid #F9D978',
          boxShadow: isDark ? '0 6px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.12)' : 'var(--shadow-sm)',
          display: 'flex',
          gap: '18px',
          alignItems: 'flex-start',
          padding: '24px 28px',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="wonder-icon" style={{ color: isDark ? '#fbbf24' : '#E0A800', marginTop: '4px', flexShrink: 0 }}>
          <Lightbulb size={28} />
        </div>
        <div>
          <h4 className="wonder-title" style={{ fontSize: '0.85rem', fontWeight: '800', color: isDark ? '#fbbf24' : '#B45309', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
            {t('home_fact_title')}
          </h4>
          <p className="wonder-quote" style={{ fontSize: '1.1rem', fontWeight: '600', color: isDark ? '#f8fafc' : '#1E293B', fontStyle: 'italic', marginBottom: '8px', lineHeight: '1.45' }}>
            "{dailyQuote.text}"
          </p>
          <span className="wonder-author" style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#475569', fontWeight: '600' }}>
            — {dailyQuote.author}
          </span>
        </div>
      </div>

    </div>
  );
};


