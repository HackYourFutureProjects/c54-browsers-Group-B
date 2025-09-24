export let scoreCorrect = 0;          // number of correct answers
export let scoreIncorrect = 0;        // number of incorrect answers
export const maxQuestions = 10;       // maximum number of questions in the quiz

export const incrementCorrect = () => { scoreCorrect++; };
export const incrementIncorrect = () => { scoreIncorrect++; };

//reset scores to zero
export const resetScores = () => { scoreCorrect = 0; scoreIncorrect = 0; };

// set scores to specific values
export const setScores = (correct, incorrect) => {
  scoreCorrect = correct;
  scoreIncorrect = incorrect;
};

export const renderScore = () => {
  const container = document.getElementById('score-counter');
  container.innerHTML = `Correct: ${scoreCorrect} | Incorrect: ${scoreIncorrect}`;
};
