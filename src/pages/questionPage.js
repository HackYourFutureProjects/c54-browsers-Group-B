import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  USER_INTERFACE_ID,
  AVOID_QUESTION_BUTTON_ID,
  ELEMINATE_TWO_ANSWERS_BUTTON_ID,
  RESTART_QUIZ,
} from '../constants.js';
import { createQuestionElement } from '../views/questionView.js';
import { createAnswerElement } from '../views/answerView.js';
import { quizData } from '../data.js';
import { resetQuizState } from '../app.js';

// Step 1: Store selected answer
const storeAnswer = (questionIndex, selectedOption) => {
  quizData.questions[questionIndex].selected = selectedOption;
  console.log(`Question ${questionIndex + 1} selected:`, selectedOption);
};

export const initQuestionPage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

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
      } else {
        clickedLi.style.backgroundColor = 'red';

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

      // disabled
      document.getElementById(AVOID_QUESTION_BUTTON_ID).disabled = true;
      document.getElementById(ELEMINATE_TWO_ANSWERS_BUTTON_ID).disabled = true;
    });

    answersListElement.appendChild(answerElement);
  }

  document
    .getElementById(ELEMINATE_TWO_ANSWERS_BUTTON_ID)
    .addEventListener('click', () => {
      const allListItems = Array.from(
        answersListElement.querySelectorAll('li')
      );
      hint(currentQuestion, allListItems);
      document.getElementById(ELEMINATE_TWO_ANSWERS_BUTTON_ID).disabled = true;
    });

  document
    .getElementById(NEXT_QUESTION_BUTTON_ID)
    .addEventListener('click', nextQuestion);

  document
    .getElementById(AVOID_QUESTION_BUTTON_ID)
    .addEventListener('click', avoidQuestion);

  document
    .getElementById(RESTART_QUIZ)
    .addEventListener('click', resetQuizState);
};

const nextQuestion = () => {
  quizData.currentQuestionIndex += 1;
  initQuestionPage();
};

const avoidQuestion = () => {
  // go to the next question
  quizData.currentQuestionIndex = quizData.currentQuestionIndex + 1;
  console.log('Question avoided');

  initQuestionPage(); // display the new question
};

const hint = (currentQuestion, allListItems) => {
  const wrongItems = allListItems.filter((li) => {
    return li.dataset.key !== currentQuestion.correct;
  }); //get all the wrong options
  const elements = new Set();

  while (elements.size < 2) {
    const randomIndex = Math.floor(Math.random() * wrongItems.length);
    elements.add(wrongItems[randomIndex]);
  }

  elements.forEach((ele) => (ele.hidden = true));
};
