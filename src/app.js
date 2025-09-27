import { quizData } from './data.js';
import { initWelcomePage } from './pages/welcomePage.js';
import {
  USER_INTERFACE_ID,
  START_QUIZ_BUTTON_ID,
  NEXT_QUESTION_BUTTON_ID,
  AVOID_QUESTION_BUTTON_ID,
  STORAGE_KEY,
  ACCENT_CYCLING_ENABLED,
  DEFAULT_ACCENT_NAME,
} from './constants.js';

/**
 * Initialize app
 * - Resets quiz state
 * - Shows welcome page
 */
const loadApp = () => {
  setupUIEnhancements();
  try {
    setEmojiFavicon('🥗');
  } catch {}

  // Try to hydrate saved progress; if available resume where the user left off
  const hydrated = hydrateFromStorage();

  if (hydrated) {
    const idx = quizData.currentQuestionIndex;
    if (idx >= quizData.questions.length) {
      changeBackground(999);
      import('./pages/endPage.js').then((m) => m.showEndPage());
    } else {
      changeBackground(Math.max(0, idx));
      import('./pages/questionPage.js').then((m) => m.initQuestionPage());
    }
    return;
  }

  // No saved state -> fresh start
  resetQuizState();
  changeBackground(-1);
  initWelcomePage();
};

/**
 * Reset quiz state
 * - currentQuestionIndex back to 0
 * - clears all selected answers
 */
export const resetQuizState = () => {
  quizData.currentQuestionIndex = 0;
  quizData.questions.forEach((q) => {
    q.selected = null;
    q.usedHint = false;
    q.avoided = false;
  });
  quizData.hintsLeft = 3;
  try {
    console.log('score:', quizData.score());
  } catch {
    /* ignore */
  }
};

/**
 * Move to next question
 * - returns true if next question exists
 * - returns false if quiz ended
 */
export const goToNextQuestion = () => {
  if (quizData.currentQuestionIndex < quizData.questions.length - 1) {
    quizData.currentQuestionIndex += 1;
    return true;
  }
  return false;
};

/**
 * Persistence helpers
 * - saveState(): persist minimal quiz state to localStorage
 * - loadState(): read persisted state or return null
 * - clearState(): remove persisted data
 * - hydrateFromStorage(): apply persisted data into quizData, return true if applied
 */
export function saveState() {
  try {
    const payload = {
      userName: quizData.userName || '',
      currentQuestionIndex: quizData.currentQuestionIndex,
      hintsLeft:
        typeof quizData.hintsLeft === 'number' ? quizData.hintsLeft : 3,
      selectedMap: Object.fromEntries(
        quizData.questions.map((q) => [q.id, q.selected ?? null])
      ),
      usedHintMap: Object.fromEntries(
        quizData.questions.map((q) => [q.id, !!q.usedHint])
      ),
      avoidedMap: Object.fromEntries(
        quizData.questions.map((q) => [q.id, !!q.avoided])
      ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('saveState failed:', e);
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hydrateFromStorage() {
  const state = loadState();
  if (!state) return false;

  quizData.userName = state.userName;
  quizData.hintsLeft = state.hintsLeft;
  quizData.currentQuestionIndex = state.currentQuestionIndex;

  for (const q of quizData.questions) {
    if (state.selectedMap) {
      q.selected = state.selectedMap[q.id];
    }
    if (state.usedHintMap) {
      q.usedHint = state.usedHintMap[q.id];
    }
    if (state.avoidedMap) {
      q.avoided = state.avoidedMap[q.id];
    }
  }

  return true;
}

/**
 * UI Enhancement helpers (styling & transitions only)
 * - fadeTransition(oldElement, newElement): apply entrance/exit animations
 * - changeBackground(index): dynamic gradient per step
 * - setupUIEnhancements(): sets up mutation observer + ripple + answer badges
 * These DO NOT change quiz logic.
 */

/**
 * Smoothly transition between elements (non-breaking)
 * If oldElement is still in DOM, animate it out, then animate in the new one.
 */
export function fadeTransition(oldElement, newElement) {
  if (oldElement && oldElement.parentElement) {
    oldElement.classList.add('fade-out');
    oldElement.addEventListener(
      'animationend',
      () => {
        oldElement.remove();
        if (newElement) {
          newElement.classList.add('fade-in');
          newElement.addEventListener(
            'animationend',
            () => {
              newElement.classList.remove('fade-in');
            },
            { once: true }
          );
        }
      },
      { once: true }
    );
  } else if (newElement) {
    newElement.classList.add('fade-in');
    newElement.addEventListener(
      'animationend',
      () => {
        newElement.classList.remove('fade-in');
      },
      { once: true }
    );
  }
}

/**
 * Change dynamic background gradient based on question index or screen
 * index === -1 => welcome
 * index === 999 => end page
 * else => question index-based gradient
 */
export function changeBackground(index) {
  const gradients = [
    'linear-gradient(135deg, #2e7d32 0%, #43a047 50%, #66bb6a 100%)',
    'linear-gradient(135deg, #1b5e20 0%, #2e7d32 55%, #66bb6a 100%)',
    'linear-gradient(135deg, #2e7d32 0%, #66bb6a 60%, #a5d6a7 100%)',
    'linear-gradient(135deg, #388e3c 0%, #66bb6a 55%, #ffeb3b 100%)',
    'linear-gradient(135deg, #004d40 0%, #2e7d32 55%, #43a047 100%)',
    'linear-gradient(135deg, #276749 0%, #2e7d32 50%, #66bb6a 100%)',
  ];
  let gradient;
  if (index === -1) {
    gradient = 'linear-gradient(135deg, #2e7d32 0%, #43a047 60%, #66bb6a 100%)';
  } else if (index === 999) {
    gradient = 'linear-gradient(135deg, #66bb6a 0%, #a5d6a7 60%, #ffeb3b 100%)';
  } else {
    gradient = gradients[Math.abs(index) % gradients.length];
  }
  document.documentElement.style.setProperty('--bg-gradient', gradient);

  // Toggle high-contrast text when the background is very light
  const isLightSurface =
    index === 999 ||
    (typeof index === 'number' && Math.abs(index) % gradients.length === 3);
  document.body.classList.toggle('light-surface', !!isLightSurface);

  // Also set a sensible accent for non-question screens so glow effects feel cohesive
  try {
    const root = document.documentElement;
    const get = (name, fallback) =>
      getComputedStyle(root).getPropertyValue(name).trim() || fallback;
    const accents = [
      get('--accent-lemon', '#FFD93D'),
      get('--accent-carrot', '#FFA62B'),
      get('--accent-fresh-green', '#6BCB77'),
      get('--accent-tomato', '#FF6B6B'),
    ];
    if (index === -1) {
      // welcome: fresh, inviting
      root.style.setProperty('--answer-hover-accent', accents[2]);
    } else if (index === 999) {
      // end: celebratory
      root.style.setProperty('--answer-hover-accent', accents[0]);
    } else if (typeof index === 'number') {
      const accent = accents[Math.abs(index) % accents.length];
      root.style.setProperty('--answer-hover-accent', accent);
    }
  } catch {}
}

/**
 * Attach a soft ripple micro-interaction to buttons and answer items
 */
function attachRipple() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, li');
    if (!target) return;
    if (!document.body.contains(target)) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), {
      once: true,
    });

    // If this is an answer LI inside the answers list, set a visual badge
    const list = target.closest('ul');
    if (target.tagName === 'LI' && list && list.id === 'answers-list') {
      const key = target.dataset.key;
      const current = quizData.questions[quizData.currentQuestionIndex];
      if (!current || !key) return;
      if (key === current.correct) {
        target.setAttribute('data-badge', '✓');
      } else {
        target.setAttribute('data-badge', '✕');
        // Also mark correct one with a badge
        list.querySelectorAll('li').forEach((li) => {
          if (li.dataset.key === current.correct) {
            li.setAttribute('data-badge', '✓');
          }
        });
      }
    }
  });
}

/**
 * Observe UI container for page swaps.
 * Adds entrance animation and updates background gradient on each screen.
 */
function observeUI() {
  const ui = document.getElementById(USER_INTERFACE_ID);
  if (!ui) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        // Animate in new content
        node.classList.add('fade-in');
        node.addEventListener(
          'animationend',
          () => node.classList.remove('fade-in'),
          { once: true }
        );

        // Choose gradient by screen type
        if (
          node.querySelector &&
          node.querySelector(`#${START_QUIZ_BUTTON_ID}`)
        ) {
          // Welcome
          changeBackground(-1);
          try {
            setEmojiFavicon('🥗');
          } catch {}
        } else if (
          node.querySelector &&
          node.querySelector(`#${NEXT_QUESTION_BUTTON_ID}`)
        ) {
          // Question
          changeBackground(quizData.currentQuestionIndex);
          try {
            setEmojiFavicon('🥬');
          } catch {}
        }
      });
    }
  });

  observer.observe(ui, { childList: true });
}

/**
 * Public setup that initializes micro-interactions and observers.
 */
function setupUIEnhancements() {
  attachRipple();
  observeUI();
}

// Question page theming: rotate through salad colors and manage contrast
export function setQuestionTheme(index) {
  const gradients = [
    'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)', // deep salad green
    'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)', // fresh green
    'linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%)', // minty
    'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)', // pale mint
    'linear-gradient(135deg, #FFEB3B 0%, #FFFDE7 100%)', // lemon (light)
    'linear-gradient(135deg, #8BC34A 0%, #4CAF50 100%)', // lime
    'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)', // dark herb
  ];
  const chosen = gradients[Math.abs(index) % gradients.length];

  // apply to body and mark that we're on question surface
  document.body.classList.add('question-surface');
  document.body.style.background = chosen;
  document.body.style.backgroundAttachment = 'fixed';

  // mark light surface only when using very bright lemon/white-ish background
  const isLight =
    chosen.includes('#FFEB3B') ||
    chosen.includes('#FFFDE7') ||
    chosen.includes('#FFFFFF');
  document.body.classList.toggle('question-light', !!isLight);

  // Cycle answer hover accent per question for playful variety
  try {
    const root = document.documentElement;
    const get = (name, fallback) =>
      getComputedStyle(root).getPropertyValue(name).trim() || fallback;
    const accents = [
      get('--accent-lemon', '#FFD93D'),
      get('--accent-carrot', '#FFA62B'),
      get('--accent-fresh-green', '#6BCB77'),
      get('--accent-tomato', '#FF6B6B'),
    ];
    const accent = accents[Math.abs(index) % accents.length];
    root.style.setProperty('--answer-hover-accent', accent);

    // Rotate progress gradient colors per question for subtle variety
    const r0 = Math.abs(index) % accents.length;
    const seq = [
      accents[r0],
      accents[(r0 + 1) % accents.length],
      accents[(r0 + 2) % accents.length],
      accents[(r0 + 3) % accents.length],
    ];
    root.style.setProperty('--progress-c1', seq[0]);
    root.style.setProperty('--progress-c2', seq[1]);
    root.style.setProperty('--progress-c3', seq[2]);
    root.style.setProperty('--progress-c4', seq[3]);
  } catch {}
}

/**
 * Reset question page theming (used when navigating away from questions)
 */
export function resetQuestionTheme() {
  document.body.classList.remove('question-surface', 'question-light');
  // do not clobber landing/end backgrounds; just clear inline we set
  document.body.style.background = '';
  document.body.style.backgroundAttachment = '';
}

// Generate a favicon from an emoji and set it as the page icon
export function setEmojiFavicon(_) {
  try {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    // Always use the provided static favicon file
    link.href = './public/favicon.ico';
  } catch {}
}

// Run app on page load
window.addEventListener('load', loadApp);
