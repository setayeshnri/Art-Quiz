let rounds;
let score = 0;
let currentRound = 0; // ---------------------------------------------------------------------------------------------
// Get items/arrays from local storage and create a new variable where this array will be stored
// ---------------------------------------------------------------------------------------------

let getStorageArray = localStorage.getItem('latestCardsList');
let retrievedArray = JSON.parse(getStorageArray);
let artworksArray = Object.values(retrievedArray);
let roundEl = document.querySelector('.title__artist');
let playerScore = document.querySelector('#player-score');
let playerRound = document.querySelector('#player-round');
let canClickNewAnswer = true; //----- variable declaration for canClickNewAnswer -heidi

// Info popup
const startButton = document.querySelector('#button-start');
const closePopupBtn = document.querySelectorAll('#close_btn');
const popup = document.querySelector('.popup');

function openPopup() {
  popup.classList.add('popup_is-opened');
}

function closePopup() {
  popup.classList.remove('popup_is-opened');
}

startButton.addEventListener('click', openPopup);
closePopupBtn.forEach((button) => {
  button.addEventListener('click', closePopup);
});

playerScore.textContent = 'Score: 0';
playerRound.textContent = 'Round: 1';

function addPlayerName() {
  const nameFromStorage = JSON.parse(localStorage.getItem('playerName'));
  const playerNameElement = document.querySelector('#player-name');
  playerNameElement.textContent = nameFromStorage;
}

addPlayerName();

function getCards() {
  let chunks = [];
  let chunk = [];

  for (let i = 0; i < artworksArray.length; i++) {
    let artwork = artworksArray[i];
    chunk.push(artwork);

    if (chunk.length === 3) {
      chunks.push(chunk);
      chunk = [];
    }
  }

  return chunks;
}

//  ---------- Answer feedback line 61-71 -heidi
function showFeedback(isCorrect) {
  const feedbackMessage = document.getElementById('feedback-message');
  feedbackMessage.textContent = isCorrect ? 'Correct! Well done! ✅ ' : 'Oops! Incorrect answer ❌';
  feedbackMessage.style.color = isCorrect ? 'green' : 'red';

  setTimeout(() => {
    feedbackMessage.textContent = '';
  }, 2000); //----shows the answer feed back for 2 seconds -heidi
}

function renderRound(round) {
  roundEl.innerHTML = '';
  let correctAnswerIndex = Math.floor(Math.random() * round.length);
  let correctAnswer = round[correctAnswerIndex];
  roundEl.innerHTML = `<h3>${correctAnswer.artist_title}</h3>`;
  let imageContainers = document.querySelectorAll('.card__image-container');

  imageContainers.forEach((container, i) => {
    container.innerHTML = '';
    let artwork = round[i];
    let artworkEl = document.createElement('img');
    artworkEl.className = 'card__image';
    artworkEl.src = 'https://www.artic.edu/iiif/2/' + artwork.image_id + '/full/200,/0/default.jpg';
    container.appendChild(artworkEl);

    artworkEl.addEventListener('click', function () {
      if (canClickNewAnswer) {
        canClickNewAnswer = false; //-----added condtion where player cannot click for a new answer after 2 seconds (adds delay to answer in the new round)----Heidi
        if (i === correctAnswerIndex) {
          score += 1;
          showFeedback(true); //------shows feedback if its correct -heidi
        } else {
          showFeedback(false); //------shows feedback if its wrong -heidi
        }

        playerScore.textContent = `Score: ${score}`;
        playerRound.textContent = `Round: ${currentRound + 2}`;

        setTimeout(() => {
          //---------- added a condition where player can now click after 2 seconds same as the feedback time. line 105-108 -Heidi
          canClickNewAnswer = true;
        }, 2000);

        if (currentRound === 4) {
          displayEndMessage(score);
        } else {
          currentRound += 1;
          renderRound(getCards()[currentRound]);
        }
        window.scrollTo(0, 0); //-----automatically scrolss up the screen -heidi
      }
    });
  });
}

renderRound(getCards()[currentRound]);
// --------------------------------------------------------------------------
// Code for Rendering end pop up message
// --------------------------------------------------------------------------
function displayEndMessage(score) {
  // Call the function to create the whole screen element
  const wholeScreen = createWholeScreen();
  // Call the function to se end message based on the score
  const endMessage = getEndMessage(score);
  // Call the function to create a container for the message
  const container = createContainer(endMessage);
  //Call the function to create a container for the button
  const btncontainer = createBtnContainer();
  // Call the function to create the "Play Again" button
  const btnNewGame = createNewGameButton();
  // Call the function to create the "Start Page" button
  const btnNewPlayer = createNewPlayerButton();
  // Event listener to the  New Game button for navigation
  btnNewGame.addEventListener('click', navigateToCard);
  // Event listener to the New Player button for navigation
  btnNewPlayer.addEventListener('click', navigateToIndex);
  // Place elements to their respective parent elements
  appendElements(wholeScreen, container, btncontainer, btnNewGame, btnNewPlayer);
  // Show the whole screen by changing display from "none" to "block"
  wholeScreen.style.display = 'block';
}
function createWholeScreen() {
  // Create the whole screen element and return it
  const wholeScreen = document.createElement('div');
  wholeScreen.id = 'wholeScreen';
  document.body.append(wholeScreen);
  return wholeScreen;
}
// fix 5 0f 5
function getEndMessage(score) {
  //  End message based on the score and return it
  switch (score) {
    case 5:
      return "5 of 5<br>Congratulations!<br>You're a certified Art Master.<br>You nailed it!";
    case 4:
      return '4 of 5<br>Almost perfection!<br>Your art expertise is shining through.';
    case 3:
      return "3 of 5<br>Impressive!<br>You're becoming an Art Master.";
    case 2:
      return '2 of 5<br>Well done!<br>Your art knowledge is growing.';
    case 1:
      return "1 of 5<br>You're on the right track!<br>Brush up on those art details.";
    default:
      return '0 of 5<br>Keep exploring the art world!';
  }
}
function createContainer(endMessage) {
  // Create a container for the message and button and return it
  const container = document.createElement('div');
  container.className = 'wholeScreen-container wholeScreen_text';
  container.innerHTML = endMessage;
  return container;
}
function createBtnContainer() {
  const btncontainer = document.createElement('div');
  btncontainer.id = 'btncontainer';
  btncontainer.classList.add('btncontainer');
  return btncontainer;
}
function createNewGameButton() {
  // Create the "Play Again" button and return it
  const btnNewGame = document.createElement('button');
  btnNewGame.id = 'btnNewGame';
  btnNewGame.classList.add('button');
  btnNewGame.innerHTML = 'New Game';
  return btnNewGame;
}
function createNewPlayerButton() {
  // Create the "Play Again" button and return it
  const btnStartPage = document.createElement('button');
  btnStartPage.id = 'btnStart';
  btnStartPage.classList.add('button');
  btnStartPage.innerHTML = 'New Player';
  return btnStartPage;
}
function navigateToCard() {
  // Link back to the first page (index.html)
  window.location.href = 'cards.html'; // fix card.html
}
function navigateToIndex() {
  // Link back to the first page (index.html)
  window.location.href = 'index.html';
}
function appendElements(wholeScreen, container, btncontainer, btnNewGame, btnNewPlayer) {
  // Place elements to their respective parent elements
  wholeScreen.append(container);
  container.append(btncontainer);
  btncontainer.append(btnNewGame);
  btncontainer.append(btnNewPlayer);
}
