// src/pages/endPage.js
import { createPage } from '../utils/createPage.js';
import { changeBackground, resetQuizState, clearState } from '../app.js';
import { USER_INTERFACE_ID, PRIZE_STEPS } from '../constants.js';
import { quizData } from '../data.js';

// Select a result GIF based on final score (use classic thresholds; fallback to ratio)
function getResultGif(score, total) {
  const ratio = score / total;
  if (ratio >= 0.9)
    return { file: 'champ.gif', alt: 'Champion', text: 'Champion! 🏆' };
  if (ratio >= 0.6)
    return { file: 'fighter.gif', alt: 'Fighter', text: 'Fighter! ⭐️' };
  if (ratio >= 0.3)
    return {
      file: 'halfchamp.gif',
      alt: 'Half Champion',
      text: 'Half Champion! 💪',
    };
  return { file: 'loser.gif', alt: 'Try Again', text: 'Try Again! 🥲' };
}

export const showEndPage = () => {
  changeBackground(999);
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  const total = quizData.questions.length;
  const score = quizData.score();
  const { headline, subline } = buildEndCopy(score, total, quizData.userName);
  const prize = getPrize(score, total);

  const prizeHtml = prize
    ? `
      <div class="prize-box" role="status" aria-live="polite">
        <div class="prize-emoji">${prize.emoji}</div>
        <div class="prize-name">${prize.name}</div>
        <p class="prize-desc">${prize.desc}</p>
      </div>
    `
    : `
      <div class="prize-box prize-none">
        <div class="prize-emoji">🥲</div>
        <div class="prize-name">No Prize</div>
        <p class="prize-desc">3+ wrong answers locked the prize vault. Try again!</p>
      </div>
    `;

  const gif = getResultGif(score, total);
  const gifHtml = gif
    ? `
      <div class="result-gif-container">
        <img class="result-gif" src="public/${gif.file}" alt="${gif.alt}" />
        <div class="result-text">${gif.text}</div>
      </div>
    `
    : '';

  const endElement = createPage(
    'end-page',
    `
      <h1 class="end-title">Quiz Completed!</h1>
      <p class="end-subtitle">${headline}</p>
      <div class="score-badge">Score: ${score} / ${total}</div>
      <p class="end-copy">${subline}</p>
      ${prizeHtml}
      ${gifHtml}
      <button id="play-again-button" class="end-reset-btn">Play Again</button>
    `
  );

  userInterface.appendChild(endElement);

  // Reset quiz and go back to welcome
  const playAgainBtn = document.getElementById('play-again-button');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', async () => {
      clearState();
      resetQuizState();
      changeBackground(-1);
      const module = await import('./welcomePage.js');
      module.initWelcomePage();
    });
  }
};

function buildEndCopy(score, total, name) {
  const user = name || 'Champion';

  if (score === total) {
    return {
      headline: `Flawless victory, ${user}!`,
      subline:
        'You answered everything correctly. Are you secretly a quiz AI? 🏆',
    };
  }
  if (score >= total - 1) {
    return {
      headline: `So close to legend status, ${user}!`,
      subline: "One more and we'd rename the quiz after you. ⭐️",
    };
  }
  if (score >= total - 2) {
    return {
      headline: `Strong run, ${user}!`,
      subline: 'Two answers shy of eternal bragging rights.',
    };
  }
  if (score >= Math.ceil(total * 0.6)) {
    return {
      headline: `Solid performance, ${user}!`,
      subline: 'The scoreboard approves. The crowd goes mild. 👏',
    };
  }
  if (score >= Math.ceil(total * 0.3)) {
    return {
      headline: `Nice attempt, ${user}!`,
      subline: 'You showed sparks. Recharge and give it another go.',
    };
  }
  if (score >= 1) {
    return {
      headline: `A spark of genius, ${user}!`,
      subline: 'Every epic starts with one correct click. Keep going. ⚡️',
    };
  }
  return {
    headline: `We saw nothing, ${user}.`,
    subline: 'The scoreboard remains mysterious. Try again!',
  };
}

function getPrize(score, total) {
  const wrongCount = total - score;
  if (wrongCount >= 3) {
    return null; // No prize if 3+ wrong answers
  }

  const prizeIndex = Math.min(score - 1, PRIZE_STEPS.length - 1);
  return prizeIndex >= 0 ? PRIZE_STEPS[prizeIndex] : null;
}
