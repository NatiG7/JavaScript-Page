"use strict";
//Parameters
const character = "#";
const count = 18;
let inverted = false;

//Functions
function padRow(rowNumber, rowCount) {
    return (
        " ".repeat(rowCount - rowNumber) +
        character.repeat(2 * rowNumber - 1) +
        " ".repeat(rowCount - rowNumber)
    );
}

function generatePyramid() {
    const rows = [];

    // Generate rows in normal or inverted order
    if (inverted) {
        for (let i = count; i >= 1; i--) {
            rows.push(padRow(i, count));
        }
    } else {
        for (let i = 1; i <= count; i++) {
            rows.push(padRow(i, count));
        }
    }

    // Stack rows
    let result = rows.join("\n");
    document.getElementById("pyramidOutput").textContent = result;
}

function toggleInverted() {
    inverted = !inverted;
    generatePyramid();
}
//Output
window.onload = generatePyramid;