"use strict";

// Check if input is a palindrome
function checkPalindrome() {

    // Get input value from document and trim
    let input = document.getElementById('inputText')
        .value.trim();
    if (input === '') {
        alert("Please input a value");
        return;
    }
    console.log(input);
    let result = document.getElementById('palindromeResult');
    // Initialize pointers for comparison (left and right ends of the string)
    let leftLetter = 0;
    // Convert the input to lowercase and remove non-alphanumeric characters
    let checkedWord = input.toLowerCase()
        .replace(/[^a-z0-9]/g, "");
    // Set the right pointer to the last character of the cleaned input
    let rightLetter = checkedWord.length - 1;
    console.log(checkedWord);

    // Flag to check
    let isPalindrome = true;
    while (leftLetter < rightLetter) {
        console.log(`Comparing ${checkedWord[leftLetter]} and ${checkedWord[rightLetter]}`);
        // If characters don't match, set the flag to false and break the loop
        if (checkedWord[leftLetter] !== checkedWord[rightLetter]) {
            isPalindrome = false;
            break;
        }
        // Move the pointers towards the center
        leftLetter++;
        rightLetter--;
    }
    // Display the result in the page based on whether the word is a palindrome
    isPalindrome ? result.innerText = `${input} is a palindrome` : result.innerText = `${input} is not a palindrome`;

}

function clearFields() {
    // Clear input and output fields
    let input = document.getElementById('inputText');
    let result = document.getElementById('palindromeResult');
    input.value = '';
    result.innerText = '';
}
// Event Listeners

// Check button
document.getElementById('check-btn').addEventListener('click', checkPalindrome);

document.getElementById('clear-btn-palindrome').addEventListener('click',clearFields);
// Enter key press
document.getElementById('inputText').addEventListener('keydown', (e) => {
    if (e.key === "Enter")
        checkPalindrome();
});