// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

// Connection Properties
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_trackerdb",
});

// Establishing Connection to database
connection.connect(function (err) {
  if (err) throw err;
  console.log("App listening on PORT" + connection.threadId);
  startPrompt();
});

// Prompt user to choose an option
const startPrompt = () => {
  inquirer
    .prompt([
      {
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Update Employee Role",
        "Add Employee",
        "Add Role",
        "Add Department"
      ]
      }
    ])
    .then((answer) => {
      // Switch case depending on user option
      switch (answer.choice) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;
      }
    });
};

// View all employess
function viewAllEmployees() {
  // Query to view all employees
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS departments, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on roles.id = employees.role_id LEFT JOIN departments ON departments.id = roles.department_id LEFT JOIN employees manager ON manager.id = employees.manager_id",

    // Query from connection
    function (err, res) {
      if (err) throw err;

      // Display query results using console.table
      console.table(res);
      startPrompt();
    }
  );
}

// View all roles
function viewAllRoles() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
}

// View all employees by department
function viewAllDepartments() {
  connection.query(
    "SELECT * FROM departments",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompt();
    }
  );
}

// Add Employee
function addEmployee() {
  inquirer
    .prompt([
      // Prompt user of their first name
      {
        name: "firstName",
        type: "input",
        message: "Enter their first name ",
      },

      // Prompt user of their last name
      {
        name: "lastName",
        type: "input",
        message: "Enter their last name ",
      },

      // Prompt user of their role
      {
        name: "roleId",
        type: "input",
        message: "Enter employees role ID "
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId
        },
        function (err) {
          if (err) throw err;
          console.table(answer);
          startPrompt();
        }
      );
    });
}

// Update Employee Role
function updateEmployeeRole() {
      inquirer
        .prompt([
          {
            // Prompt user to select employee
            name: "employeeId",
            type: "input",
            message: "Enter employees ID",
          },
          {
            // Select role to update employee
            name: "newId",
            type: "input",
            message: "Enter the new role ID for employee",
          },
        ])
        .then(function (answer) {
          // Get ID of role selected
          connection.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [answer.newId, answer.employeeId], 
            function (err) {
              if (err) throw err;
              console.table(answer);
              startPrompt();
            }
          );
        });
    }

// Add Employee Role
function addRole() {
      inquirer
        .prompt([
          // Promt user role title
          {
            name: "title",
            type: "input",
            message: "What is the employees role?",
          },

          // Promt user for salary
          {
            name: "salary",
            type: "input",
            message: "What is the employees salary?",
          },
          {
            name: "departmentId",
            type: "input",
            message: "Enter employees department ID"
          }
        ])
        .then(function (answer) {
          connection.query(
            "INSERT INTO roles SET ?",
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.departmentId,
            },
            function (err) {
              if (err) throw err;
              console.table(answer);
              startPrompt();
            }
          );
        });
    }

// Add Department
function addDepartment() {
  // Prompt user for name of department
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "Enter department name",
      },
    ])
    .then(function (answer) {
      // Add department to the table
      var query = connection.query(
        "INSERT INTO departments SET ? ",
        {
          department_name: answer.newDepartment,
        },
        function (err) {
          if (err) throw err;
          console.table(answer);
          startPrompt();
        }
      );
    });
}
