const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

// Initial Prompt 
const startApp = () => {
    inquirer.prompt({
        name: 'menuChoice',
        type: 'list',
        message: 'Select an option',
        choices: startScreen
    }
}