// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

// Connection Properties
const connection = mysql.createConnection({
    host: "localhost",
    port: 1996,
    user: "root",
    password: "password",
    database: "employees_DB"
});

connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startPrompt();
});


// Initial Prompt 
const startApp = () => {
    inquirer.prompt({
        name: 'menuChoice',
        type: 'list',
        message: 'Select an option',
        choices: startScreen
    }
};