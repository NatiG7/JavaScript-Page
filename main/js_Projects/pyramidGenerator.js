"use strict";

// Parameters
const character = "#";  // Was based on # chars before.
const count = 10;  // Number of rows in the pyramid
let inverted = false;  // Inversion control
const brickWidth = 40;  // Width of the brick
const brickHeight = 20;  // Height of the brick
const padding = 5;  // Space between bricks

// Set up the stage for Konva.js canvas
function createPyramidStage() {
    // Get container size
    const container = document.getElementById("pyramidOutput");
    const stageWidth = container.clientWidth;
    const stageHeight = container.clientHeight;

    // Create a new stage
    const stage = new Konva.Stage({
        container: 'pyramidOutput',  // Target the pyramidOutput div
        width: stageWidth,
        height: stageHeight,
    });

    // Add a layer to the stage
    const layer = new Konva.Layer();
    stage.add(layer);

    return { stage, layer, stageWidth, stageHeight };
}

// Create a brick
function createBrick(x, y, layer) {
    const brick = new Konva.Rect({
        x: x,
        y: y,
        width: brickWidth,
        height: brickHeight,
        fill: 'tan',  // Brick color
        stroke: 'brown',  // Border for bricks
        strokeWidth: 2,
    });

    // Add brick to the layer
    layer.add(brick);
}

// Generate the pyramid rows
function generatePyramid() {
    const { stage, layer } = createPyramidStage();  // Create the stage and layer
    
    const rows = [];
    
    if (inverted) {
        for (let i = count; i >= 1; i--) {
            rows.push(i);  // Inverted order
        }
    } else {
        for (let i = 1; i <= count; i++) {
            rows.push(i);  // Normal order
        }
    }

    let currentRow = 0;  // Track the current row being drawn
    const rowDelay = 800;  // Delay between rows in milliseconds

    function drawRow() {
        if (currentRow < rows.length) {
            const rowNumber = rows[currentRow];
            const rowWidth = rowNumber * (brickWidth + padding);  // Calculate total row width
            
            // Position each brick in the center
            for (let j = 0; j < rowNumber; j++) {
                const xPosition = (layer.width() - rowWidth) / 2 + j * (brickWidth + padding);  // X-position
                const yPosition = currentRow * (brickHeight + padding) + 350;  // Y-position

                // Create and add a brick
                createBrick(xPosition, yPosition, layer);
            }
            
            layer.batchDraw();
            currentRow++;
        }
    }

    // Initial call to draw the first row
    drawRow();

    // Use setInterval to call drawRow periodically
    const intervalId = setInterval(() => {
        if (currentRow < rows.length) {
            drawRow();
        } else {
            clearInterval(intervalId);  // Stop the interval when all rows are drawn
        }
    }, rowDelay);  // Call drawRow every rowDelay milliseconds
}


// Toggle between normal and inverted pyramids
function toggleInverted() {
    inverted = !inverted;
    generatePyramid();  // Regenerate the pyramid with the new orientation
}

const clearPyramid = () => {
    const container = document.getElementById("pyramidOutput");
    container.innerHTML = '';
}