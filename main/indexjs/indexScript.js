"use strict";

let variables = {};
//Running code in-page
function runCode() {
    const code = document.getElementById('codeInput').value;
    const output = document.getElementById('consoleOutput');
    try {
        // Clear previous output
        output.innerText = '';
        const originalConsoleLog = console.log;
        console.log = function (...args) {
            originalConsoleLog.apply(console, args);
            const message = args.map(arg => {
                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            }).join(' ');
            output.innerText += message + '\n';
        };
        // Execute the code
        eval(code);
        console.log = originalConsoleLog;
    } catch (e) {
        output.innerText = e.message;
    }
}

//In-page debug.
function debugCode() {
    var code = document.getElementById('codeInput').value
    console.log('Debugging code:')
    console.log(code)
}

