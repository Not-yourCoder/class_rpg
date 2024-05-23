var readlineSync = require("readline-sync");
// Character class
var Character = /** @class */ (function () {
    function Character(name, health, attack_power, defense) {
        this.name = name;
        this.health = health;
        this.attack_power = attack_power;
        this.defense = defense;
    }
    // Method to perform attack
    Character.prototype.attack = function (target) {
        var damage = this.attack_power;
        target.takeDamage(damage);
    };
    Character.prototype.defend = function (target) {
        target.noDamage();
    };
    // Method to defend against attack
    Character.prototype.takeDamage = function (damage) {
        this.health -= damage;
        if (this.health < 0)
            this.health = 0;
    };
    Character.prototype.noDamage = function () {
        return this.health;
    };
    // Method to check if character is alive
    Character.prototype.isAlive = function () {
        return this.health > 0;
    };
    // Method to display health bar
    Character.prototype.displayHealthBar = function () {
        var barLength = 20;
        var remainingHealthPercentage = (this.health / 5) * 100; // Assuming maximum health is 5
        var remainingHealthBarLength = Math.round(remainingHealthPercentage / 100);
        var healthBar = "#".repeat(remainingHealthBarLength);
        var emptyBar = "-".repeat(barLength - remainingHealthBarLength);
        console.log("".concat(this.name, " Health: [").concat(healthBar).concat(emptyBar, "]"));
    };
    return Character;
}());
// Function to perform a battle
function startBattle(player, enemy) {
    console.log("You encounter a ".concat(enemy.name, "!"));
    var counter = 0;
    // Battle loop
    while (player.isAlive() && enemy.isAlive()) {
        // Display health bars
        player.displayHealthBar();
        enemy.displayHealthBar();
        // Prompt player to attack or defend
        var command = readlineSync.question("Type 'attack' to attack: ");
        if (command.toLowerCase() === "attack") {
            player.attack(enemy);
            counter++;
        }
        else {
            console.log("Invalid command!");
            continue;
        }
        if (!enemy.isAlive()) {
            console.log("You defeated the ".concat(enemy.name, "!"));
            break;
        }
        // Enemy's turn
        console.log("\nEnemy's Turn:");
        player.displayHealthBar();
        enemy.displayHealthBar();
        var dodgeCommand = readlineSync.question("".concat(enemy.name, " is attacking... Type 'dodge' to dodge: "));
        if (dodgeCommand.toLowerCase() === "dodge") {
            console.log("You dodged the ".concat(enemy.name, "'s attack!"));
        }
        else {
            enemy.attack(player);
        }
        // Check if player is defeated
        if (!player.isAlive()) {
            console.log("Game over! You were defeated...");
            break;
        }
    }
    // Check battle result
    if (player.isAlive()) {
        console.log("You defeated the ".concat(enemy.name, "!"));
    }
    else {
        console.log("Game over! You were defeated...");
    }
}
// Function to start the game
function startGame() {
    console.log("Welcome to the RPG CLI Game!");
    console.log("Choose your character class:");
    console.log("1. Mage");
    console.log("2. Striker");
    console.log("3. Tank");
    var choice = readlineSync.question("Enter the number of your choice: ");
    var player;
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
    var enemy = new Character("Megadelon", 100, 20, 35);
    startBattle(player, enemy);
}
// Start the game
startGame();
