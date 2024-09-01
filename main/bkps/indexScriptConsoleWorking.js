"use strict";

let variables = {};

const updateVariableTracker = () => {
    const trackerDiv = document.getElementById('variable-tracker');
    trackerDiv.innerHTML = "";
    for (let name in variables){
        let displayValue;
        if (typeof variables[name] === 'object') {
            displayValue = JSON.stringify(variables[name]);
        } else {
            displayValue = String(variables[name]);
        }
        trackerDiv.innerHTML += `<p>${name} : ${displayValue}</p>`
    }
}

//Running code in-page
function runCode() {
    const code = document.getElementById('codeInput').value;
    const output = document.getElementById('consoleOutput');
    const trackerDiv = document.getElementById('variable-tracker');
    try {
        // Clear previous output
        output.innerText = '';
        trackerDiv.innerHTML = '';
        variables = {};
        const originalConsoleLog = console.log;
        console.log = function (...args) {
            originalConsoleLog.apply(console, args);
            const message = args.map(arg => {
                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            }).join(' ');
            output.innerText += message + '\n';
        };
        const instrumentedCode = code.replace(/var\s+(\w+)\s*=\s*(.+);/g, (match, p1, p2) => {
            return `var ${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(/let\s+(\w+)\s*=\s*(.+);/g, (match, p1, p2) => {
            return `let ${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(/const\s+(\w+)\s*=\s*(.+);/g, (match, p1, p2) => {
            return `const ${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(/(\w+)\s*=\s*(.+);/g, (match, p1, p2) => {
            return `${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(/(\w+)\.(\w+)\s*=\s*(.+);/g, (match, p1, p2, p3) => {
            return `${p1}.${p2} = ${p3}; if (variables['${p1}']) { variables['${p1}'] = ${p1}; } updateVariableTracker();`;
        });
        // Execute the code
        eval(instrumentedCode);
        console.log = originalConsoleLog;
    } catch (e) {
        output.innerText = e.message;
    }
}

//In-page debug.
function debugCode() {
    var code = document.getElementById('codeInput').value
    console.log('Debugging code:')
    console.log("ToDo, sorry.");
}