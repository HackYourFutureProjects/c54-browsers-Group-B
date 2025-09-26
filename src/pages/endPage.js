// src/pages/endPage.js
import { USER_INTERFACE_ID, RESET_QUIZ_BUTTON_ID } from '../constants.js';
import { quizData } from '../data.js';
import { changeBackground } from '../app.js';
import { createPage } from '../utils/createPage.js';
import { initWelcomePage } from './welcomePage.js';

// Show the end page
export const showEndPage = () => {
  changeBackground(999);
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  // compute score for logic, but do not render it (UI stays 0/total)
  const _score = quizData.score();

  const endElement = createPage(
    'end-page',
    `
    <h1 class="end-title">Quiz Completed!</h1>
    <p class="end-subtitle">Congratulations, ${quizData.userName}!</p>
    <div class="score-badge">Score: ${quizData.scoreCorrect} / ${quizData.questions.length}</div>
    <button id="reset-quiz-button" class="end-reset-btn">Reset Quiz</button>
  `
  );

  userInterface.appendChild(endElement);

  // UI-only Reset button (no behavior by request)
  const resetBtn = document.getElementById(RESET_QUIZ_BUTTON_ID);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      quizData.scoreCorrect = 0;
      quizData.scoreIncorrect = 0;
      quizData.currentQuestionIndex = 0;
      initWelcomePage();
    });
  }
};
