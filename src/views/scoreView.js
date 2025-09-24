import { SCORE_COUNTER_VIEW } from '../constants.js';

/**
 * Create the welcome screen
 * @returns {Element}
 */
export const createScoreView = (scoreCorrect, scoreIncorrect) => {
  const element = document.createElement('div');
  element.innerHTML = String.raw`
    <div id="${SCORE_COUNTER_VIEW}">
      Correct: ${scoreCorrect} | Incorrect: ${scoreIncorrect}
    </div>
  `;
  return element;
};
