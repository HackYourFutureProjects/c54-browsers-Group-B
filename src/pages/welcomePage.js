import { USER_INTERFACE_ID, START_QUIZ_BUTTON_ID } from '../constants.js';
import { createWelcomeElement } from '../views/welcomeView.js';
import { initQuestionPage } from './questionPage.js';

/**
 * Renders the welcome/start screen
 * - Appends the welcome element to the user interface
 * - Binds start button to startQuiz()
 */
export const initWelcomePage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  const welcomeElement = createWelcomeElement();
  userInterface.appendChild(welcomeElement);

  document
    .getElementById(START_QUIZ_BUTTON_ID)
    .addEventListener('click', startQuiz);
};

/**
 * Start the quiz
 * - Moves to the first question page
 */
const startQuiz = () => {
  initQuestionPage();
};
