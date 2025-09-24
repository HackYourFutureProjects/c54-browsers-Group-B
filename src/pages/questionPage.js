import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  USER_INTERFACE_ID,
  AVOID_QUESTION_BUTTON_ID,
} from '../constants.js';
import { createQuestionElement } from '../views/questionView.js';
import { createAnswerElement } from '../views/answerView.js';
import { quizData } from '../data.js';
import {
  resetScores,
  incrementCorrect,
  incrementIncorrect,
  maxQuestions,
} from './score.js';

// Step 1: Store selected answer
const storeAnswer = (questionIndex, selectedOption) => {
  quizData.questions[questionIndex].selected = selectedOption;
  console.log(`Question ${questionIndex + 1} selected:`, selectedOption);
};

export const initQuestionPage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  //container for scores
  let scoreContainer = document.getElementById('score-counter');
  if (!scoreContainer) {
    scoreContainer = document.createElement('div');
    scoreContainer.id = 'score-counter';
    userInterface.appendChild(scoreContainer);
  }

  const renderScore = () => {
    scoreContainer.innerHTML = `Correct: ${quizData.scoreCorrect} | Incorrect: ${quizData.scoreIncorrect}`;
  };

  //show scores
  renderScore();

  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];

  const questionElement = createQuestionElement(currentQuestion.text);
  userInterface.appendChild(questionElement);

  const answersListElement = document.getElementById(ANSWERS_LIST_ID);

  // Render each answer
  for (const [key, answerText] of Object.entries(currentQuestion.answers)) {
    const answerElement = createAnswerElement(key, answerText);

    // tag each <li> with its answer key
    answerElement.dataset.key = key;

    // Store answer when clicked
    answerElement.addEventListener('click', (event) => {
      const clickedLi = event.currentTarget;
      const selectedKey = clickedLi.dataset.key;

      // store selection
      storeAnswer(quizData.currentQuestionIndex, key);

      // get all <li> within this answers list only
      const allListItems = answersListElement.querySelectorAll('li');

      // reset any previous coloring
      allListItems.forEach((li) => {
        li.style.backgroundColor = '';
      });

      // check if user clicked the correct answer
      const isCorrect = selectedKey === currentQuestion.correct;

      if (isCorrect) {
        clickedLi.style.backgroundColor = 'green';
        incrementCorrect(); // update correct score
        renderScore(); // show updated scores
      } else {
        clickedLi.style.backgroundColor = 'red';
        incrementIncorrect(); // update incorrect score
        renderScore(); // show updated scores

        //highlight the correct answer
        allListItems.forEach((li) => {
          if (li.dataset.key === currentQuestion.correct) {
            li.style.backgroundColor = 'green';
          }
        });
      }
      allListItems.forEach((li) => {
        li.style.pointerEvents = 'none';
      });
    });

    answersListElement.appendChild(answerElement);
  }

  document
    .getElementById(NEXT_QUESTION_BUTTON_ID)
    .addEventListener('click', nextQuestion);

  document
    .getElementById(AVOID_QUESTION_BUTTON_ID)
    .addEventListener('click', avoidQuestion);
};

const nextQuestion = () => {
  // update the state
  quizData.currentQuestionIndex += 1;

  // rerender the UI with the state
  initQuestionPage();
};

const avoidQuestion = () => {
  // go to the next question
  quizData.currentQuestionIndex = quizData.currentQuestionIndex + 1;
  console.log('Question avoided');
  incrementIncorrect(); // count as incorrect
  initQuestionPage(); // display the new question
};
