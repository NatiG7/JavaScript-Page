// Theme toggling functionality
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Get elements
const elements = {
    userInput: document.getElementById('user-input'),
    checkBtn: document.getElementById('check-btn'),
    clearBtn: document.getElementById('clear-btn'),
    resultsDiv: document.getElementById('results-div')
};

// Refined phone number regex pattern for US numbers
const phoneNumberPattern = /^(?:\+?1\s?)?(\([2-9]\d{2}\)|[2-9]\d{2})[-.\s]?\d{3}[-.\s]?\d{4}$/;

// Function to validate phone number
const validatePhoneNumber = number => phoneNumberPattern.test(number);

// Function to update the UI with validation results
function updateResults(message) {
    elements.resultsDiv.textContent = message;
}

// Check btn
elements.checkBtn.addEventListener('click', () => {
    const phoneNumber = elements.userInput.value.trim();
    if (!phoneNumber) return alert('Please provide a phone number');
    
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