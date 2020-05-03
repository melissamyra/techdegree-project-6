const qwerty = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const overlay = document.getElementById('overlay');
const phraseUL = document.querySelector('#phrase ul');
const tries = document.querySelectorAll('.tries');
const chances = tries.length;
let missed = 0;

const phrases = [
  'A wish upon a star',
  'One is loved because one is loved',
  'Life is a blank canvas',
  'Every moment matters',
  'Every tiny victory is worth celebrating'
];

// FUNCTIONS ======================================================

//====== Remove Overlay
const removeOverlay = () => {
  overlay.style.display = 'none';
};

//====== Show Overlay
const showOverlay = () => {
  overlay.style.display = '';
};

//====== Access random array index and split phrase into a new array of letters
const getRandomPhraseAsArray = (array) => {
  const randomNum = Math.floor(Math.random() * array.length);
  const phraseChosen = array[randomNum];
  const letters = phraseChosen.split('').map((x)=>{ return x.toLowerCase(); });
  return letters;
};


//====== Append phrase letters onto div
const addPhraseToDisplay = (array) => {
  //loop through array to create list item with content from array and appending to UL
  for (let i = 0; i < array.length; i++) {
    let list = document.createElement('LI');
    list.textContent = array[i];
    phraseUL.appendChild(list);
    //if array item is letter add class letter, else if space add class space
    if (list.textContent !== ' ') {
      list.className = 'letter';
    } else {
      list.className = 'space';
    }
  }
}

//====== Check if button pressed matches any letters in phrase
const checkLetter = (button) => {
  const letters = document.querySelectorAll('.letter');
  let match = null;
  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i].textContent;
    // if button pressed matches, show letter
    if ( button == letter ) {
      letters[i].classList.add('show');
      match = true;
    }
  }
  return match;
};


//====== Check Win or Lose
const checkWin = () => {
  const letters = document.querySelectorAll('.letter'); // all letters in guess phrase
  const reveal = document.querySelectorAll('.show'); // correctly guessed letters - letters that are shown
  const title = document.querySelector('.title');
  const button = overlay.querySelector('.btn__reset');
  const tries = document.querySelectorAll('.tries');
  // if guessed all letters of phrase = WIN!
  if (reveal.length === letters.length) {
    showOverlay();
    overlay.classList.add('win');
    button.textContent = 'Play Again';
    title.textContent = 'YOU WIN!!!';
  }
  // if used up all chances = LOSE!
  if (missed === chances) {
    showOverlay();
    overlay.classList.add('lose');
    button.textContent = 'Try Again';
    title.textContent = 'YOU LOST :(';
  }
  // if button clicked, remove overlay
  button.addEventListener('click', (e) => {
    if (e.target.className === 'btn__reset') {
      reset();
      removeOverlay();
      checkWin();
    }
  });
};

//====== Reset all Phrases and Buttons
const reset = () => {
  const letters = document.querySelectorAll('.letter');
  const chosen = document.querySelectorAll('.chosen');
  const score = document.querySelector('#scoreboard ol');
  missed = 0; // reset missed
  // clear current guess phrase
  phraseUL.innerHTML = '';
  // clear scoreboard
  score.innerHTML = '';
  // add lives/chances back to scoreboard
  for (let i = 0; i < 5; i++) {
    const tries = document.createElement('LI');
    tries.className = 'tries';
    tries.innerHTML = '<img src="images/liveHeart.png" height="35" width="30">';
    score.appendChild(tries);
  }
  // reset/reenable keys
  for (let i = 0; i < chosen.length; i++) {
    chosen[i].classList.remove('chosen');
    chosen[i].disabled = false;
  }
};

// ================================================================

  overlay.addEventListener('click', (e) => {
    // hide overlay when button pressed
    if (e.target.className === 'btn__reset') {
      removeOverlay();
      // initialize overlay classes
      overlay.classList.remove('win','lose');
      // add random phrase to screen
      addPhraseToDisplay(getRandomPhraseAsArray(phrases));
    }

  }); // overlay listener end

  // listen to keyboard
  document.addEventListener('keydown', (e) => {

    //register key press only is overlay is hidden **special thanks to Jay for fixing the overlay issue**
    if (overlay.style.display === 'none') {

      const buttons = document.querySelectorAll('button');
      // loop through qwerty buttons
      for (let i = 0; i < buttons.length; i++) {
        // if key press match button add chosen class and disable button
        if (e.key === buttons[i].textContent) {
          let button = buttons[i].textContent;
          // store match value | check if button pressed matches phrase letters
          const letterfound = checkLetter(button);
          const score = document.querySelector('#scoreboard ol');
          const tries = document.querySelectorAll('.tries');
          // is match is null && button is still enabled, remove chance and missed + 1
          if (letterfound === null && buttons[i].disabled === false) {
            missed++;
            score.removeChild(tries[0]);
          }
          //disables pressed keys ( has to be after null check otherwise keys can be double pressed )
          buttons[i].classList.add('chosen');
          buttons[i].disabled = true;
          checkWin();
        }
      }

    }
  }); // keyboard listener end

  // listen to click on qwerty buttons
  qwerty.addEventListener('click', (e) => {
    let target = e.target;
    let button;
    if (target.tagName === 'BUTTON') {
      target.classList.add('chosen');
      target.disabled = true;
      button = target.textContent.toLowerCase();
      const letterfound = checkLetter(button);
      const score = document.querySelector('#scoreboard ol');
      const tries = document.querySelectorAll('.tries');
      // is match is null remove chance and missed + 1
      if (letterfound === null) {
        missed++;
        score.removeChild(tries[0]);
      }
      checkWin();
    }
  }); // qwerty click listener end
