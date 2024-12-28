"use strict";

// Theme toggle

const themeToggle = document.querySelector('#theme-toggle');

const applyTheme = theme => {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }
}
// Initialize theme based on localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  // Theme toggle event listener
  themeToggle.addEventListener("click", () => {
      const currentTheme = localStorage.getItem("theme");
      applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
});

// Player stats and inv
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// HTML Elements
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Weapons array
const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];

// Monsters Array
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];

// Locations that the player can visit
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number below. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

// initialize buttons for town
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Function to update UI on locatio change
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

// Functions to navigate between locations
function goTown() {
  update(locations[0]);
}
function goStore() {
  update(locations[1]);
}
function goCave() {
  update(locations[2]);
}

// Buying HP in store
function buyHealth() {
  if (gold >= 10) { // Check if the player has enough gold
    gold -= 10; // Deduct 10 gold
    health += 10; // Increase health by 10
    goldText.innerText = gold; // Update the displayed gold amount
    healthText.innerText = health; // Update the displayed health
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

// Buying weapon in store
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) { // Check if the player can upgrade the weapon
    if (gold >= 30) { // Check if the player has enough gold
      gold -= 30; // Deduct 30 gold
      currentWeapon++; // Upgrade to the next weapon
      goldText.innerText = gold; // Update displayed gold
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

// Sell a weapon in store
function sellWeapon() {
  if (inventory.length > 1) { // Check if the player has more than one weapon
    gold += 15; // Add 15 gold for selling the weapon
    goldText.innerText = gold; // Update displayed gold
    let currentWeapon = inventory.shift(); // Remove the first weapon in the inventory
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// Fight monsters
function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}
function fightDragon() {
  fighting = 2;
  goFight();
}

// Set up fight with current monster
function goFight() {
  update(locations[3]); // Update the game location to the fight scene
  monsterHealth = monsters[fighting].health; // Set the monster's health
  monsterStats.style.display = "block"; // Display monster stats
  monsterName.innerText = monsters[fighting].name; // Display monster name
  monsterHealthText.innerText = monsterHealth; // Display monster health
}

// Function to handle the attack logic
function attack() {
  // Attack messages
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  // HP and Damage logic
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  // Fight end logic
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  // Weapon break chance
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

// Function to calculate the monster's attack value
function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp); // Calculate hit value
  console.log(hit); // Log hit value for debugging
  return hit > 0 ? hit : 0; // Return hit value if positive, otherwise return 0
}

// Function to determine if the monster's attack hits
function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

// Function to handle dodging attacks
function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

// Function to handle monster defeat
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7); // Increase gold based on monster level
  xp += monsters[fighting].level; // Increase experience points based on monster level
  goldText.innerText = gold; // Update gold display
  xpText.innerText = xp; // Update experience points display
  update(locations[4]); // Update location to the post-defeat scene
}

// Lose win and restart
function lose() {
  update(locations[5]);
}
function winGame() {
  update(locations[6]);
}
function restart() {
  // Resets the game to default values :
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

// Minigame
function easterEgg() {
  update(locations[7]);
}
function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}

// Function to handle picking a number and checking if it matches a randomly generated list
function pick(guess) {
  const numbers = []; // Array to store random numbers
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11)); // Generate random numbers between 0 and 10
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n"; // Display picked number
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n"; // Display random numbers
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!"; // Correct guess message
    gold += 20; // Increase gold
    goldText.innerText = gold; // Update gold display
  } else {
    text.innerText += "Wrong! You lose 10 health!"; // Incorrect guess message
    health -= 10; // Decrease health
    healthText.innerText = health; // Update health display
    if (health <= 0) {
      lose(); // Call lose function if health is 0 or less
    }
  }
}

// Function to update the UI with current stats
function updateStats(xp, health, gold) {
  document.getElementById("xpText").textContent = xp;
  document.getElementById("xpFill").style.width = xp + "%"; // Adjust based on the XP cap
  document.getElementById("healthText").textContent = health;
  document.getElementById("healthFill").style.width = health + "%"; // Assuming health is percentage-based
  document.getElementById("goldText").textContent = gold;
  document.getElementById("goldFill").style.width = (gold / 100) + "%"; // Adjust to make gold proportional
}