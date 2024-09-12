// HTML Elements
const numberInput2 = document.getElementById("number-input2");
const convertBtn2 = document.getElementById("convert-btn2");
const result2 = document.getElementById("result2");


// Number conversion function
const decimalToRomanNumber = (num) => {

    //Array of roman numeral symbols and their values
    const romanNumerals = [
        { symbol: 'M', value: 1000 },
        { symbol: 'CM', value: 900 },
        { symbol: 'D', value: 500 },
        { symbol: 'CD', value: 400 },
        { symbol: 'C', value: 100 },
        { symbol: 'XC', value: 90 },
        { symbol: 'L', value: 50 },
        { symbol: 'XL', value: 40 },
        { symbol: 'X', value: 10 },
        { symbol: 'IX', value: 9 },
        { symbol: 'V', value: 5 },
        { symbol: 'IV', value: 4 },
        { symbol: 'I', value: 1 }
    ];
    let romanNum = "";
    // Conversion from decimal to roman
    for (const { symbol, value } of romanNumerals) {
        while (num >= value) {
            romanNum += symbol;
            num -= value;
        }
    }
    return romanNum;
};

// Input validation and conversion
const checkUserInputRoman = () => {

    // Parsing user input
    const inputInt = parseInt(numberInput2.value);

    // Validation
    if (!numberInput2.value || isNaN(inputInt)) {
        return result2.innerHTML = "Please enter a valid number";
    } else if (inputInt < 1) {
        return result2.innerHTML = "Please enter a number greater than or equal to 1";
    } else if (inputInt >= 4000) {
        return result2.innerHTML = "Please enter a number less than or equal to 3999";
    } else {

        // Conversion to Roman and animation
        const romanNumber = decimalToRomanNumber(inputInt);
        const romanDigits = romanNumber;
        showAnimationRoman(romanDigits);
    }
    numberInput2.value = ""; // Clear input field
};

// Animation function
const showAnimationRoman = (romanNumber) => {
    result2.innerHTML = "";
    let index = 0;
    // Display Roman numeral one character at a time
    const interval = setInterval(() => {
        if (index < romanNumber.length){
            result2.innerHTML += romanNumber[index];
            index++;
        }else {
            clearInterval(interval);
        }
    },300)
};

// Event listeners

// Convert button
convertBtn2.addEventListener("click", checkUserInputRoman);

// Enter key press
numberInput2.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkUserInputRoman();
    }
})