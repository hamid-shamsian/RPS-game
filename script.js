const main = document.querySelector("main");
const rockButton = document.getElementById("rock");
const paperButton = document.getElementById("paper");
const scissorsButton = document.getElementById("scissors");
const playerScoresSpan = document.getElementById("playerScores");
const computerScoresSpan = document.getElementById("computerScores");
const resultBox = document.getElementById("result");
const overlay = document.getElementById("overlay");
const playerNameInput = document.forms[0].playerName;
const scoresToWin = 5;
let playerScores, computerScores;
let layerOpacity = 0;

document.getElementById("start").addEventListener("click", getName);
document.getElementById("submit").addEventListener("click", startGame);
// add ability to submit the input by pressing Enter:
playerNameInput.addEventListener("keydown", event => {
   if (event.code == "Enter") {
      event.preventDefault(); // prevent closing the form window by pressing Enter
      startGame();
   }
});

function getName() {
   playerNameInput.value = ""; // the value of the input field to be cleared every time the game starts
   playerNameInput.placeholder = "Enter your Name"; // if it is "required", use the default value again
   overlay.classList.remove("hidden"); // the overlay and form window to be shown
   if (window.innerHeight > 500) playerNameInput.focus(); // focus on the input field if the device is not a mobile(because of automatic opening of the keyboard)
   requestAnimationFrame(fadeIn);
}

function startGame() {
   if (playerNameInput.value) {
      // to make sure the player has already entered a value
      if (!/[^a-zA-Z]/.test(playerNameInput.value)) {
         // to make sure the player has entered a valid English simple Name
         requestAnimationFrame(fadeOut);
         setTimeout(() => {
            overlay.classList.add("hidden");
         }, 400); // hide the overlay and form after the transition completed
         document.getElementById("playerName").textContent = playerNameInput.value; // put the player name in the player box
         resetGame(); // initialize the game
         document.getElementById("retry").addEventListener("click", resetGame);
      } else {
         playerNameInput.placeholder = "Enter a valid name!";
         playerNameInput.value = "";
      }
   } else playerNameInput.placeholder = "Name is Required!"; // else: dont hide the input field and ask the player to enter their name.
}

function resetGame() {
   [playerScoresSpan.innerText, computerScoresSpan.innerText] = [playerScores, computerScores] = [0, 0]; // array destructuring
   resultBox.textContent = "Are you feeling lucky? Let's play😍";
   resultBox.className = "result";
   main.style.backgroundColor = "rgba(0,0,245,1)";
   rockButton.addEventListener("click", playRole);
   paperButton.addEventListener("click", playRole);
   scissorsButton.addEventListener("click", playRole);
}

function playRole() {
   if (playerScores + computerScores == 0) resultBox.innerHTML = `Good Luck! 😎 <span>Scores to win: ${scoresToWin}</span>`; // if it is the first turn...
   this.classList.add("selectedGameBtn"); //add the player pressed btn style class
   setTimeout(() => {
      this.classList.remove("selectedGameBtn");
   }, 250); //remove the pressed btn style class after 100ms
   let playerSelection = this.id; //obtaining the player selection: 'this' refers to the current button(object) which is clicked; becuase that button is now invoking this function (pay attention to lines 56 to 58) (or alternatively: id can also be obtained by the event parameter: event.target.id)
   let computerSelection = randomSelection(); //let the computer play his role
   const cmptrSelectedButton = document.getElementById(computerSelection + "2"); //obtaining the associated button
   cmptrSelectedButton.classList.add("selectedGameBtn"); //add the computer pressed btn style class
   setTimeout(() => cmptrSelectedButton.classList.remove("selectedGameBtn"), 250); //remove the pressed btn style class after 100ms
   if (playerSelection == computerSelection) return; //if the selections are the same then there is no need to change the scores.
   let winnerChoice = judge(playerSelection, computerSelection); //getting the winner choice
   playerSelection == winnerChoice ? playerScores++ : computerScores++; //determining the winner player of this round and increment of its score
   [playerScoresSpan.innerText, computerScoresSpan.innerText] = [playerScores, computerScores]; // array destructuring
   if (playerScores == scoresToWin || computerScores == scoresToWin) resultMessage();
}

const randomSelection = () => {
   let selections = ["rock", "paper", "scissors"]; //declaration of the choices
   return selections[Math.floor(Math.random() * 3)]; //selecting a random choice
};

const judge = (choice1, choice2) => {
   //defining the relations between the choices & returning the winner choice
   switch (choice1) {
      case "rock":
         return choice2 == "paper" ? choice2 : choice1;
      case "paper":
         return choice2 == "scissors" ? choice2 : choice1;
      case "scissors":
         return choice2 == "rock" ? choice2 : choice1;
   }
};

function resultMessage() {
   let result = playerScores == scoresToWin ? "WINNER" : "LOSER"; // determining who is the winner
   resultBox.textContent = `${result}! ${result === "WINNER" ? "🥳" : "🙁"}`;
   const color = result == "WINNER" ? "green" : "red";
   resultBox.classList.add(color); // make the background color green or red according to the result
   main.style.backgroundColor = color;
   rockButton.removeEventListener("click", playRole); // deactivation the game buttons
   paperButton.removeEventListener("click", playRole);
   scissorsButton.removeEventListener("click", playRole);
}

function fadeIn() {
   layerOpacity += 0.08;
   overlay.style.opacity = layerOpacity;
   main.style.backgroundColor = `rgba(0,0,${(1 - layerOpacity) * 255},1)`;
   if (layerOpacity > 1) return;
   requestAnimationFrame(fadeIn);
}

function fadeOut() {
   layerOpacity -= 0.05;
   overlay.style.opacity = layerOpacity;
   main.style.backgroundColor = `rgba(0,0,${(1 - layerOpacity) * 255},1)`;
   if (layerOpacity < 0.06) return;
   requestAnimationFrame(fadeOut);
}
