const numberInput = document.getElementById("number-input");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("result");
const animationContainer = document.getElementById("animation-container");

// Data for animation
const animationData = [
    {
        inputVal: 1, // position / index
        digit: 1, // the digit
        msg: 1, // the text
        addElDelay: 500
    }
];

//Logic functions

// Converting decimal to binary
const decimalToBinary = (input) => {
    if (input === 0 || input === 1) {
        return String(input);
    } else {
        return decimalToBinary(Math.floor(input / 2)) + (input % 2);
    }
};

// Validate user input and convert
const checkUserInput = () => {
    const inputInt = parseInt(numberInput.value);
    if (!numberInput.value || isNaN(inputInt) || inputInt < 0) {
        alert("Please provide a decimal number greater than or equal to 0");
        return;
    }
    const binaryNumber = decimalToBinary(inputInt);
    const binaryDigits = binaryNumber.split("");
    showAnimation(binaryDigits);
    numberInput.value = "";
};

//Animation function

//Display binary digits
const showAnimation = (binaryDigits) => {
    result.innerHTML = "";
    let accumulatedDelay = 0;
    binaryDigits.forEach((digit, index) => {
        const obj = animationData[index];
        const customDelay = obj ? obj.addElDelay : 300;
        setTimeout(() => {
            // Display the current digit one by one
            result.innerHTML +=
                `
                <span class="animation-frame">${digit}</span>
                `
        }, accumulatedDelay);
        accumulatedDelay += customDelay; // Increase delay for next digit
    });
};

// Listeners

// Convert button
convertBtn.addEventListener("click", checkUserInput);

// Enter key press
numberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkUserInput();
    };
});

// HTML Template of index.html
const indexHtml =
`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Decimal to Binary Converter</title>
            <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
            <h1>Decimal to Binary Converter</h1>
            <div class="input-container">
                <label for="number-input">Enter a decimal number:</label>
                <input>
                    value=""
                    type="number"
                    name="decimal number input"
                    id="number-input"
                    class="number-input"
                </input>
                <button class="convert-btn" id="convert-btn">Convert</button>
            </div>
            <output id="result" for="number-input"></output>
            <div id="animation-container"></div>
            <script src="script.js"></script>
        </body>
    </html>
`