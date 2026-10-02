export const levelEvolutions = [
  { minLevel: 1, maxLevel: 4, title: 'Novice Explorer 🎓', color: '#1cb0f6', bg: '#ddf4ff' },
  { minLevel: 5, maxLevel: 9, title: 'Math Knight 🛡️', color: '#58cc02', bg: '#e5f9d8' },
  { minLevel: 10, maxLevel: 14, title: 'Wizard of Numbers 🧙', color: '#ce82ff', bg: '#f6e5ff' },
  { minLevel: 15, maxLevel: 99, title: 'Master Math Sovereign 👑', color: '#ffc800', bg: '#fff2df' }
];

export const badgesData = [
  { id: 'first_lesson', name: 'First Step 🎓', desc: 'Completed your first lesson', icon: '🎓', unlocked: true },
  { id: 'quiz_master', name: 'Quiz Master 🏆', desc: 'Scored 100% on a chapter quiz', icon: '🏆', unlocked: true },
  { id: 'streak_3', name: '3-Day Streak 🔥', desc: 'Maintained a 3-day learning streak', icon: '🔥', unlocked: true },
  { id: 'olympiad_hero', name: 'Olympiad Hero 🥇', desc: 'Completed an Olympiad Challenge set', icon: '🥇', unlocked: false },
  { id: 'abacus_pro', name: 'Abacus Master 🧮', desc: 'Solved 5 abacus visualizer puzzles', icon: '🧮', unlocked: true },
  { id: 'shape_builder', name: '3D Architect 🧊', desc: 'Explored 3D solids in the 3D Math Lab', icon: '🧊', unlocked: false }
];

export const avatarShopCatalog = {
  hats: [
    { id: 'none', name: 'No Hat', cost: 0, icon: '🧢' },
    { id: 'grad', name: 'Graduation Cap 🎓', cost: 50, icon: '🎓' },
    { id: 'crown', name: 'Golden Crown 👑', cost: 150, icon: '👑' },
    { id: 'wizard', name: 'Wizard Hat 🧙', cost: 200, icon: '🧙' },
    { id: 'star', name: 'Super Star Cap 🌟', cost: 100, icon: '🌟' }
  ],
  glasses: [
    { id: 'none', name: 'No Glasses', cost: 0, icon: '👀' },
    { id: 'smart', name: 'Nerd Glasses 👓', cost: 40, icon: '👓' },
    { id: 'vr', name: 'Cyber VR Headset 🥽', cost: 120, icon: '🥽' },
    { id: 'shades', name: 'Cool Sunshades 😎', cost: 80, icon: '😎' }
  ],
  outfits: [
    { id: 'explorer', name: 'Explorer Vest 🧭', cost: 0, icon: '🧭' },
    { id: 'wizard', name: 'Wizard Robe 🔮', cost: 100, icon: '🔮' },
    { id: 'astronaut', name: 'Cyber Armor 🚀', cost: 180, icon: '🚀' },
    { id: 'royal', name: 'Royal Cape 🏰', cost: 250, icon: '🏰' }
  ],
  pets: [
    { id: 'none', name: 'No Pet', cost: 0, icon: '🐾' },
    { id: 'owl', name: 'Math Owl 🦉', cost: 100, icon: '🦉' },
    { id: 'robot', name: 'Pi Robot 🤖', cost: 150, icon: '🤖' },
    { id: 'dragon', name: 'Mini Dragon 🐲', cost: 300, icon: '🐲' }
  ],
  themes: [
    { id: 'duolingo', name: 'Duolingo Emerald 💚', cost: 0, color: '#58cc02' },
    { id: 'apple', name: 'Apple Glass Blue 💙', cost: 50, color: '#1cb0f6' },
    { id: 'dark', name: 'Cyber Obsidian 🖤', cost: 100, color: '#8b5cf6' },
    { id: 'gold', name: 'Royal Gold 💛', cost: 200, color: '#ffc800' }
  ]
};
