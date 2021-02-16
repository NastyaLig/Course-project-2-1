const cards = Array.from(document.querySelectorAll(".card"));

var modalWindow = document.querySelector(".overlay");
var result = document.querySelector(".result");
var spans = result.querySelectorAll("span");
var button = document.querySelector("#play-again");
var hasRotatedCard = false;
var lockCards = false; //есть ли заблокированные карточки
var firstCard, secondCard;
var moves = 0;
var matchedCards = 0;
var second = 0;
var minute = 1;

function startGame() {
  moves = 0;
  matchedCards = 0;
  shuffle();
  resetCards();
  changeColor(cards, "#fff");
  cards.forEach(function(card) {
    if (card.classList.contains("rotate")) {
      card.classList.remove("rotate");
    }
    card.addEventListener("click", rotateCard);
  });
}

function showTime() {
  if (second === 0) {
    timer.textContent = "0" + minute + ":" + second + "0";
  } else if (second > 0 && second < 10) {
    timer.textContent = "0" + minute + ":" + "0" + second;
  } else {
    timer.textContent = "0" + minute + ":" + second;
  }
}

//-----------Таймер--------//
var timer = document.querySelector(".timer");
var interval;
function startTimer() {
  interval = setInterval(function() {
    if (minute > 0 || second >= 0) {
      if (minute == 1) {
        second = 59;
        minute = 0;
      }
      showTime();
      second--;
    }
    if (minute === 0 && second === 0) {
      var text = "Lose";
      var i = 0;
     while (i < text.length) {
        spans[i].textContent = text[i];
        i += 1;
      }
      button.textContent = "Try again";
      setTimeout(function() {
        modalWindow.classList.add("show");
      }, 1000);
    }
  }, 1000);
}

//------------Разворот карточки--------------//
function rotateCard() {
  if (moves === 0) {
    startTimer();
  }
  if (this === firstCard) return;
  if (secondCard) {
    firstCard.classList.toggle("rotate");
    secondCard.classList.toggle("rotate");
    changeColor([firstCard, secondCard], "#fff");
    resetCards();
  }
  if (lockCards) return;
  this.classList.add("rotate");

  if (!hasRotatedCard) {
    moves++;
    hasRotatedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  lockCards = true;
  checkMatch();
  if (matchedCards === cards.length) {
    clearInterval(interval);
    var text = "Win";
    var i = 0;
    while (i < text.length) {
      spans[i].textContent = text[i];
      i += 1;
    }
    button.textContent = "Play again";
    modalWindow.classList.add("show");
  }
}

//------------Проверка карточек на соответствие-----------//
function checkMatch() {
  var isEqual = firstCard.dataset.animal === secondCard.dataset.animal;
  isEqual ? disableCards() : unequalCards();
}

//------------Делаем уже сопоставленные карточки нечувствительными к клику--------//
function disableCards() {
  firstCard.removeEventListener("click", rotateCard);
  secondCard.removeEventListener("click", rotateCard);
  changeColor([firstCard, secondCard], "#5ad66f");
  matchedCards += 2;
  resetCards();
}

//------------Смена цвета------------//
function changeColor(cardsChanging, color) {
  var frontCards = [];
  cardsChanging.forEach(card => {
    frontCards.push(card.querySelector(".front"));
  });
  frontCards.forEach(card => {
    card.style.background = color;
    card.style.border = color;
  });
}

//-----------Случай нессответствия карточек---------//
function unequalCards() {
  changeColor([firstCard, secondCard], "#f44336");
  lockCards = true;
}

//-----------Сброс переменных---------//
function resetCards() {
  hasRotatedCard = false;
  lockCards = false;
  firstCard = null;
  secondCard = null;
}

//----------Перемешиваем карточки-----------//
function shuffle() {
  cards.forEach(card => {
    let ramdomPosition = Math.floor(Math.random() * 12);
    card.style.order = ramdomPosition;
  });
}

//---------Обработка клика по кнопке-----------//
button.addEventListener("click", playAgain);

function playAgain() {
  clearInterval(interval);
  minute = 1;
  second = 0;
  showTime();
  modalWindow.classList.remove("show");
  startGame();
}
document.body.onload = startGame();
