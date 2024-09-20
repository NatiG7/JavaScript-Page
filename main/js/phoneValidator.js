"use strict";

// Get elements
const elements = {
    userInput: document.getElementById('user-input4'),
    checkBtn: document.getElementById('check-btn4'),
    clearBtn: document.getElementById('clear-btn4'),
    resultsDiv: document.getElementById('results-div4')
};

// Phone number regex pattern for US numbers
const phoneNumberPattern = /^(?:\+?1\s?)?(\([2-9]\d{2}\)|[2-9]\d{2})[-.\s]?\d{3}[-.\s]?\d{4}$/;

// Function to validate phone number
const validatePhoneNumber = number => phoneNumberPattern.test(number);

// Function to update the UI with validation results
function updateResults(message) {
    elements.resultsDiv.innerText = message;
}

// Check btn
elements.checkBtn.addEventListener('click', () => {
     // Get the trimmed value of the phone number input
    const phoneNumber = elements.userInput.value.trim();
    if (!phoneNumber) return alert('Please provide a phone number');
    
    // Check if the phone number is valid or not and update the results accordingly
    if (validatePhoneNumber(phoneNumber)) {
        updateResults(`Valid US number: ${phoneNumber}`);
    } else {
        updateResults(`Invalid US number: ${phoneNumber}`);
    }
});

// Clear btn
elements.clearBtn.addEventListener('click', () => {
    elements.userInput.value = "";
    updateResults("");
});