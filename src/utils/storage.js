const STORAGE_KEY = 'MATH_MADE_EASY_STATE_V2';

export const initialGameState = {
  selectedClass: 'class4',
  xp: 0,
  level: 1,
  streak: 0, // Fresh accounts start at 0 streak
  lastLoginDate: new Date().toISOString().split('T')[0],
  lastLearningDate: null,
  gems: 0,
  equippedAvatar: {
    skin: 'default',
    hat: 'none',
    glasses: 'none',
    outfit: 'explorer',
    pet: 'none'
  },
  unlockedInventory: ['hat_none', 'glasses_none', 'outfit_explorer', 'pet_none'],
  completedChapters: [],
  completedLessons: [],
  claimedMissions: [],
  bookmarks: [],
  accuracyHistory: [],
  visited3DLab: false,
  askedPiBot: false,
  soundMuted: false,
  voiceEnabled: true,
  theme: 'daylight',
  studentProfile: {
    isLoggedIn: false,
    name: '',
    email: ''
  }
};

export const loadGameState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().split('T')[0];

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (!saved) {
      return {
        ...initialGameState,
        streak: 0,
        lastLoginDate: today
      };
    }

    const state = JSON.parse(saved);
    const lastLearning = state.lastLearningDate;

    let updatedStreak = state.streak || 0;

    // Reset streak to 0 if learner hasn't completed any learning activity or missed a day
    if (!lastLearning || (lastLearning !== today && lastLearning !== yesterday)) {
      updatedStreak = 0;
    }

    return {
      ...initialGameState,
      ...state,
      streak: updatedStreak,
      lastLoginDate: today
    };
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return {
      ...initialGameState,
      streak: 0,
      lastLoginDate: new Date().toISOString().split('T')[0]
    };
  }
};

export const saveGameState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
};
