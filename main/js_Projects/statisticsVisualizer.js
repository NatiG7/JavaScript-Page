"use strict";

//Light/Dark Theme
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeToggleButton = document.querySelector('.theme-toggle');
    themeToggleButton.textContent = document.body.classList.contains('light-theme')
        ? 'Switch to Dark Theme'
        : 'Switch to Light Theme';
    updateGraph(data); // Use the updated data
}

const getBarColor = () => {
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    return theme === 'light'
        ? getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
        : getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
}

const getLabelColor = () => {
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    return theme === 'light'
        ? getComputedStyle(document.documentElement).getPropertyValue('--primary-label').trim()
        : getComputedStyle(document.documentElement).getPropertyValue('--secondary-label').trim();
}

// Global data variable
let data = [];

//#region Main calculation

const calculate = () => {
    const value = document.querySelector("#numbers").value;
    const array = value.split(/,\s*/g);
    const numbers = array.map(el => Number(el)).filter(el => !isNaN(el));

    const mean = getMean(numbers);
    const median = getMedian(numbers);
    const mode = getMode(numbers);
    const range = getRange(numbers);
    const variance = getVariance(numbers);
    const standardDeviation = getStandardDeviation(numbers);

    document.querySelector("#mean").textContent = mean;
    document.querySelector("#median").textContent = median;
    document.querySelector("#mode").textContent = mode;
    document.querySelector("#range").textContent = range;
    document.querySelector("#variance").textContent = variance;
    document.querySelector("#standardDeviation").textContent = standardDeviation;

    // Data for D3
    // Handling for multiple modes
    const validMode = Array.isArray(mode) ? mode[0] : mode;
    data = [
        { stat: "Mean", value: mean },
        { stat: "Median", value: median },
        { stat: "Mode", value: validMode },
        { stat: "Range", value: range },
        { stat: "Variance", value: variance },
        { stat: "Standard Deviation", value: standardDeviation }
    ];
    updateGraph(data);
}

// Graphs Visualization

const margin = { top: 30, right: 30, bottom: 40, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Scales

const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .range([height, 0]);

// Initialize the graph container and axes
const svg = d3.select("#graphContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const updateGraph = (data) => {
    // Check data existence and validity
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Data is either undefined or empty.");
        return; // Exit the function if data is invalid
    }
    
    // Set up SVG container and scales if not already done
    let svg = d3.select("#graphContainer svg");
    if (svg.empty()) {
        svg = d3.select("#graphContainer")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    // Prepare data with mode handling
    const modeData = Array.isArray(data.find(d => d.stat === "Mode").value)
        ? data.find(d => d.stat === "Mode").value.map(v => ({ stat: `Mode: ${v}`, value: v }))
        : [{ stat: "Mode", value: data.find(d => d.stat === "Mode").value }];

    // Combine mode data with other stats
    const combinedData = data.filter(d => d.stat !== "Mode").concat(modeData);

    // Update scales
    x.domain(combinedData.map(d => d.stat));
    y.domain([0, d3.max(combinedData, d => d.value) * 1.1]);

    // Select and update bars
    const bars = svg.selectAll(".bar")
        .data(combinedData, d => d.stat);

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.stat))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", getBarColor) // Use function to get color
        .merge(bars)  // Merge new and existing bars
        .transition()
        .duration(500)
        .attr("x", d => x(d.stat))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", getBarColor);

    bars.exit().remove(); // Remove old bars if necessary

    // Update labels
    const labels = svg.selectAll("bar-label")
        .data(combinedData, d => d.stat);

    // Enter and append new labels
    labels.enter().append("text")
        .attr("id", "bar-label")
        .attr("x", d => x(d.stat) + x.bandwidth() / 2)
        .attr("y", d => Math.max(y(d.value) - 5, margin.top)) // Ensure label is within SVG and has space above
        .attr("text-anchor", "middle")
        .text(d => d.value.toFixed(2)) // Limit decimal places
        .attr("fill", getLabelColor)
        .merge(labels)  // Merge new and existing labels
        .transition()
        .duration(500)
        .attr("x", d => x(d.stat) + x.bandwidth() / 2)
        .attr("y", d => Math.max(y(d.value) - 5, margin.top)) // Ensure label is within SVG and has space above
        .text(d => d.value.toFixed(2)); // Limit decimal places

    // Remove old labels
    labels.exit().remove();

    // Update X-Axis
    svg.select(".x-axis").remove(); // Remove previous axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Update Y-Axis
    svg.select(".y-axis").remove(); // Remove previous axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
};
//#endregion

//#region  Getters
const getMean = (array) => array.reduce((acc, el) => acc + el, 0) / array.length;

const getMedian = (array) => {
    const sorted = array.slice().sort((a, b) => a - b);
    return array.length % 2 === 0
        ? getMean([sorted[array.length / 2], sorted[array.length / 2 - 1]])
        : sorted[Math.floor(array.length / 2)];
}

const getMode = (array) => {
    const counts = {};
    array.forEach((el) => {
        counts[el] = (counts[el] || 0) + 1;
    });
    const highestFreq = Math.max(...Object.values(counts));
    // If all frequencies are the same, return an empty array
    if (new Set(Object.values(counts)).size === 1) {
        return [];
    }
    // Get all modes and sort them
    return Object.keys(counts)
        .filter(el => counts[el] === highestFreq)
        .map(Number)
        .sort((a, b) => a - b);
};

const getRange = (array) => Math.max(...array) - Math.min(...array);

const getVariance = (array) => {
    const mean = getMean(array);
    return array.reduce((acc, el) => {
        const difference = el - mean;
        return acc + difference ** 2;
    }, 0) / array.length;
}

const getStandardDeviation = (array) => Math.sqrt(getVariance(array));
//#endregion


