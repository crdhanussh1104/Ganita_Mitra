import React from 'react';
import { FormulaBook } from '../components/library/FormulaBook';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export const Library = () => {
  const { gameState } = useGame();
  const { t } = useLanguage();

  const selectedClassId = gameState.selectedClass || 'class4';
  const classNum = parseInt(selectedClassId.replace(/\D/g, ''), 10) || 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-rounded)', fontSize: '1.8rem', fontWeight: '800' }}>
            {t('class_label', { classNum })} {t('library_title')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {t('library_subtitle')}
          </p>
        </div>
      </div>

      <FormulaBook classId={classNum} />
    </div>
  );
};
