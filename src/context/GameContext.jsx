import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadGameState, saveGameState, initialGameState } from '../utils/storage';
import { soundFx } from '../utils/audioSynth';
import { triggerConfetti } from '../utils/confetti';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(() => loadGameState());

  useEffect(() => {
    saveGameState(gameState);
    soundFx.setMuted(gameState.soundMuted);
    document.documentElement.setAttribute('data-theme', gameState.theme || 'daylight');
  }, [gameState]);

  const addXP = (amount) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        setTimeout(() => {
          soundFx.playLevelUp();
          triggerConfetti('levelUp');
        }, 300);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        gems: leveledUp ? prev.gems + 25 : prev.gems
      };
    });
  };

  const addGems = (amount) => {
    setGameState(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const claimMission = (missionId, xpReward = 25, gemsReward = 15) => {
    setGameState(prev => {
      if ((prev.claimedMissions || []).includes(missionId)) return prev;

      const newClaimed = [...(prev.claimedMissions || []), missionId];
      const newXP = prev.xp + xpReward;
      const newLevel = Math.floor(newXP / 150) + 1;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        gems: prev.gems + gemsReward,
        claimedMissions: newClaimed
      };
    });
    soundFx.playCorrect();
    triggerConfetti('mission');
  };

  const markVisited3DLab = () => {
    setGameState(prev => ({ ...prev, visited3DLab: true }));
  };

  const markAskedPiBot = () => {
    setGameState(prev => ({ ...prev, askedPiBot: true }));
  };

  const buyInventoryItem = (itemId, cost) => {
    if (gameState.gems < cost || gameState.unlockedInventory.includes(itemId)) {
      return false;
    }
    setGameState(prev => ({
      ...prev,
      gems: prev.gems - cost,
      unlockedInventory: [...prev.unlockedInventory, itemId]
    }));
    soundFx.playCorrect();
    return true;
  };

  const equipItem = (category, itemId) => {
    setGameState(prev => ({
      ...prev,
      equippedAvatar: {
        ...prev.equippedAvatar,
        [category]: itemId
      }
    }));
    soundFx.playClick();
  };

  const toggleBookmark = (id) => {
    setGameState(prev => {
      const exists = prev.bookmarks.includes(id);
      const newBookmarks = exists
        ? prev.bookmarks.filter(b => b !== id)
        : [...prev.bookmarks, id];
      return { ...prev, bookmarks: newBookmarks };
    });
    soundFx.playClick();
  };

  const completeLesson = (lessonId, score = 100) => {
    setGameState(prev => {
      const newCompleted = (prev.completedLessons || []).includes(lessonId)
        ? prev.completedLessons
        : [...(prev.completedLessons || []), lessonId];

      const newXP = prev.xp + 50;
      const newLevel = Math.floor(newXP / 150) + 1;

      return {
        ...prev,
        completedLessons: newCompleted,
        accuracyHistory: [...(prev.accuracyHistory || []).slice(-9), score],
        xp: newXP,
        level: newLevel,
        gems: prev.gems + 10
      };
    });
    soundFx.playCorrect();
  };

  const toggleSound = () => {
    setGameState(prev => ({ ...prev, soundMuted: !prev.soundMuted }));
  };

  const toggleVoice = () => {
    setGameState(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const setTheme = (themeName) => {
    setGameState(prev => ({ ...prev, theme: themeName }));
  };

  const changeClass = (classId) => {
    setGameState(prev => ({ ...prev, selectedClass: classId }));
    soundFx.playClick();
  };

  const deductHeart = (amount = 1) => {
    setGameState(prev => ({
      ...prev,
      hearts: Math.max(0, (prev.hearts !== undefined ? prev.hearts : 5) - amount)
    }));
    soundFx.playIncorrect();
  };

  const setGems = (valOrFn) => {
    setGameState(prev => ({
      ...prev,
      gems: typeof valOrFn === 'function' ? valOrFn(prev.gems) : valOrFn
    }));
  };

  const equipAvatarItem = (category, itemId) => {
    equipItem(category, itemId);
  };

  const loginStudent = ({ name, email, selectedClass }) => {
    setGameState(prev => ({
      ...prev,
      selectedClass: selectedClass || prev.selectedClass || 'class4',
      studentProfile: {
        isLoggedIn: true,
        name: (name || '').trim(),
        email: (email || '').trim()
      }
    }));
    soundFx.playLevelUp();
    triggerConfetti('levelUp');
  };

  const logoutStudent = () => {
    setGameState(prev => ({
      ...prev,
      studentProfile: {
        isLoggedIn: false,
        name: '',
        email: ''
      }
    }));
    soundFx.playClick();
  };

  const updateStudentName = (newName) => {
    const trimmed = (newName || '').trim();
    if (!trimmed) return;
    setGameState(prev => ({
      ...prev,
      studentProfile: {
        ...(prev.studentProfile || {}),
        name: trimmed
      }
    }));
    soundFx.playCorrect();
  };

  return (
    <GameContext.Provider value={{
      gameState,
      addXP,
      addGems,
      setGems,
      deductHeart,
      claimMission,
      markVisited3DLab,
      markAskedPiBot,
      buyInventoryItem,
      equipItem,
      equipAvatarItem,
      toggleBookmark,
      completeLesson,
      toggleSound,
      toggleVoice,
      setTheme,
      changeClass,
      loginStudent,
      logoutStudent,
      updateStudentName
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

