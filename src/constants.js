/*
 The constants file is used to store anything
 that multiple files use, that should ALWAYS be the same
 
 It is an industry standard to make these variables fully capitalised
 */

export const USER_INTERFACE_ID = 'user-interface';
export const START_QUIZ_BUTTON_ID = 'start-quiz-button';
export const ANSWERS_LIST_ID = 'answers-list';
export const NEXT_QUESTION_BUTTON_ID = 'next-question-button';
export const AVOID_QUESTION_BUTTON_ID = 'avoid-question-button';
export const ELIMINATE_TWO_ANSWERS_BUTTON_ID = 'eliminate-two-answers-button';

export const SCORE_INDICATOR_ID = 'score-indicator';
export const STORAGE_KEY = 'quiz-state-v1';

/* Prize ladder removed */

/* New UI IDs for interactive prize experience */
export const PROGRESS_BAR_ID = 'progress-bar';
export const PROGRESS_FILL_ID = 'progress-fill';
export const PROGRESS_MARKS_ID = 'progress-marks';
export const SALAD_BOWL_ID = 'salad-bowl';
export const PRIZE_POP_ID = 'prize-pop';

/* Money prize tiers removed */

/* Salad-themed prize progression (stage 1..10) */
export const PRIZE_STEPS = [
  { name: 'Lettuce Leaf', emoji: '🥬' },
  { name: 'Cherry Tomato', emoji: '🍅' },
  { name: 'Cucumber Slice', emoji: '🥒' },
  { name: 'Crunchy Crouton', emoji: '🥖' },
  { name: 'Olive Ring', emoji: '🫒' },
  { name: 'Cheese Star', emoji: '🧀' },
  { name: 'Dressing Drizzle', emoji: '🫙' },
  { name: 'Salad Bowl Crown', emoji: '🥗' },
  { name: 'Golden Fork', emoji: '🍴' },
  { name: 'Salad Master Trophy', emoji: '🏆' },
];

/* Ingredients added to the salad bowl on each correct answer */
export const SALAD_BOWL_INGREDIENTS = [
  '🥬',
  '🍅',
  '🥒',
  '🥖',
  '🫒',
  '🧀',
  '🫙',
  '🧅',
  '🥑',
  '🥗',
];

// Theming configuration
// Toggle whether per-question accent cycling is enabled. If false, a single default accent is used.
export const ACCENT_CYCLING_ENABLED = true;
// Name of the CSS variable to use as the default accent when cycling is disabled
// Must correspond to one of: '--accent-lemon', '--accent-carrot', '--accent-fresh-green', '--accent-tomato'
export const DEFAULT_ACCENT_NAME = '--accent-fresh-green';

// Reset feature (from main)
export const RESET_QUIZ_BUTTON_ID = 'reset-quiz-button';
