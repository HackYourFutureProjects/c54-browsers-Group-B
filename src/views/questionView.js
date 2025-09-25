import { ANSWERS_LIST_ID } from '../constants.js';
import {
  NEXT_QUESTION_BUTTON_ID,
  AVOID_QUESTION_BUTTON_ID,
} from '../constants.js';
import { createPage } from '../utils/createPage.js';

/**
 * Create a full question element
 * @returns {Element}
 */
export const createQuestionElement = (question) => {
  return createPage('', String.raw`
    <h1>${question}</h1>

    <ul id="${ANSWERS_LIST_ID}"></ul>

    <button id="${NEXT_QUESTION_BUTTON_ID}">Next question</button>
    <button id="${AVOID_QUESTION_BUTTON_ID}">Avoid question</button>
  `);
};
