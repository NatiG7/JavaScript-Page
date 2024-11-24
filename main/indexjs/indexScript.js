"use strict";

let variables = {};

const updateVariableTracker = () => {
    const trackerDiv = document.getElementById("variable-tracker");
    trackerDiv.innerHTML = Object.entries(variables)
        .map(([name, value]) => {
            let displayValue = typeof value === "object" ? JSON.stringify(value) : String(value);
            return `<p>${name} : ${displayValue}</p>`;
        })
        .join("");
};

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
        //#Regex
        const varRegex = /var\s+(\w+)\s*=\s*(.+?);/g;
        const letRegex = /let\s+(\w+)\s*=\s*(.+?);/g;
        const constRegex = /const\s+(\w+)\s*=\s*(.+?);/g;
        const assignRegex = /(\w+)\s*=\s*(.+?);/g;
        const objectRegex = /(\w+(\.\w+)*)\s*=\s*(.+);/g;
        //#Regex
        const instrumentedCode = code.replace(varRegex, (_match, p1, p2) => {
            return `var ${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(letRegex, (_match, p1, p2) => {
            return `let ${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(constRegex, (_match, p1, p2) => {
            return `const ${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(assignRegex, (_match, p1, p2) => {
            return `${p1} = ${p2}; variables['${p1}'] = ${p1}; updateVariableTracker();`;
        }).replace(objectRegex, (_match, p1, p2, p3) => {
            return `${p1}.${p2} = ${p3}; if (variables['${p1}']) { variables['${p1}'] = ${p1}; } updateVariableTracker();`;
        });
        // Execute the code
        eval(instrumentedCode);
    } catch (e) {
        output.innerText = e.message;
    } finally {
        console.log = originalConsoleLog;
    }
}

//In-page debug.
function debugCode() {
    var code = document.getElementById('codeInput').value
    console.log('Debugging code:')
    console.log("ToDo, sorry.");
}