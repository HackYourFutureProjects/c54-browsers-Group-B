// src/pages/endPage.js
import { USER_INTERFACE_ID, RESET_QUIZ_BUTTON_ID } from '../constants.js';
import { quizData } from '../data.js';
import { changeBackground } from '../app.js';
import { createPage } from '../utils/createPage.js';
import { initWelcomePage } from './welcomePage.js';

// Map score ranges to GIFs and texts
const getResultData = (score) => {
  if (score === 10)
    return {
      gif: 'public/champ.gif',
      text: "You're basically a mermaid of knowledge!",
    };
  if (score >= 7 && score < 10)
    return {
      gif: 'public/halfchamp.gif',
      text: 'Smart… but not the smartest!',
    };
  if (score >= 5 && score < 7)
    return {
      gif: 'public/fighter.gif',
      text: "Chill… everything's fine in the flames of new information!",
    };
  if (score >= 2 && score < 5)
    return {
      gif: 'public/halfloser.gif',
      text: 'You tried… but the knowledge had other plans!',
    };
  if (score < 2)
    return {
      gif: 'public/loser.gif',
      text: 'Oof… that went completely wrong!',
    };
  console.log('Score out of range:', score);
};

// Show the end page
export const showEndPage = () => {
  changeBackground(999);
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  const totalQuestions = quizData.questions.length;
  const finalScore = quizData.scoreCorrect;
  const resultData = getResultData(finalScore, totalQuestions);

  // HTML block for GIF and text
  const gifBlock = `
  <div class="result-gif-container">
    <img src="${resultData.gif}" alt="Result GIF" class="result-gif" />
    <p class="result-text">${resultData.text}</p>
  </div>
`;

  // Get result data based on score
  const _score = quizData.score();

  const endElement = createPage(
    'end-page',
    `
    ${gifBlock}
    <h1 class="end-title">Quiz Completed!</h1>
    <p class="end-subtitle">Congratulations, ${quizData.userName}!</p>
    <div class="score-badge">Score: ${quizData.scoreCorrect} / ${quizData.questions.length}</div>
    <button id="reset-quiz-button" class="end-reset-btn">Reset Quiz</button>
  `
  );

  userInterface.appendChild(endElement);

  // reset button behavior
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
