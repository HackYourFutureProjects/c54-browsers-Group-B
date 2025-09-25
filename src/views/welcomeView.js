import { START_QUIZ_BUTTON_ID } from '../constants.js';
import { createPage } from '../utils/createPage.js';

/**
 * Create the welcome screen
 * @returns {Element}
 */
export const createWelcomeElement = () => {
  const element = createPage('', String.raw`
    <div class="landing">
      <div class="bg-particles" aria-hidden="true"></div>

      <div class="card">
        <div class="leaves" aria-hidden="true">
          <span class="leaf" style="--dur: 2.8s; font-size: 20px;">🥬</span>
          <span class="leaf" style="--dur: 3.4s; font-size: 24px;">🥬</span>
          <span class="leaf" style="--dur: 2.2s; font-size: 18px;">🥬</span>
        </div>

        <!-- Title -->
        <h1 class="title">
          <span class="t-emoji">🥬</span>
          Welcome to Salad Quiz!
        </h1>
        <p class="subtitle">Test your knowledge while staying fresh 🥗</p>

        <div class="actions">
          <!-- Name input -->
          <input
            type="text"
            id="user-name-input"
            placeholder="Enter your name"
            autocomplete="name"
          />

          <!-- Start button -->
          <button id="${START_QUIZ_BUTTON_ID}">Start Quiz</button>
        </div>
      </div>
    </div>
  `);

  // Parallax entrance and tilt effects for the welcome card
  const card = element.querySelector('.card');
  if (card) {
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        const rx = (dx * maxTilt).toFixed(2) + 'deg';   // rotateY
        const ry = (-dy * maxTilt).toFixed(2) + 'deg';  // rotateX
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

  return element;
};
