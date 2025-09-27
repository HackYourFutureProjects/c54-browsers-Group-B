import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  AVOID_QUESTION_BUTTON_ID,
  ELIMINATE_TWO_ANSWERS_BUTTON_ID,
  SCORE_INDICATOR_ID,
  PROGRESS_MARKS_ID,
  SALAD_BOWL_ID,
  PRIZE_POP_ID,
  RESET_QUIZ_BUTTON_ID,
} from '../constants.js';
import { createPage } from '../utils/createPage.js';

// Escape HTML entities to safely render user-provided text
const escapeHTML = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const createQuestionElement = (question, scoreText) => {
  // Gets current score and total from text
  const match = /(\d+)\s*\/\s*(\d+)/.exec(String(scoreText || ''));
  const current = match ? Number(match[1]) : 0; // Current score number
  const total = match ? Number(match[2]) : 0; // Total questions number
  const title = String(question ?? '');

  // Builds the page with question, score, progress, and buttons
  return createPage(
    '',
    String.raw`
    <!-- Header with question title, score, and hint tracker -->
    <div class="quiz-header">
      <h1>${title}</h1>
      <div id="${SCORE_INDICATOR_ID}" class="score-widget" role="status" aria-live="polite">
        <span class="score-label">Score</span>
        <div class="score-values">
          <span class="score-current" data-value="${current}">${current}</span>
          <span class="score-sep">/</span>
          <span class="score-total">${total}</span>
        </div>
      </div>
      <div id="hint-tracker" class="hint-tracker" role="status" aria-live="polite">
        <span class="hint-label">Hints</span>
        <span class="hint-used">0/3</span>
      </div>
    </div>

    <!-- Progress marks (no bar) -->
    <div id="${PROGRESS_MARKS_ID}" class="progress-marks"></div>

    <!-- Shows prize feedback after correct answer -->
    <div id="${PRIZE_POP_ID}" class="prize-pop" aria-live="polite"></div>

    <!-- Shows collected salad items as prizes -->
    <div id="${SALAD_BOWL_ID}" class="salad-bowl" aria-label="Your Salad Bowl" role="status"></div>

    <!-- List for answer options -->
    <ul id="${ANSWERS_LIST_ID}"></ul>

    <!-- Buttons for actions: hint, next, avoid, reset -->
    <div class="actions-row">
      <button id="${ELIMINATE_TWO_ANSWERS_BUTTON_ID}" class="btn-info" type="button">Hint</button>
      <button id="${NEXT_QUESTION_BUTTON_ID}" class="btn-primary" type="button">Next question</button>
      <button id="${AVOID_QUESTION_BUTTON_ID}" class="btn-warning" type="button">Avoid question</button>
      <button id="${RESET_QUIZ_BUTTON_ID}" type="button">Reset Quiz</button>
    </div>
  `
  );
};
