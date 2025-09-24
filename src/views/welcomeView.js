import { START_QUIZ_BUTTON_ID } from '../constants.js';

/**
 * Create the welcome screen
 * @returns {Element}
 */
export const createWelcomeElement = () => {
  const element = document.createElement('div');
  element.innerHTML = String.raw`
    <h1>Welcome</h1>
    
    <input type="text" id="user-name-input" placeholder="Enter your name" />
    <button id="${START_QUIZ_BUTTON_ID}">start quiz</button>
  `;
  return element;
};
