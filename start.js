const fs = require("fs");

const readline = require("readline");
const file = require("./util/file");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestions(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function randomNumber() {
  const number = Math.floor(Math.random() * 100) + 1;
  return number;
}

const difficultyOrder = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

async function main() {
  console.log(
    `\nWelcome to the Number Guessing Game! \nI'm thinking of a number between 1 and 100. \nYou have 5 chances to guess the correct number.\n`
  );

  console.log("Please select the difficulty level:");
  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)\n");

  let choice;
  do {
    choice = await askQuestions("Enter your choice: ");
    choice = +choice;
    if (isNaN(choice) || 0 >= choice || choice > 3) {
      console.log("Please, chose a difficulty between 1 - 3\n");
    }
  } while (isNaN(choice) || 0 >= choice || choice > 3);

  let chances;
  let dif;

  if (choice === 1) {
    dif = "Easy";
    chances = 10;
  } else if (choice === 2) {
    dif = "Medium";
    chances = 5;
  } else if (choice === 3) {
    dif = "Hard";
    chances = 3;
  } else {
    console.log("Invalid difficulty");
    process.exit(1);
  }

  console.log(
    `\nGreat! You have selected the ${dif} difficulty level. \nLet's start the game!\n`
  );

  const number = randomNumber();
  let attempts = 0;
  const startTime = new Date();

  while (chances > 0) {
    let guess;
    do {
      guess = await askQuestions("Enter your guess: ");
      guess = +guess;
      if (isNaN(guess) || 0 >= guess || guess > 100) {
        console.log("Please, enter a number between 1 - 100\n");
      }
    } while (isNaN(guess) || 0 >= guess || guess > 100);
    attempts++;
    if (guess.toString() === number.toString()) {
      const endTime = new Date();
      const time = (endTime - startTime) / 1000;
      console.log(
        `Congratulations! You guessed the correct number in ${attempts} attempts.\nYour time to guess this number was ${time} seconds.\n`
      );
      if (fs.existsSync("./score.json")) {
        const data = await file.readJSON();
        const score = {
          difficulty: dif,
          attempts: attempts,
        };
        data.score.push(score);
        data.score.sort((a, b) => {
          if (difficultyOrder[a.difficulty] > difficultyOrder[b.difficulty]) {
            return -1;
          }
          if (difficultyOrder[a.difficulty] < difficultyOrder[b.difficulty]) {
            return 1;
          }
          if (a.attempts < b.attempts) {
            return -1;
          }
          if (a.attempts > b.attempts) {
            return 1;
          }
        });
        await file.writeJSON(data);
      } else {
        const score = {
          difficulty: dif,
          attempts: attempts,
        };
        await file.writeJSON({ score: [score] });
      }
      break;
    }

    if (chances === 1) {
      console.log(`Sorry, you run out of chanches!\n`);
      console.log(`The number was ${number}\n`);
      break;
    }

    let compare = guess < number ? "greater" : "less";
    console.log(`Incorrect! The number is ${compare} than ${guess}.\n`);
    chances--;
  }

  let playAgain;
  do {
    playAgain = await askQuestions(
      "Would you like to play again? (yes or no): "
    );
    playAgain = playAgain.toLowerCase();
  } while (playAgain !== "yes" && playAgain !== "no");
  if (playAgain === "yes") {
    await main();
  } else {
    const data = await file.readJSON();
    console.log("\nThanks for playing\n");
    console.log("---------ScoreBoard----------\n");
    console.log("Difficulty        Attempts\n");

    data.score.forEach((score) => {
      const dif = score.difficulty.padEnd(9);
      const att = String(score.attempts).padStart(12);

      console.log(`${dif} ${att}`);
    });
  }

  rl.close();
}

main();
