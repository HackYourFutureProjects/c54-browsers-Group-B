/* Program Data

  In this file you can declare variables to store important data for your program.
  The data can only be primitives, objects, or arrays.
  Do not store DOM elements in these variables!!!!

  These variables will be imported by your handlers when necessary.
*/

export const quizData = {
  scoreCorrect: 0, // quantity of correct answers
  scoreIncorrect: 0, // quantity of incorrect answers
  maxQuestions: 10, // maximum number of questions in the quiz

  currentQuestionIndex: 0,
  userName: '', //store user name
  // All quiz questions
  questions: [
    // EASY
    {
      id: 'Q1',
      difficulty: 'easy',
      text: 'What is the capital of France?',
      answers: { a: 'Paris', b: 'London', c: 'Berlin', d: 'Rome' },
      correct: 'a',
      selected: null,
      links: [
        { text: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Paris' },
      ],
    },
    {
      id: 'Q2',
      difficulty: 'easy',
      text: 'Which planet is known as the Red Planet?',
      answers: { a: 'Earth', b: 'Mars', c: 'Venus', d: 'Jupiter' },
      correct: 'b',
      selected: null,
      links: [
        {
          text: 'NASA',
          href: 'https://solarsystem.nasa.gov/planets/mars/overview/',
        },
      ],
    },
    {
      id: 'Q3',
      difficulty: 'easy',
      text: 'What is 5 × 6?',
      answers: { a: '30', b: '25', c: '35', d: '40' },
      correct: 'a',
      selected: null,
      links: [],
    },

    // MEDIUM
    {
      id: 'Q4',
      difficulty: 'medium',
      text: 'Who wrote the play "Romeo and Juliet"?',
      answers: {
        a: 'William Shakespeare',
        b: 'Charles Dickens',
        c: 'Leo Tolstoy',
        d: 'Mark Twain',
      },
      correct: 'a',
      selected: null,
      links: [
        {
          text: 'Biography',
          href: 'https://www.biography.com/writer/william-shakespeare',
        },
      ],
    },
    {
      id: 'Q5',
      difficulty: 'medium',
      text: 'Which gas do plants absorb during photosynthesis?',
      answers: {
        a: 'Oxygen',
        b: 'Carbon Dioxide',
        c: 'Nitrogen',
        d: 'Hydrogen',
      },
      correct: 'b',
      selected: null,
      links: [
        {
          text: 'Britannica',
          href: 'https://www.britannica.com/science/photosynthesis',
        },
      ],
    },
    {
      id: 'Q6',
      difficulty: 'medium',
      text: 'What year did World War II end?',
      answers: { a: '1940', b: '1942', c: '1945', d: '1948' },
      correct: 'c',
      selected: null,
      links: [
        {
          text: 'History',
          href: 'https://www.history.com/topics/world-war-ii/world-war-ii-history',
        },
      ],
    },

    // HARD
    {
      id: 'Q7',
      difficulty: 'hard',
      text: 'Who painted the Mona Lisa?',
      answers: {
        a: 'Michelangelo',
        b: 'Leonardo da Vinci',
        c: 'Pablo Picasso',
        d: 'Vincent van Gogh',
      },
      correct: 'b',
      selected: null,
      links: [
        {
          text: 'Louvre Museum',
          href: 'https://www.louvre.fr/en/explore/the-palace/mona-lisa',
        },
      ],
    },
    {
      id: 'Q8',
      difficulty: 'hard',
      text: 'What is the square root of 256?',
      answers: { a: '14', b: '15', c: '16', d: '18' },
      correct: 'c',
      selected: null,
      links: [],
    },
    {
      id: 'Q9',
      difficulty: 'hard',
      text: 'Which element has the chemical symbol "Au"?',
      answers: { a: 'Silver', b: 'Gold', c: 'Copper', d: 'Aluminum' },
      correct: 'b',
      selected: null,
      links: [
        { text: 'Periodic Table', href: 'https://www.ptable.com/Element/Au' },
      ],
    },
    {
      id: 'Q10',
      difficulty: 'hard',
      text: 'Which country hosted the first modern Olympic Games?',
      answers: { a: 'Greece', b: 'France', c: 'Italy', d: 'United Kingdom' },
      correct: 'a',
      selected: null,
      links: [
        { text: 'Olympics', href: 'https://www.olympic.org/athens-1896' },
      ],
    },
  ],

  // Calculate the score from each question's selected answer
  score() {
    return this.questions.reduce(
      (sum, q) => sum + (q.selected === q.correct ? 1 : 0),
      0
    );
  },
};
