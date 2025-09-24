// src/pages/endPage.js
import { USER_INTERFACE_ID } from '../constants.js';
import { quizData } from '../data.js';
import { initWelcomePage } from './welcomePage.js';

// Create the end page element
const createEndElement = (userName, score, totalQuestions) => {
  const element = document.createElement('div');
  element.classList.add('end-page');

  element.innerHTML = `
    <h1>Quiz Completed!</h1>
    <p>Congratulations, ${userName}!</p>
    <p>Your score: ${score} / ${totalQuestions}</p>
    <button id="restart-quiz-button">Restart Quiz</button>
  `;

  return element;
};

// Show the end page
export const showEndPage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  const endElement = createEndElement(
    quizData.userName,
    quizData.score(),
    quizData.questions.length
  );

  userInterface.appendChild(endElement);

  // Restart quiz button
  const restartButton = document.getElementById('restart-quiz-button');
  restartButton.addEventListener('click', () => {
    quizData.currentQuestionIndex = 0;
    quizData.answers = [];
    quizData.questions.forEach(q => (q.selected = null));
    initWelcomePage();
  });
};
