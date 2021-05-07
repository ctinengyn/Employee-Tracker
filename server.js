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

// Establishing Connection to database
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startPrompt();
});

// Prompt user to choose an option
const startPrompt = () => {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees By Role",
            "View All Employees By Departments",
            "Update Employee",
            "Add Employee",
            "Add Role",
            "Add Department"
        ]
    }
};