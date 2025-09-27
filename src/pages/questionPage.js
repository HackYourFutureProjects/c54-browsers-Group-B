import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  USER_INTERFACE_ID,
  AVOID_QUESTION_BUTTON_ID,
  ELIMINATE_TWO_ANSWERS_BUTTON_ID,
  SCORE_INDICATOR_ID,
  PROGRESS_BAR_ID,
  PROGRESS_FILL_ID,
  PROGRESS_MARKS_ID,
  SALAD_BOWL_ID,
  PRIZE_POP_ID,
  PRIZE_STEPS,
  SALAD_BOWL_INGREDIENTS,
} from '../constants.js';
import { createQuestionElement } from '../views/questionView.js';
import { createAnswerElement } from '../views/answerView.js';
import { quizData } from '../data.js';
import {
  setQuestionTheme,
  resetQuestionTheme,
  saveState,
  fadeTransition,
  clearState,
  resetQuizState,
  changeBackground,
} from '../app.js';

// Makes the number change smoothly from old value to new value
function animateNumber(el, from, to, duration = 450, formatter) {
  const start = performance.now(); // Start time for animation
  const clamp = (v) => (to >= from ? Math.min(v, to) : Math.max(v, to)); // Keeps value between from and to
  const f =
    typeof formatter === 'function' ? formatter : (v) => String(Math.round(v)); // Formats the number
  function frame(now) {
    // Runs each frame to update number
    const t = Math.min(1, (now - start) / duration); // Progress from 0 to 1
    const eased = 1 - Math.pow(1 - t, 3); // Smooth easing for animation
    const value = clamp(from + (to - from) * eased); // Current value during animation
    el.textContent = f(value); // Shows the value
    el.dataset.value = String(to); // Stores final value
    if (t < 1) requestAnimationFrame(frame); // Continues animation if not done
  }
  requestAnimationFrame(frame); // Starts the animation
}

// Money-based prize removed (no currency display)

// Money-based earnings removed

// Counts how many questions user answered
function countAnswered() {
  return quizData.questions.reduce((n, q) => n + (q.selected ? 1 : 0), 0); // Adds 1 for each selected answer
}

// Counts how many wrong answers user has
function countWrong() {
  return Math.max(0, countAnswered() - quizData.score()); // Wrong = answered minus correct score
}

// Updates the progress bar to show how many questions done
function updateProgressBar() {
  const fill = document.getElementById(PROGRESS_FILL_ID); // Gets the progress fill element
  if (!fill) return; // Stops if no element
  const total = quizData.questions.length || 0; // Total questions
  const answered = countAnswered(); // How many answered
  const pct = total ? Math.round((answered / total) * 100) : 0; // Percentage done
  fill.style.width = pct + '%'; // Sets bar width
  fill.setAttribute('aria-valuenow', String(pct)); // Accessibility update
  // Updates prize marks too
  try {
    updateProgressMarks();
  } catch {}
}

// Updates the salad bowl to show prizes from correct answers
function updateSaladBowl() {
  const bowl = document.getElementById(SALAD_BOWL_ID); // Gets the bowl element
  if (!bowl) return; // Stops if no element
  const correct = quizData.score(); // Number of correct answers
  const items = SALAD_BOWL_INGREDIENTS.slice(0, correct) // Takes items up to correct count
    .map(
      (emoji, i) => `<span class="ingredient" style="--i:${i}">${emoji}</span>`
    ) // Makes HTML for each
    .join(''); // Joins them
  bowl.innerHTML = items; // Shows in bowl
}

// Builds marks on progress bar for each prize step
function buildProgressMarks() {
  const cont = document.getElementById(PROGRESS_MARKS_ID);
  if (!cont) return;
  const total = quizData.questions.length || 0;
  cont.innerHTML = '';
  if (total <= 0) return;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'ball';
    const left = total <= 1 ? 0 : (i / (total - 1)) * 100;
    dot.style.left = left + '%';
    dot.dataset.index = String(i);
    cont.appendChild(dot);
  }
  updateProgressMarks();
}

// Updates which marks are done or current
function updateProgressMarks() {
  const cont = document.getElementById(PROGRESS_MARKS_ID);
  if (!cont) return;
  const dots = cont.querySelectorAll('.ball');
  const total = quizData.questions.length || 0;

  const STATES = [
    'state-unanswered',
    'state-correct',
    'state-wrong',
    'state-hinted-only',
    'state-hinted-correct',
    'state-hinted-wrong',
    'state-avoided',
  ];

  dots.forEach((dot, idx) => {
    if (idx >= total) return;
    const q = quizData.questions[idx];

    // Determine state
    let cls = 'state-unanswered';
    let title = 'Unanswered';

    if (q) {
      if (q.avoided) {
        cls = 'state-avoided';
        title = 'Avoided';
      } else if (q.selected == null) {
        if (q.usedHint) {
          cls = 'state-hinted-only';
          title = 'Hint used';
        } else {
          cls = 'state-unanswered';
          title = 'Unanswered';
        }
      } else {
        const isCorrect = q.selected === q.correct;
        if (q.usedHint && isCorrect) {
          cls = 'state-hinted-correct';
          title = 'Hint + Correct';
        } else if (q.usedHint && !isCorrect) {
          cls = 'state-hinted-wrong';
          title = 'Hint + Wrong';
        } else if (!q.usedHint && isCorrect) {
          cls = 'state-correct';
          title = 'Correct';
        } else {
          cls = 'state-wrong';
          title = 'Wrong';
        }
      }
    }

    // Reset and apply classes
    STATES.forEach((s) => dot.classList.remove(s));
    dot.classList.add(cls);
    dot.title = title;
  });
}

// Adds floating salad items in background for each question
function ensureFloatingIngredients() {
  const ui = document.getElementById(USER_INTERFACE_ID); // Gets main UI
  if (!ui) return; // Stops if no UI
  if (ui.querySelector('.float-ingredients')) return; // Stops if already added
  const cont = document.createElement('div'); // New container for floats
  cont.className = 'float-ingredients'; // Adds class
  const emojis = ['🥬', '🍅', '🥖', '🥒', '🫒']; // List of salad emojis
  for (let i = 0; i < 10; i++) {
    // Makes 10 floating items
    const span = document.createElement('span'); // New item
    span.className = 'icon'; // Adds class
    span.textContent = emojis[i % emojis.length]; // Random emoji
    const top = (10 + Math.random() * 80).toFixed(2) + '%'; // Random top position
    const left = (5 + Math.random() * 90).toFixed(2) + '%'; // Random left position
    const dur = (2.4 + Math.random() * 2.2).toFixed(2) + 's'; // Random duration
    const delay = (Math.random() * 1.2).toFixed(2) + 's'; // Random delay
    const x1 = (Math.random() * 16 - 8).toFixed(0) + 'px'; // X move 1
    const y1 = (Math.random() * 12 - 6).toFixed(0) + 'px'; // Y move 1
    const x2 = (Math.random() * 16 - 8).toFixed(0) + 'px'; // X move 2
    const y2 = (Math.random() * 12 - 6).toFixed(0) + 'px'; // Y move 2
    span.style.setProperty('--dur', dur); // Sets duration
    span.style.setProperty('--delay', delay); // Sets delay
    span.style.setProperty('--x1', x1); // Sets X1
    span.style.setProperty('--y1', y1); // Sets Y1
    span.style.setProperty('--x2', x2); // Sets X2
    span.style.setProperty('--y2', y2); // Sets Y2
    span.style.setProperty('--r0', (Math.random() * 6 - 3).toFixed(1) + 'deg'); // Rotation 0
    span.style.setProperty('--r1', (Math.random() * 10 - 5).toFixed(1) + 'deg'); // Rotation 1
    span.style.setProperty('--r2', (Math.random() * 10 - 5).toFixed(1) + 'deg'); // Rotation 2
    span.style.setProperty('--s0', (0.9 + Math.random() * 0.2).toFixed(2)); // Scale 0
    span.style.setProperty('--s1', (0.94 + Math.random() * 0.18).toFixed(2)); // Scale 1
    span.style.setProperty('--s2', (0.9 + Math.random() * 0.2).toFixed(2)); // Scale 2
    span.style.setProperty('--top', top); // Sets top
    span.style.setProperty('--left', left); // Sets left
    cont.appendChild(span); // Adds item
  }
  // Puts behind card content
  ui.prepend(cont);
}

// Adds confetti when correct answer
function addConfetti() {
  const container = document.getElementById(PRIZE_POP_ID) || document.body; // Where to put confetti
  const conf = document.createElement('div'); // Confetti container
  conf.className = 'confetti'; // Adds class
  const pieces = 24; // Number of pieces
  for (let i = 0; i < pieces; i++) {
    // Makes each piece
    const p = document.createElement('i'); // New piece
    p.className = 'confetti-piece'; // Adds class
    const left = Math.random() * 100; // Random start position
    const delay = Math.random() * 0.3; // Random delay
    const dur = 0.9 + Math.random() * 0.6; // Random duration
    const hue = 40 + Math.random() * 80; // Random color
    p.style.left = left.toFixed(2) + '%'; // Sets position
    p.style.animationDelay = delay.toFixed(2) + 's'; // Sets delay
    p.style.animationDuration = dur.toFixed(2) + 's'; // Sets duration
    p.style.filter = `hue-rotate(${hue.toFixed(0)}deg)`; // Sets color
    conf.appendChild(p); // Adds piece
  }
  container.appendChild(conf); // Adds confetti
  setTimeout(() => conf.remove(), 1600); // Removes after 1.6 seconds
}

// Shows prize pop message for correct or wrong answer
function showPrizePop(isCorrect) {
  const host = document.getElementById(PRIZE_POP_ID); // Gets prize area
  if (!host) return; // Stops if no area
  if (!isCorrect) {
    // If wrong answer
    // If 3 or more wrong, show lock message
    if (countWrong() >= 3) {
      const who = quizData.userName || 'Player'; // User name or default
      host.innerHTML = `
        <div class="prize-pop-card fail">
          <div class="prize-emoji">🥲</div>
          <div class="prize-title">Prize Vault Locked</div>
          <p class="prize-msg">Oh no, ${who}! 3+ wrong answers means no more prizes this run.</p>
        </div>`; // Fail message HTML
      host.classList.add('prize-pop--show'); // Shows it
      setTimeout(() => host.classList.remove('prize-pop--show'), 1400); // Hides after 1.4s
    } else {
      host.innerHTML = ''; // Clears if less than 3 wrong
    }
    return;
  }

  const correctCount = quizData.score(); // How many correct
  const idx = Math.max(0, Math.min(correctCount - 1, PRIZE_STEPS.length - 1)); // Prize index
  const step = PRIZE_STEPS[idx] || { name: 'Salad Surprise', emoji: '🥗' }; // Prize info
  const who = quizData.userName || 'Player'; // User name
  host.innerHTML = `
    <div class="prize-pop-card correct">
      <div class="prize-emoji">${step.emoji}</div>
      <div class="prize-title">${step.name}</div>
      <p class="prize-msg">Wow ${who}, you tossed that salad perfectly! 🥗 You got ${correctCount} correct.</p>
    </div>`; // Success message HTML
  host.classList.add('prize-pop--show'); // Shows it
  addConfetti(); // Adds confetti
  setTimeout(() => host.classList.remove('prize-pop--show'), 1400); // Hides after 1.4s
}

// Ladder UI removed: we now use creative emoji progress marks along the bar

// refreshPrizePanel removed (no ladder)

// Updates score display with smooth animation
const updateScoreIndicator = (prevScore) => {
  const el = document.getElementById(SCORE_INDICATOR_ID); // Gets score element
  if (!el) return; // Stops if no element
  const total = quizData.questions.length; // Total questions
  const current = quizData.score(); // Current score

  const currentEl = el.querySelector('.score-current'); // Current score part
  const totalEl = el.querySelector('.score-total'); // Total part
  if (totalEl) totalEl.textContent = String(total); // Updates total

  if (currentEl) {
    // If current element exists
    const from =
      typeof prevScore === 'number'
        ? prevScore
        : Number(currentEl.dataset.value || currentEl.textContent || 0); // Old score
    const to = current; // New score
    animateNumber(currentEl, from, to, 450); // Animates change
    if (to > from) {
      // If score increased
      el.classList.remove('score-bump'); // Removes bump class
      void el.offsetWidth; // Forces reflow
      el.classList.add('score-bump'); // Adds bump animation
    }
  } else {
    el.textContent = `Score: ${current} / ${total}`; // Simple text update
  }
};

// Saves the chosen answer for a question
const storeAnswer = (questionIndex, selectedOption) => {
  const prevScore = quizData.score(); // Old score before change
  const wasCorrect =
    selectedOption === quizData.questions[questionIndex].correct; // Checks if correct

  quizData.questions[questionIndex].selected = selectedOption; // Saves choice
  console.log(`Question ${questionIndex + 1} selected:`, selectedOption); // Logs choice

  // Saves state and updates displays
  try {
    saveState();
  } catch {}
  updateScoreIndicator(prevScore); // Updates score
  updateProgressBar(); // Updates progress
  updateSaladBowl(); // Updates bowl
  showPrizePop(wasCorrect); // Shows prize or fail
};

export const initQuestionPage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID); // Gets main UI
  userInterface.classList.remove('welcome-mode'); // Removes welcome class

  // Checks if all questions done, shows end page if yes
  if (quizData.currentQuestionIndex >= quizData.questions.length) {
    resetQuestionTheme(); // Resets background theme
    // Loads end page
    import('./endPage.js').then((mod) => mod.showEndPage());
    return;
  }

  userInterface.innerHTML = ''; // Clears UI

  const currentQuestion = quizData.questions[quizData.currentQuestionIndex]; // Current question

  // Sets background theme for this question
  setQuestionTheme(quizData.currentQuestionIndex);

  const scoreText = `Score: ${quizData.score()} / ${quizData.questions.length}`; // Score text
  const questionElement = createQuestionElement(
    currentQuestion.text,
    scoreText
  ); // Makes question HTML

  // Adds question to UI
  userInterface.appendChild(questionElement);

  // Adds floating items and updates displays
  ensureFloatingIngredients(); // Floating salad
  buildProgressMarks(); // Progress marks
  updateProgressBar(); // Progress bar
  updateSaladBowl(); // Salad bowl

  // Updates score display
  updateScoreIndicator();

  // Updates hint count shown
  const tracker = document.getElementById('hint-tracker'); // Hint tracker
  if (tracker) {
    const used = 3 - (quizData.hintsLeft || 3); // How many used
    tracker.innerHTML = `
      <span class="hint-label">Hints</span>
      <span class="hint-used">${used}/3</span>
    `;
  }

  const answersListElement = document.getElementById(ANSWERS_LIST_ID); // Answers list

  // Makes and adds each answer option
  for (const [key, answerText] of Object.entries(currentQuestion.answers)) {
    const answerElement = createAnswerElement(key, answerText); // Makes answer HTML

    // Tags answer with its key
    answerElement.dataset.key = key;

    // Handles click on answer
    answerElement.addEventListener('click', (event) => {
      const clickedLi = event.currentTarget; // Clicked item
      const selectedKey = clickedLi.dataset.key; // Key of selected

      // Saves the answer
      storeAnswer(quizData.currentQuestionIndex, selectedKey);

      // Gets all answers in list
      const allListItems = answersListElement.querySelectorAll('li');

      // Clears old colors
      allListItems.forEach((li) => {
        li.style.backgroundColor = '';
      });

      // Checks if correct
      const isCorrect = selectedKey === currentQuestion.correct;

      if (isCorrect) {
        // If correct
        clickedLi.style.backgroundColor = 'green'; // Green color
        clickedLi.classList.add('correct-bounce'); // Bounce animation
      } else {
        // If wrong
        clickedLi.style.backgroundColor = 'red'; // Red color
        clickedLi.classList.add('incorrect-wilt'); // Wilt animation

        // Shows correct one
        allListItems.forEach((li) => {
          if (li.dataset.key === currentQuestion.correct) {
            li.style.backgroundColor = 'green';
          }
        });
      }
      const nextBtnEl = document.getElementById(NEXT_QUESTION_BUTTON_ID); // Next button
      if (nextBtnEl) {
        nextBtnEl.classList.remove('btn-error', 'shake'); // Clears error
      }
      allListItems.forEach((li) => {
        li.style.pointerEvents = 'none'; // No more clicks
      });

      // Disables other buttons
      const avoid = document.getElementById(AVOID_QUESTION_BUTTON_ID);
      if (avoid) avoid.disabled = true;
      const eliminate = document.getElementById(
        ELIMINATE_TWO_ANSWERS_BUTTON_ID
      );
      if (eliminate) eliminate.disabled = true;
    });

    answersListElement.appendChild(answerElement); // Adds answer
  }

  // If answer already chosen before, shows it
  if (currentQuestion.selected) {
    const allListItems = answersListElement.querySelectorAll('li'); // All answers
    const selectedKey = currentQuestion.selected; // Selected key
    allListItems.forEach((li) => {
      li.style.backgroundColor = ''; // Clears colors
    });
    const isCorrect = selectedKey === currentQuestion.correct; // Checks correct
    // Colors selected and correct
    allListItems.forEach((li) => {
      if (li.dataset.key === selectedKey) {
        li.style.backgroundColor = isCorrect ? 'green' : 'red'; // Selected color
      }
      if (li.dataset.key === currentQuestion.correct) {
        li.style.backgroundColor = 'green'; // Correct color
      }
      li.style.pointerEvents = 'none'; // No clicks
    });
    // Disables buttons
    const avoid = document.getElementById(AVOID_QUESTION_BUTTON_ID);
    if (avoid) avoid.disabled = true;
    const eliminate = document.getElementById(ELIMINATE_TWO_ANSWERS_BUTTON_ID);
    if (eliminate) eliminate.disabled = true;

    // Clears next button error
    const nextBtnEl = document.getElementById(NEXT_QUESTION_BUTTON_ID);
    if (nextBtnEl) {
      nextBtnEl.classList.remove('btn-error', 'shake');
    }
    updateScoreIndicator(); // Updates score
    updateProgressBar(); // Updates progress
    updateSaladBowl(); // Updates bowl for consistency
  }

  const eliminateBtn = document.getElementById(ELIMINATE_TWO_ANSWERS_BUTTON_ID);
  if (eliminateBtn) {
    let hintUsed = false;

    const refreshEliminateUI = () => {
      const hintsLeft = typeof quizData.hintsLeft === 'number' ? quizData.hintsLeft : 3;
      eliminateBtn.textContent = 'Hint';
      const shouldDisable = hintUsed || !!currentQuestion.selected;
      eliminateBtn.disabled = shouldDisable;
      if (hintUsed) {
        eliminateBtn.classList.add('hint-used');
      } else {
        eliminateBtn.classList.remove('hint-used');
      }
    };

    // initial state for this question
    refreshEliminateUI();

    eliminateBtn.addEventListener('click', () => {
      if (eliminateBtn.disabled) return;

      const hintsLeftRaw =
        typeof quizData.hintsLeft === 'number' ? quizData.hintsLeft : 3;

      // No hints left: show red error feedback with existing animation and exit
      if (hintsLeftRaw <= 0) {
        eliminateBtn.classList.add('btn-error', 'shake');
        setTimeout(() => eliminateBtn.classList.remove('shake', 'btn-error'), 460);
        return;
      }

      const allListItems = Array.from(answersListElement.querySelectorAll('li'));

      // Always use "eliminate two wrong answers"
      hint(currentQuestion, allListItems, 0);

      // Mark hint on this question
      currentQuestion.usedHint = true;

      // Consume one global hint
      quizData.hintsLeft = Math.max(0, hintsLeftRaw - 1);
      try {
        saveState();
      } catch {}

      // Update the on-screen tracker "used/3"
      const trackerEl = document.getElementById('hint-tracker');
      if (trackerEl) {
        const usedAfter = 3 - (quizData.hintsLeft || 0);
        const usedSpan = trackerEl.querySelector('.hint-used');
        if (usedSpan) usedSpan.textContent = `${usedAfter}/3`;
      }

      // Also refresh progress dots immediately
      try {
        updateProgressMarks();
      } catch {}

      // Lock hint for this question
      hintUsed = true;
      eliminateBtn.classList.add('hint-used');
      refreshEliminateUI();
    });
  }

  const nextBtn = document.getElementById(NEXT_QUESTION_BUTTON_ID);
  nextBtn.addEventListener('click', () => {
    const current = quizData.questions[quizData.currentQuestionIndex];
    if (!current.selected) {
      // No answer chosen: show error state
      nextBtn.classList.add('btn-error', 'shake');
      setTimeout(() => nextBtn.classList.remove('shake'), 450);
      return;
    }
    // Answer chosen: clear error state and proceed
    nextBtn.classList.remove('btn-error');
    nextQuestion();
  });

  const avoidBtn = document.getElementById(AVOID_QUESTION_BUTTON_ID);
  if (avoidBtn) {
    avoidBtn.addEventListener('click', avoidQuestion);
  }
};

const nextQuestion = () => {
  quizData.currentQuestionIndex += 1;
  try {
    saveState();
  } catch {}
  initQuestionPage();
};

const avoidQuestion = () => {
  const listEl = document.getElementById(ANSWERS_LIST_ID);
  const current = quizData.questions[quizData.currentQuestionIndex];

  if (listEl && current) {
    const items = Array.from(listEl.querySelectorAll('li'));
    // disable clicks
    items.forEach((li) => (li.style.pointerEvents = 'none'));

    // mark correct answer briefly
    items.forEach((li) => {
      if (li.dataset.key === current.correct) {
        li.style.backgroundColor = 'green';
        li.setAttribute('data-badge', '✓');
      }
    });

    const avoid = document.getElementById(AVOID_QUESTION_BUTTON_ID);
    if (avoid) avoid.disabled = true;
    const eliminate = document.getElementById(ELIMINATE_TWO_ANSWERS_BUTTON_ID);
    if (eliminate) eliminate.disabled = true;

    // mark this question as avoided and update progress immediately
    current.avoided = true;
    try {
      saveState();
    } catch {}
    try {
      updateProgressMarks();
    } catch {}

    setTimeout(() => {
      quizData.currentQuestionIndex = quizData.currentQuestionIndex + 1;
      console.log('Question avoided');
      try {
        saveState();
      } catch {}
      initQuestionPage();
    }, 800);
  } else {
    // fallback immediate
    current.avoided = true;
    try {
      saveState();
    } catch {}
    try {
      updateProgressMarks();
    } catch {}
    quizData.currentQuestionIndex = quizData.currentQuestionIndex + 1;
    console.log('Question avoided');
    initQuestionPage();
  }
};

const hint = (currentQuestion, allListItems, hintTypeIndex) => {
  if (currentQuestion) currentQuestion.usedHint = true;
  if (hintTypeIndex === 0) {
    // Eliminate 2 wrong answers
    const wrongItems = allListItems.filter((li) => {
      return li.dataset.key !== currentQuestion.correct;
    });
    const elements = new Set();

    while (elements.size < 2) {
      const randomIndex = Math.floor(Math.random() * wrongItems.length);
      elements.add(wrongItems[randomIndex]);
    }

    elements.forEach((ele) => {
      ele.classList.add('eliminate-out');
      ele.setAttribute('aria-hidden', 'true');
      ele.style.pointerEvents = 'none';
      ele.addEventListener(
        'animationend',
        () => {
          ele.hidden = true;
        },
        { once: true }
      );
    });
  } else if (hintTypeIndex === 1) {
    // Show Link
    if (currentQuestion.links && currentQuestion.links.length > 0) {
      const link = currentQuestion.links[0];
      alert(`Helpful link: ${link.text}\n${link.href}`);
    } else {
      alert('No helpful link available for this question.');
    }
  } else if (hintTypeIndex === 2) {
    // First Letter
    const correctKey = currentQuestion.correct;
    const correctAnswer = currentQuestion.answers[correctKey];
    const firstLetter = correctAnswer.charAt(0).toUpperCase();
    alert(`The correct answer starts with: ${firstLetter}`);
  }
};
