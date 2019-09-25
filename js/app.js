const numCards = 16;    // Total cards in game
const cardTypes = ['fa fa-diamond', 'fa fa-bomb', 'fa fa-paper-plane',  // All the card symbols
    'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle'];
let flippedCards = [];  // Cards that are flipped and need to be checked
let deck = document.querySelector('.deck'); // Deck element
let deckLayout = [];    // Deck symbol layout
let matchedPairs = 0;   // Number of pairs that have been matched
let flippedCounter = 0; // Number of match attempts
let time = 0;   // Time elapsed
let currentMatched = [];    // Current cards that have been matched
let interval;   // Timer object
let modal = document.querySelector('.modal');   // Winning modal

// Adds the cards to DOM
document.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < numCards / 2; i++) {
        deckLayout.push(cardTypes[i]);
        deckLayout.push(cardTypes[i]);
    }
    deckLayout = shuffle(deckLayout);

    // Create the card elements and add it to the DOM  
    for (const cardType of deckLayout) {
        let newCard = document.createElement('li');
        newCard.className = 'card';
        let newCardIcon = document.createElement('i');
        newCardIcon.className = cardType;
        newCard.appendChild(newCardIcon);
        deck.appendChild(newCard);
    }
    deck.addEventListener('click', handleCardClick);

    startTimer();
})

// Event listener for card clicks
function handleCardClick(e) {
    if (e.target.className == 'card') {
        flipCard(e.target);
    }
}

// Add event handler for reset button
let restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', handleRestart);

// Event listener for reset button
function handleRestart() {
    clearInterval(interval);
    resetGame(false);
}

// Keep tracks of the time elapsed
function startTimer() {
    interval = setInterval(function timer() {
        time++;

        // Calculate the time elapsed
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        // Format the string
        let minutesZero = minutes < 10 ? '0' : '';
        let secondsZero = seconds < 10 ? '0' : '';
        let formatted = minutesZero + minutes + ':' + secondsZero + seconds;
        document.querySelector('.timer').innerHTML = 'Timer: ' + formatted; // Display the string
    }, 1000);
}

// Flip the card and check whether two cards have been flipped
function flipCard(card) {
    card.classList.toggle('show');
    card.classList.toggle('open');
    flippedCards.push(card);

    // Check if there are currently 2 cards flipped over
    if (flippedCards.length == 2) {
        incrementFlip();
        deck.removeEventListener('click', handleCardClick);
        checkMatch();
    }
}

// Checks if the flipped cards match
function checkMatch() {
    if (flippedCards[0].firstElementChild.className == flippedCards[1].firstElementChild.className) {
        setTimeout(match, 500);
    }
    else {
        setTimeout(unmatch, 1000);
    }
}

// Flipped cards match
function match() {
    for (let i = 0; i < flippedCards.length; i++) {
        flippedCards[i].classList.toggle('match');
        currentMatched.push(flippedCards[i]);
    }
    matchedPairs++;

    // If the player has matched all cards
    if (matchedPairs == 8) {
        clearInterval(interval);    // Stop the timer
        openModal();    // Display the winning screen
    }
    flippedCards.length = 0;
    deck.addEventListener('click', handleCardClick);
}

// Flipped cards don't match
function unmatch() {
    for (let i = 0; i < flippedCards.length; i++) {
        flippedCards[i].classList.toggle('show');
        flippedCards[i].classList.toggle('open');
    }
    flippedCards.length = 0;
    deck.addEventListener('click', handleCardClick);
}

// Handle the moves counter and stars given
function incrementFlip() {
    document.querySelector('.moves').innerHTML = ++flippedCounter;
    if (flippedCounter == 9 || flippedCounter == 15) {
        let stars = document.querySelectorAll('.fa.fa-star');
        stars[stars.length - 1].className = 'fa fa-star-o';
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Add event handler to modal's close
let modalClose = document.querySelector('.close-button');
modalClose.addEventListener('click', closeModal);

// Close the modal and reset the game
function closeModal() {
    modal.classList.toggle('show-modal');
    resetGame(true);
}

// Open winning modal display
function openModal() {
    modal.classList.toggle('show-modal');
    for (let i = 0; i < currentMatched.length; i++) {
        currentMatched[i].classList.toggle('hide');
    }
    let starCount = document.querySelectorAll('.fa.fa-star');
    let message = 'you won with ' + starCount.length + ' stars and ' + flippedCounter
        + ' moves in ' + time + ' seconds!';
    document.querySelector('#winning-message').innerHTML = message;
}

// Reset the game for the player
function resetGame(won) {
    // Flip the cards over
    for (let i = 0; i < currentMatched.length; i++) {
        if (won) {  // Have to set the opacity back to normal
            currentMatched[i].classList.toggle('hide');
        } 
        currentMatched[i].classList.toggle('match');
        currentMatched[i].classList.toggle('open');
        currentMatched[i].classList.toggle('show');
    }

    // Flips the unmatched cards if reset button was pressed
    if (!won) {
        for (let i = 0; i < flippedCards.length; i++) {
            flippedCards[i].classList.toggle('open');
            flippedCards[i].classList.toggle('show');
        }
        flippedCards.length = 0;
    }

    // Shuffle and reset the card layout
    deckLayout = shuffle(deckLayout);
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].firstElementChild.className = deckLayout[i];
    }

    // Reset the stars
    let stars = document.querySelectorAll('.fa.fa-star-o');
    for (let i = 0; i < stars.length; i++) {
        stars[i].className = 'fa fa-star';
    }

    // Reset variables and GUI
    time = 0;
    startTimer();
    flippedCounter = 0;
    matchedPairs = 0;
    currentMatched.length = 0;
    document.querySelector('.moves').innerHTML = flippedCounter;
}