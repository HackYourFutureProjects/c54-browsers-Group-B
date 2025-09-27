/**
 * Create a ptogress bar element
 * @returns {Element}
 */
export const createProgressBarElement = (quizData) => {
  // get the list because we want to inser the div we created before it
  // const ul = document.querySelector('#user-interface ul');

  // create the div of the progress-bar
  const element = document.createElement('div');
  // give it a class name. we need it for the css
  element.setAttribute('class', 'progress-container');

  // insert the circles inside it
  element.innerHTML = String.raw`
  <div class="circle"></div>
  `.repeat(quizData.questions.length); // create circles based on the number of the questions

  const questionIndex = quizData.currentQuestionIndex; // get which question we are on

  // note that we have not appended the element to the document yet
  const circles = element.querySelectorAll('.circle'); // get all the circles we created

  Array.from(circles).forEach((ele, index) => {
    // loop over them get the active question and give it active class name
    ele.textContent = index + 1;
    console.log(ele.textContent);
    if (index === questionIndex) {
      ele.classList.add('active');
      // ele.style.backgroundColor = 'blue';
    }
  });

  // now insert the div before the ul of the answers elements
  return element;
};
