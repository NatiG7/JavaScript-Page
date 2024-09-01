# JavaScript Project Page

![GitHub license](https://img.shields.io/github/license/NatiG7/JavaScript-Page)
![GitHub issues](https://img.shields.io/github/issues/NatiG7/JavaScript-Page)
![GitHub stars](https://img.shields.io/github/stars/NatiG7/JavaScript-Page)
![GitHub forks](https://img.shields.io/github/forks/NatiG7/JavaScript-Page)

This repository contains a collection of JavaScript projects that showcase various features and functionalities in web development. Each project is organized in its own directory with relevant HTML, CSS, and JavaScript files.

## Table of Contents

- [Usage](#usage)
  ```
  Each project in this repository is a standalone example of JavaScript functionality.
  To use or view a specific project:

    Navigate to the js_Projects folder.
    Open the corresponding HTML file in a browser, or integrate the JavaScript code into your own projects.
  ```
- [Examples](#examples)
  ### Decimal to Binary
  ```
  function decimalToBinary(decimal) {
    let binary = '';
    while (decimal > 0) {
        binary = (decimal % 2) + binary;
        decimal = Math.floor(decimal / 2);
    }
    return binary;
  }
  ```
  ### Healthpoint Tracker
  ```
  let healthPoints = 100;

  function decreaseHealth(damage) {
      healthPoints -= damage;
      if (healthPoints < 0) healthPoints = 0;
      return healthPoints;
  }
  
  function increaseHealth(heal) {
      healthPoints += heal;
      if (healthPoints > 100) healthPoints = 100;
      return healthPoints;
  }
  ```
  ### Experience Calculator
  ```
  let xp = 0;

  function gainXP(points) {
      xp += points;
      return xp;
  }
  
  function levelUp() {
      let level = Math.floor(xp / 100);
      return `Congratulations! You've reached level ${level}`;
  }
  ```
- [Contributing](#contributing)
  ### Contributions are welcome! Please open an issue or submit a pull request with your improvements.
- [License](#license)
  ### This project is licensed under the MIT License - see the LICENSE file for details.
