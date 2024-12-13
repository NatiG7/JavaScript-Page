"use strict";

// HTML Elements
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

// Function to clean the input string by removing '+' and '-' symbols and spaces
function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

// Function to check if the input contains invalid scientific notation (e.g., 1e10)
function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

// Function to add new entry fields dynamically to the selected meal section
function addEntry() {
    // Get the container for the selected meal type
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    // Count how many entry fields are already present and increment for the new entry
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    // Create the HTML string for new entry name and calories input fields
    const HTMLString = `
        <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
        <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
        <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
        <input
        type="number"
        min="0"
        id="${entryDropdown.value}-${entryNumber}-calories"
        placeholder="Calories"/>
        `;
    // Insert the new entry fields at the end of the input container
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

// Function to calculate the total calories based on user input
function calculateCalories(e) {
    e.preventDefault();
    isError = false;

    // Select all the number inputs for each meal and exercise sections
    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    // Get the calorie totals for each meal section and exercise
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    // If there was an error in input validation, stop further calculations
    if (isError) {
        return;
    }

    // Calculate total consumed and remaining calories
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    // Determine if the result is a surplus or deficit
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
    // Display the result with formatted calorie counts and classification (surplus or deficit)
    output.innerHTML = `
        <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
        <hr>
        <p>${budgetCalories} Calories Budgeted</p>
        <p>${consumedCalories} Calories Consumed</p>
        <p>${exerciseCalories} Calories Burned</p>
    `;
    // Show the output by removing the 'hide' class
    output.classList.remove('hide');
}

// Function to extract and sum the calories from a list of input fields
function getCaloriesFromInputs(list) {
    let calories = 0;

    // Loop through each input field in the provided list
    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);

        // If an invalid input is found, alert the user and stop further processing
        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        // Add the valid input value to the total calories
        calories += Number(currVal);
    }
    return calories;
}

// Function to clear all form inputs and reset the form
function clearForm() {
    // Get all containers that hold the input fields for each meal section
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));

    // Loop through each container and clear its inner HTML (remove all input fields)
    for (const container of inputContainers) {
        container.innerHTML = '';
    }

    // Reset the budget input field and the output display
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

// Event Listeners

// Add Entry button
addEntryButton.addEventListener("click", addEntry);

// Submit button
calorieCounter.addEventListener("submit", calculateCalories);

// Clear button
clearButton.addEventListener('click', clearForm);