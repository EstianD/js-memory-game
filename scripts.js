// HTML References
let gameBoard = document.getElementById("game-board");
let configContainer = document.getElementById("config-container");

// Variables
let gameStart = false;
const TOTAL_CARDS = 16;
const COUNT = 8;
let SCORE = 0;
let TOTAL_SCORE;
let timer = 0;
let timerInterval;

let selectedCards = [];

let randomArray = shuffleArray(generateRandomArray(TOTAL_CARDS, COUNT));
console.log(randomArray);

// Generate initial state
// Generate array of random cards
// Start with 16 cards
// so 8 random ids between 1 - 16(amount of cards)
function generateRandomArray(range, count) {
  let randomNums = new Set();
  while (randomNums.size < count) {
    randomNums.add(Math.floor(Math.random() * (range - 1 + 1) + 1));
  }
  console.log("gen", randomNums);

  TOTAL_SCORE = randomNums.size; //The amount of pairs, each a point
  return [...randomNums, ...randomNums];
}

// Shuffle array function
function shuffleArray(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return [...arr];
}

// FUnction to render cards
function renderCards(arr) {
  gameBoard.innerHTML = "";
  arr.map((card) => {
    const cardItem = `<div class="memory-card" data-id="${card}">
         <img class="back-face" src="images/pokemon-back.png" alt="pokemon-back" />
         <img class="front-face" src="images/${card}.png" alt="${card}" />
      </div>`;

    gameBoard.innerHTML += cardItem;
  });

  setCardEventListeners();
}

// Function to render buttons
function renderButtons() {
  configContainer.innerHTML = "";
  document.getElementById("notification-msg").style.display = "none";
  let configBtn;

  if (!gameStart) {
    // render start button
    configBtn = `<button class="start-btn" onclick="clickConfigBtn()">Start</button>`;
  } else {
    // render reset button
    configBtn = `<button class="reset-btn" onclick="clickConfigBtn()">Reset</button>`;
  }
  configContainer.innerHTML += configBtn;
}

// Change game state
function clickConfigBtn() {
  gameStart = !gameStart;
  renderButtons();

  if (gameStart) {
    // Render cards
    randomArray = shuffleArray(generateRandomArray(TOTAL_CARDS, COUNT));

    renderCards(randomArray);
    let cardElements = document.querySelectorAll(".memory-card");
    //  Loop through all cards and set their display to none so that card isn't shown when flipped
    document.querySelectorAll(".front-face").forEach((frontFace) => {
      frontFace.style.display = "none";
    });

    let shuffleCount = 0;
    cardElements.forEach((card) => {
      //  Set animation to all cards

      setTimeout(() => {
        card.style.animation = "shuffle 1s";
      }, 100 + shuffleCount);
      shuffleCount += 50;
    });

    // Set all cards front-face to display again after shuffle animation
    setTimeout(() => {
      document.querySelectorAll(".front-face").forEach((frontFace) => {
        frontFace.style.display = "block";
      });
      // Set timer when game starts
      timerInterval = setInterval(() => {
        timer += 1;
        document.getElementById("timer").innerHTML = timer;
      }, 1000);
    }, 1500);
  } else {
    console.log("game end");
    let cards = document.querySelectorAll(".memory-card");
    timer = 0;
    document.getElementById("timer").innerHTML = timer;
    clearInterval(timerInterval);
    cards.forEach((card) => {
      card.classList.remove("flip");
    });
  }
}

function youWin() {
  // Stop timer
  clearInterval(timerInterval);
  // Save time
  setHighScore();
  // Change config button to "start"

  // Display text that show "you win!"
  document.getElementById("notification-msg").style.display = "block";
}

// Card clicked function
function cardClicked() {
  //   console.log(this);
  if (gameStart) {
    if (!this.classList.contains("flip")) {
      this.classList.toggle("flip");
      selectedCards.push(this);

      if (selectedCards.length === 2) {
        // if match
        if (selectedCards[0].dataset.id === selectedCards[1].dataset.id) {
          console.log("match");
          SCORE++;
          selectedCards = [];
          console.log("SCORE: ", SCORE);
          console.log("TOTAL: ", TOTAL_SCORE);

          if (SCORE == TOTAL_SCORE) {
            console.log("you win");
            youWin();
          }
        } else {
          // toggle back
          console.log("hier", selectedCards);

          selectedCards.forEach((card) => {
            console.log("---", card);
            setTimeout(() => {
              card.classList.toggle("flip");
            }, 1000);
            //  card.classList.toggle("flip");
          });

          selectedCards = [];
        }
      }
    }
  }
}

// Get highest score if stored
function getHighestScore() {
  return window.localStorage.getItem("memory-app-time");
  //   console.log("best time: ", bestTime);
}

// Store high score
function setHighScore() {
  let highScore = getHighestScore();
  if (highScore) {
    if (highScore > timer) {
      window.localStorage.setItem("memory-app-time", JSON.stringify(timer));
    }
  } else {
    window.localStorage.setItem("memory-app-time", JSON.stringify(timer));
  }
}

// Render buttons
renderButtons();

function setCardEventListeners() {
  // Get all cards
  let cards = document.querySelectorAll(".memory-card");

  // Add EventListeners
  cards.forEach((card) => {
    card.addEventListener("click", cardClicked);
  });
  console.log(cards);
}

renderCards(randomArray);

// Print highest score
document.getElementById("best-time").innerHTML = getHighestScore();
