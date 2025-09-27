import { createPage } from '../utils/createPage.js';
import { START_QUIZ_BUTTON_ID } from '../constants.js';

/**
 * Create the welcome screen
 * @returns {Element}
 */
export const createWelcomeElement = () => {
  const element = createPage(
    '',
    String.raw`
    <div class="landing">
      <div class="bg-particles" aria-hidden="true"></div>

      <div class="card">
        <div class="leaves" aria-hidden="true">
        <span class="leaf" style="--dur: 2.2s; font-size: 20px;">🥦</span>
        <span class="leaf" style="--dur: 2.2s; font-size: 25px;">🥕</span>
          <span class="leaf" style="--dur: 2.8s; font-size: 45px;">🥬</span>
          <span class="leaf" style="--dur: 3.4s; font-size: 60px;">🥗</span>
          <span class="leaf" style="--dur: 2.2s; font-size: 20px;">🍅</span>
          <span class="leaf" style="--dur: 2.2s; font-size: 25px;">🥒</span>
          <span class="leaf" style="--dur: 2.2s; font-size: 30px;">🥔</span>
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

          <!-- Rules button -->
          <button id="rules-button" class="btn-secondary">Rules</button>
        </div>

        <!-- Rules Modal -->
        <div id="rules-modal" class="modal">
          <div class="modal-content">
            <button id="close-rules" class="modal-close">&times;</button>
            <h2>Game Rules</h2>
            <ul class="rules-list">
              <li>10 multiple-choice questions on various topics.</li>
              <li>Hint (3x): Eliminates 2 wrong answers.</li>
              <li>Avoid: Skips but reveals correct briefly.</li>
              <li>Score correct answers for salad prizes.</li>
              <li>Restart anytime via end page.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
  );

  // interactions moved to page: see initWelcomePage()

  return element;
};
