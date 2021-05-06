const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

// Connection Properties
const connectionProperties = {
    host: "localhost",
    port: 1996,
    user: "root",
    password: "password",
    database: "employees_DB"
}

// Initial Prompt 
const startApp = () => {
    inquirer.prompt({
        name: 'menuChoice',
        type: 'list',
        message: 'Select an option',
        choices: startScreen
    }
}