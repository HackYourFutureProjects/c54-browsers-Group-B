import { quizData } from './data.js';
import { initWelcomePage } from './pages/welcomePage.js';

/**
 * Initialize app
 * - Resets quiz state
 * - Shows welcome page
 */
const loadApp = () => {
  resetQuizState();
  initWelcomePage();
};

/**
 * Reset quiz state
 * - currentQuestionIndex back to 0
 * - clears all selected answers
 */

/**
 * Move to next question
 * - returns true if next question exists
 * - returns false if quiz ended
 */
export const goToNextQuestion = () => {
  if (quizData.currentQuestionIndex < quizData.questions.length - 1) {
    quizData.currentQuestionIndex += 1;
    return true;
  }
  return false;
};

export const resetQuizState = () => {
  quizData.currentQuestionIndex = 0;
  quizData.questions.forEach((q) => (q.selected = null));
  quizData.score = 0;
  console.log('score: ', quizData.score);
  initWelcomePage();
};

/**
 * Calculate current score
 */
export const calculateScore = () => {
  return quizData.questions.reduce((score, q) => {
    if (q.selected === q.correct) return score + 1;
    return score;
  }, 0);
};

// Run app on page load
window.addEventListener('load', loadApp);
