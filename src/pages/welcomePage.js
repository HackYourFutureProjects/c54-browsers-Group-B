import {
  USER_INTERFACE_ID,
  START_QUIZ_BUTTON_ID,
  STORAGE_KEY,
} from '../constants.js';
import { createWelcomeElement } from '../views/welcomeView.js';
import { initQuestionPage } from './questionPage.js';
import { quizData } from '../data.js';

/**
 * Renders the welcome/start screen
 * - Appends the welcome element to the user interface
 * - Binds start button to startQuiz()
 */
export const initWelcomePage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';
  userInterface.classList.add('welcome-mode');

  const welcomeElement = createWelcomeElement();
  userInterface.appendChild(welcomeElement);

  // Re-attach hero card tilt/entrance (moved from view to page to keep views pure)
  const card = welcomeElement.querySelector('.card');
  if (card) {
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth entrance
    requestAnimationFrame(() => card.classList.add('enter'));

    if (!reduce) {
      const maxTilt = 6; // degrees
      const onMove = (ev) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (ev.clientX - cx) / (rect.width / 2);
        const dy = (ev.clientY - cy) / (rect.height / 2);
        // map -1..1 to degrees
        const rx = (dx * maxTilt).toFixed(2) + 'deg'; // rotateY
        const ry = (-dy * maxTilt).toFixed(2) + 'deg'; // rotateX
        card.style.setProperty('--rx', rx);
        card.style.setProperty('--ry', ry);

        // for radial highlight overlay
        const mx = ((ev.clientX - rect.left) / rect.width) * 100;
        const my = ((ev.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', mx.toFixed(2) + '%');
        card.style.setProperty('--my', my.toFixed(2) + '%');
      };

      const onLeave = () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '0%');
      };

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    }
  }

  document
    .getElementById(START_QUIZ_BUTTON_ID)
    .addEventListener('click', startQuiz);

  // Rules modal interactions
  const rulesBtn = document.getElementById('rules-button');
  if (rulesBtn) {
    rulesBtn.addEventListener('click', () => {
      const modal = document.getElementById('rules-modal');
      if (modal) modal.classList.add('show');
    });
  }

  const closeBtn = document.getElementById('close-rules');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const modal = document.getElementById('rules-modal');
      if (modal) modal.classList.remove('show');
    });
  }

  const modal = document.getElementById('rules-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
      }
    });
  }
};

/**
 * Start the quiz
 * - Moves to the first question page
 */
// Displays the welcome page in the UI and attaches a click listener to the start button
// When clicked, it starts the quiz and stores the user's name
const startQuiz = () => {
  const nameInput = document.getElementById('user-name-input');
  quizData.userName = nameInput.value;

  initQuestionPage();
};
