import { USER_INTERFACE_ID, START_QUIZ_BUTTON_ID } from '../constants.js';
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
// Displays the welcome page in the UI and attaches a click listener to the start button
// When clicked, it starts the quiz and stores the user's name
const startQuiz = () => { 
  const nameInput = document.getElementById('user-name-input');
  quizData.userName = nameInput.value || 'Mysterious Stranger'; // fallback
  initQuestionPage();
};
