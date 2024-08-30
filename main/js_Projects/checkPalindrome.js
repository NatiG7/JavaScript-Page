"use strict";

function checkPalindrome() {
    let input = document.getElementById('inputText')
        .value.trim();
    if (input === '') {
        alert("Please input a value");
        return;
    }
    console.log(input);
    let result = document.getElementById('palindromeResult');
    let leftLetter = 0;
    let checkedWord = input.toLowerCase()
        .replace(/[^a-z0-9]/g, "");
    let rightLetter = checkedWord.length - 1;
    console.log(checkedWord);

    let isPalindrome = true;
    while (leftLetter < rightLetter) {
        console.log(`Comparing ${checkedWord[leftLetter]} and ${checkedWord[rightLetter]}`);
        if (checkedWord[leftLetter] !== checkedWord[rightLetter]) {
            isPalindrome = false;
            break;
        }
        leftLetter++;
        rightLetter--;
    }
    isPalindrome ? result.innerText = `${input} is a palindrome` : result.innerText = `${input} is not a palindrome`;

}
document.getElementById('check-btn').addEventListener('click', checkPalindrome);
document.getElementById('inputText').addEventListener('keydown', (e) => {
    if (e.key === "Enter")
        checkPalindrome();
});