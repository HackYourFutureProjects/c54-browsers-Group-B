import { quizData } from '../data.js';

export const incrementCorrect = () => { quizData.scoreCorrect++; };
export const incrementIncorrect = () => { quizData.scoreIncorrect++; };

//reset scores to zero
export const resetScores = () => { quizData.scoreCorrect = 0; quizData.scoreIncorrect = 0; };

// set scores to specific values
export const setScores = (correct, incorrect) => {
  quizData.scoreCorrect = correct;
  quizData.scoreIncorrect = incorrect;
};

export const renderScore = () => {
  const container = document.getElementById('score-counter');
  container.innerHTML = `Correct: ${quizData.scoreCorrect} | Incorrect: ${quizData.scoreIncorrect}`;
};