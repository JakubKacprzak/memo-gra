$(document).ready(function () {
  let playerName = "";
  let moves = 0;
  let cardNum = 8;
  let level = "easy";
  let isCardFlippable = true;
  let cardsFlipped = 0;
  let isFirstMove = true;
  let $prevCard;
  let prevColor;
  let timer;
  let matchedCards = 0;

  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "cyan",
    "magenta",
    "lime",
    "pink",
    "brown",
    "grey",
    "maroon",
    "olive",
    "navy",
    "teal",
    "silver",
    "coral",
    "gold",
    "violet",
  ];

  let [milisec, sec, min] = [0, 0, 0, 0];

  $(".gameDisplay").hide();
  $(".scores-container").hide();

  $("#startGame").click(function (event) {
    event.preventDefault();

    playerName = $("#playerName").val();

    if (!playerName) {
      alert("Podaj nazwe gracza.");
      return;
    }

    $("#startGameForm").hide();
    $(".gameDisplay").show();
    $(".gameBoard").addClass("grid");

    level = $("input[name='level']:checked").val();
    cardNum = level === "easy" ? 8 : level === "hard" ? 36 : 16;

    $(".timer").html('Czas: <span class="font-mono">00:00:00</span>');

    fetchScores(level);
    updateGameStatus();
    createCards(cardNum);
  });

  function createCards(cardNum) {
    let cardColors = [
      ...colors.slice(0, cardNum / 2),
      ...colors.slice(0, cardNum / 2),
    ];
    shuffle(cardColors);

    let cols = Math.sqrt(cardNum);
    let rows = Math.sqrt(cardNum);

    if (level === "easy") {
      cols = 4;
      rows = 2;
      $(".gameBoard").css("height", "250px");
    } else {
      $(".gameBoard").css("height", "500px");
    }

    $(".gameBoard")
      .empty()
      .css("grid-template-columns", `repeat(${cols}, minmax(62.5px, 1fr))`)
      .css("grid-template-rows", `repeat(${rows}, minmax(62.5px, 1fr))`);
    cardColors.forEach((color) => {
      const $card = $(`
        <div class="card" data-color="${color}">
          <div class="card-front"></div>
          <div class="card-back"></div>
        </div>`).on("click", handleCardClick);
      $(".gameBoard").append($card);
    });
  }

  function handleCardClick() {
    if (isFirstMove) {
      isFirstMove = false;
      timer = setInterval(displayTimer, 10);
    }

    if (isCardFlippable) {
      let $card = $(this);
      let currColor = $card.attr("data-color");

      $card.find(".card-back").css("background-color", currColor);
      $card.addClass("is-flipped").off("click");

      cardsFlipped++;
      if (cardsFlipped === 2) {
        isCardFlippable = false;
        moves++;
        if (currColor === prevColor) {
          matchedCards++;
          $card.find(".card-back").addClass("hideCard");
          $prevCard.find(".card-back").addClass("hideCard");
          resetCardState();
        } else {
          setTimeout(() => {
            $card.removeClass("is-flipped").on("click", handleCardClick);
            $prevCard.removeClass("is-flipped").on("click", handleCardClick);
            resetCardState();
          }, 1000);
        }
      } else {
        $prevCard = $card;
        prevColor = currColor;
      }

      updateGameStatus();

      if (matchedCards === cardNum / 2) endGame();
    }
  }

  function updateGameStatus() {
    $(".level").text("Level: " + level);
    $(".moves").text("Ruchy: " + moves);
    $(".matchedCards").text("Pary: " + matchedCards);
  }

  function resetCardState() {
    $prevCard = null;
    prevColor = null;
    isCardFlippable = true;
    cardsFlipped = 0;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function displayTimer() {
    milisec++;

    if (milisec === 100) {
      sec++;
      milisec = 0;
      if (sec === 60) {
        min++;
        sec = 0;
      }
    }
    let m = min < 10 ? "0" + min : min;
    let s = sec < 10 ? "0" + sec : sec;
    let ms = milisec < 10 ? "0" + milisec : milisec;

    $(".timer").html(`Czas: <span class="font-mono">${m}:${s}:${ms}</span>`);
  }

  function endGame() {
    clearInterval(timer);

    const totalMilliseconds = min * 60 * 1000 + sec * 1000 + milisec;

    $.ajax({
      url: "http://localhost:5000/game/save",
      method: "POST",
      data: {
        name: playerName,
        timer: totalMilliseconds,
        moves: moves,
        level: level,
      },
      success: function (response) {
        console.log("Wyniki zapisano", response);
        fetchScores(level);
      },
      error: function (error) {
        console.error("Błąd podczas zapisywania wyników", error);
      },
    });

    $(".scores-container").show();
    $(".gameBoard").hide();
  }

  function fetchScores(level) {
    $.ajax({
      url: `http://localhost:5000/game/scores?level=${level}`,
      method: "GET",
      success: function (response) {
        displayScores(response);
      },
      error: function (error) {
        console.log("Błąd podczas pobierania wyników", error);
      },
    });
  }

  function displayScores(scores) {
    const $scoresTableBody = $(".scores-table-body");

    $(".levelCaption").html(
      `Poziom <span class="bg-${
        level === "easy"
          ? "green-500"
          : level === "hard"
          ? "red-600"
          : "yellow-500"
      } px-1">${level}</span>`
    );
    $scoresTableBody.empty();

    scores.forEach((score, index) => {
      let min = Math.floor(score.timer / 60000);
      let sec = Math.floor((score.timer % 60000) / 1000);
      let milisec = score.timer % 1000;

      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      milisec = milisec < 10 ? "0" + milisec : milisec;

      const scoreRow = `
      <tr>
        <td class="border px-4 py-2 text-center">${index + 1}</td>
        <td class="border px-4 py-2 text-center">${score.name}</td>
        <td class="border px-4 py-2 text-center font-mono">
          ${min}:${sec}:${milisec}
        </td>
        <td class="border px-4 py-2 text-center">${score.moves}</td>
      </tr>
    `;

      $scoresTableBody.append(scoreRow);
    });
  }
});
