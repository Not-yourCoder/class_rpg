var readlineSync = require("readline-sync");

// Character class
class Character {
  name: string;
  health: number;
  attack_power: number;
  defense: number;

  constructor(
    name: string,
    health: number,
    attack_power: number,
    defense: number
  ) {
    this.name = name;
    this.health = health;
    this.attack_power = attack_power;
    this.defense = defense;
  }

  // Method to perform attack
  attack(target: Character) {
    const damage = this.attack_power;
    target.takeDamage(damage);
  }
  defend(target: Character) {
    target.noDamage();
  }

  // Method to defend against attack

  takeDamage(damage: number) {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }
  noDamage() {
    return this.health;
  }

  // Method to check if character is alive
  isAlive() {
    return this.health > 0;
  }

  // Method to display health bar
  displayHealthBar() {
    const barLength = 20;
    const remainingHealthPercentage = (this.health / 5) * 100; // Assuming maximum health is 5
    const remainingHealthBarLength = Math.round(
      remainingHealthPercentage / 100
    );

    const healthBar = "#".repeat(remainingHealthBarLength);
    const emptyBar = "-".repeat(barLength - remainingHealthBarLength);
    console.log(`${this.name} Health: [${healthBar}${emptyBar}]`);
  }
}

// Function to perform a battle
async function startBattle(player: Character, enemy: Character) {
  console.log(`You encounter a ${enemy.name}!`);
  let counter = 0;

  // Battle loop
  while (player.isAlive() && enemy.isAlive()) {
    // Display health bars
    player.displayHealthBar();
    enemy.displayHealthBar();

    // Prompt player to attack or defend
    const command = readlineSync.question(`Type 'attack' to attack: `);

    if (command.toLowerCase() === "attack") {
      player.attack(enemy);
      counter++;
    } else {
      console.log("Invalid command!");
      continue;
    }
    if (!enemy.isAlive()) {
      console.log(`You defeated the ${enemy.name}!`);
      break;
    }
    // Enemy's turn
    if (counter === 2 && enemy.isAlive()) {
      console.log(
        `${enemy.name} is preparing to attack! Type 'dodge' to dodge the attack.`
      );
      const dodged = await waitForDodge(5000); // 5 seconds to dodge
      if (!dodged) {
        enemy.attack(player);
        console.log(`${enemy.name} attacked ${player.name}!`);
      } else {
        console.log(`${player.name} dodged the attack!`);
      }
      counter = 0;
    }
  }

  // Check battle result
  if (player.isAlive()) {
    console.log(`You defeated the ${enemy.name}!`);
  } else {
    console.log("Game over! You were defeated...");
  }
}
function waitForDodge(timeout: number) {
  return new Promise((resolve) => {
    let dodged = false;

    // Set a timeout to resolve the promise as false if no input is received
    const timer = setTimeout(() => {
      resolve(false);
    }, timeout);

    // Function to capture user input
    function getInput() {
      const command = readlineSync.question("Type 'dodge' to dodge: ");
      if (command.toLowerCase() === "dodge") {
        dodged = true;
        clearTimeout(timer); // Clear the timer
        resolve(true); // Resolve the promise as true
      } else {
        console.log("Invalid command! Try again.");
        getInput(); // Recursively get input again
      }
    }

    // Start getting input from the user
    getInput();
  });
}

// Function to start the game
function startGame() {
  console.log("Welcome to the RPG CLI Game!");
  console.log("Choose your character class:");
  console.log("1. Mage");
  console.log("2. Striker");
  console.log("3. Tank");

  const choice = readlineSync.question("Enter the number of your choice: ");

  let player;
  switch (choice) {
    case "1":
      player = new Character("Mage", 100, 12, 10);
      break;
    case "2":
      player = new Character("Striker", 100, 40, 30);
      break;
    case "3":
      player = new Character("Tank", 100, 15, 80);
      break;
    default:
      console.log("Invalid choice! Exiting game...");
      return;
  }

  const enemy = new Character("Megadelon", 100, 20, 35);

  startBattle(player, enemy);
}

// Start the game
startGame();
