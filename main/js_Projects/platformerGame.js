"use strict";

//HTML Elements
const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");

// Canvas for drawing with its parameters
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.5;
let isCheckpointCollisionDetectionActive = true;

// Function to adjust size proportionally to the window height
const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
}

// Player class to manage player's properties and movement
class Player {
    constructor() {
        // Initial position
        this.position = {
            x: proportionalSize(10),
            y: proportionalSize(400),
        };
        // Initial speed
        this.velocity = {
            x: 0,
            y: 0,
        };
        // Player size
        this.width = proportionalSize(40);
        this.height = proportionalSize(40);
    }
    // Method to draw the player on the canvas
    draw() {
        ctx.fillStyle = "#99c9ff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Method to update player's position and velocity
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Gravity and boundary checks for player's vertical movement
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            if (this.position.y < 0) {
                this.position.y = 0; // Prevent the player from moving above the canvas
                this.velocity.y = gravity; // Apply grav
            }
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0; // Stop player when hitting ground
        }

        // Prevent player from moving off the left side of the screen lol
        if (this.position.x < this.width) {
            this.position.x = this.width;
        }

        // Prevent player from moving off the right side of the screen lol
        if (this.position.x >= canvas.width - this.width * 2) {
            this.position.x = canvas.width - this.width * 2;
        }
    }
}

// Platform class to represent platforms the player can land on
class Platform {
    constructor(x, y) {
        this.position = {
            x,
            y,
        };
        this.width = 200;
        this.height = proportionalSize(40);
    }
    draw() {
        ctx.fillStyle = "#95a5a6";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// CheckPoint class to manage checkpoint properties
class CheckPoint {
    constructor(x, y, z) {
        this.position = {
            x,
            y,
        };
        this.width = proportionalSize(40);
        this.height = proportionalSize(70);
        this.claimed = false;
    };

    draw() {
        ctx.fillStyle = "#f39c12";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    claim() {
        this.width = 0;
        this.height = 0;
        this.position.y = Infinity;
        this.claimed = true;
    }
};

// Instantiate a new player
const player = new Player();

// Positions for platforms
const platformPositions = [
    { x: 500, y: proportionalSize(300) },
    { x: 750, y: proportionalSize(270) },
    { x: 1000, y: proportionalSize(240) },
    { x: 1300, y: proportionalSize(210) },
    { x: 1600, y: proportionalSize(180) },
    { x: 1900, y: proportionalSize(150) },
    { x: 2200, y: proportionalSize(120) },
    { x: 2500, y: proportionalSize(150) },
    { x: 2800, y: proportionalSize(180) },
    { x: 3100, y: proportionalSize(210) },
    { x: 3400, y: proportionalSize(240) },
    { x: 3700, y: proportionalSize(270) },
    { x: 4000, y: proportionalSize(300) },
    { x: 4300, y: proportionalSize(330) },
    { x: 4600, y: proportionalSize(360) },
    { x: 4900, y: proportionalSize(390) },
    { x: 5200, y: proportionalSize(420) },
    { x: 5500, y: proportionalSize(450) },
    { x: 5800, y: proportionalSize(420) },
    { x: 6100, y: proportionalSize(390) },
    { x: 6400, y: proportionalSize(360) },
    { x: 6700, y: proportionalSize(330) },
    { x: 7000, y: proportionalSize(300) },
    { x: 7300, y: proportionalSize(270) },
    { x: 7600, y: proportionalSize(240) },
    { x: 7900, y: proportionalSize(210) },
    { x: 8200, y: proportionalSize(180) },
    { x: 8500, y: proportionalSize(150) },
    { x: 8800, y: proportionalSize(120) },
    { x: 9100, y: proportionalSize(150) },
    { x: 9400, y: proportionalSize(180) },
    { x: 9700, y: proportionalSize(210) },
    { x: 10000, y: proportionalSize(240) },
    { x: 10300, y: proportionalSize(270) },
    { x: 10600, y: proportionalSize(300) },
    { x: 10900, y: proportionalSize(330) },
    { x: 11200, y: proportionalSize(360) },
    { x: 11500, y: proportionalSize(390) },
    { x: 11800, y: proportionalSize(420) },
    { x: 12100, y: proportionalSize(450) },
    { x: 12400, y: proportionalSize(420) },
    { x: 12700, y: proportionalSize(390) },
    { x: 13000, y: proportionalSize(360) },
    { x: 13300, y: proportionalSize(330) },
    { x: 13600, y: proportionalSize(300) },
];

// Create Platform objects for each position
const platforms = platformPositions.map(
    (platform) => new Platform(platform.x, platform.y)
);

// Positions for checkpoints
const checkpointPositions = [
    { x: 1170, y: proportionalSize(80), z: 1 },
    { x: 2900, y: proportionalSize(330), z: 2 },
    { x: 4800, y: proportionalSize(80), z: 3 },
    { x: 3800, y: proportionalSize(250), z: 4 },
    { x: 5400, y: proportionalSize(200), z: 5 }
];

// Create CheckPoint objects for each position
const checkpoints = checkpointPositions.map(
    (checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z)
);

// Function to animate the game
const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all platforms
    platforms.forEach((platform) => {
        platform.draw();
    });
    // Draw all checkpoints
    checkpoints.forEach(checkpoint => {
        checkpoint.draw();
    });
    // Update player pos' and draw
    player.update();

    // Move to the right (right arrow)
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
        player.velocity.x = 5;
        // Move the the left (left arrow)
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
        player.velocity.x = -5;
        // Stop on noKey
    } else {
        player.velocity.x = 0;

        // Move platforms and checkpoints when the right key is pressed
        if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {
            // Platform moves left
            platforms.forEach((platform) => {
                platform.position.x -= 5;
            });

            // Checkpoint moves left
            checkpoints.forEach((checkpoint) => {
                checkpoint.position.x -= 5;
            });

            // Move platforms and checkpoints when the left key is pressed
        } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
            // Platform moves right
            platforms.forEach((platform) => {
                platform.position.x += 5;
            });

            // Checkpoint moves right
            checkpoints.forEach((checkpoint) => {
                checkpoint.position.x += 5;
            });
        }
    }

    // Platform collision detection
    platforms.forEach((platform) => {
        const collisionDetectionRules = [
            player.position.y + player.height <= platform.position.y, // Player is above the platform
            player.position.y + player.height + player.velocity.y >= platform.position.y, // Player is falling onto the platform
            player.position.x >= platform.position.x - player.width / 2, // Player is within the platform's left edge
            player.position.x <= platform.position.x + platform.width - player.width / 3, // Player is within the platform's right edge
        ];

        if (collisionDetectionRules.every((rule) => rule)) {
            player.velocity.y = 0; // Player lands on plat
            return;
        }

        // Collision detection for hitting the side or bottom of the platform
        const platformDetectionRules = [
            player.position.x >= platform.position.x - player.width / 2, // Player is within the platform's left edge
            player.position.x <= platform.position.x + platform.width - player.width / 3, // Player is within the platform's right edge
            player.position.y + player.height >= platform.position.y, // Player is at or below the platform
            player.position.y <= platform.position.y + platform.height, // Player is above the platform
        ];

        if (platformDetectionRules.every(rule => rule)) {
            player.position.y = platform.position.y + player.height; // Move player above the platform
            player.velocity.y = gravity; // Apply grav
        };
    });

    // Checkpoint collision detection
    checkpoints.forEach((checkpoint, index, checkpoints) => {
        const checkpointDetectionRules = [
            player.position.x >= checkpoint.position.x, // Player passes the checkpoint horizontally
            player.position.y >= checkpoint.position.y, // Player is at or below the checkpoint
            player.position.y + player.height <= checkpoint.position.y + checkpoint.height, // Player is within the vertical bounds of the checkpoint
            isCheckpointCollisionDetectionActive, // Ensure checkpoint collision is active
            player.position.x - player.width <= checkpoint.position.x - checkpoint.width + player.width * 0.9, // Player is within range to claim checkpoint
            index === 0 || checkpoints[index - 1].claimed === true, // Only activate if previous checkpoint was claimed
        ];

        // If all checkpoint detection rules are met, claim the checkpoint
        if (checkpointDetectionRules.every((rule) => rule)) {
            checkpoint.claim();

            // If the last checkpoint is reached, deactivate further checkpoint detection
            if (index === checkpoints.length - 1) {
                isCheckpointCollisionDetectionActive = false;
                showCheckpointScreen("You reached the final checkpoint!");
                movePlayer("ArrowRight", 0, false);
            }
            // Show message for reaching a checkpoint
            else if (player.position.x >= checkpoint.position.x && player.position.x <= checkpoint.position.x + 40) {
                showCheckpointScreen("You reached a checkpoint!")
            }
        };
    });
}

// Key states for movement
const keys = {
    rightKey: {
        pressed: false
    },
    leftKey: {
        pressed: false
    }
};

// Move the player based on key press and velocity
const movePlayer = (key, xVelocity, isPressed) => {
    if (!isCheckpointCollisionDetectionActive) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        return;
    }

    // Switch case for different key inputs
    switch (key) {
        case "ArrowLeft":
            keys.leftKey.pressed = isPressed; // Track left key press state
            if (xVelocity === 0) {
                player.velocity.x = xVelocity; // Stop horizontal movement
            }
            player.velocity.x -= xVelocity; // Move player to the left
            break;
        case "ArrowUp":
        case " ":
        case "Spacebar":
            player.velocity.y -= 8; // Apply upward velocity for jumping
            break;
        case "ArrowRight":
            keys.rightKey.pressed = isPressed; // Track right key press state
            if (xVelocity === 0) {
                player.velocity.x = xVelocity; // Stop horizontal movement
            }
            player.velocity.x += xVelocity; // Move player to the right
    }
}

// Start the game by showing the canvas and hiding the start screen
const startGame = () => {
    canvas.style.display = "block";
    startScreen.style.display = "none";
    animate();
}

// Show checkpoint screen with message
const showCheckpointScreen = (msg) => {
    checkpointScreen.style.display = "block";
    checkpointMessage.textContent = msg;
    if (isCheckpointCollisionDetectionActive) {
        setTimeout(() => (checkpointScreen.style.display = "none"), 2000);
    }
};

//Listeners

// Start game button
startBtn.addEventListener('click', () => {
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.return-home-container').style.display = 'none'; // Hide return home button
    document.getElementById('canvas').style.display = 'block';
    startGame(); // Your game initialization function
});

// Key press
    // Move player
window.addEventListener("keydown", ({ key }) => {
    movePlayer(key, 8, true);
});
    // Stop player
window.addEventListener("keyup", ({ key }) => {
    movePlayer(key, 0, false);
});
