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
        "Update Employee",
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

        case "Update Employee":
          updateEmployee();
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
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department_id, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles on roles.id = employees.role_id INNER JOIN departments on departments.id = roles.department_id left join employees e on employees.manager_id = e.id;",

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

// Update Employee
function updateEmployee() {
  connection.query(
    "SELECT employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;",
    function (err, res) {
      // console.log(res)
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            // Prompt user to select employee
            name: "lastName",
            type: "rawlist",
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            // Select role to update employee
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole(),
          },
        ])
        .then(function (val) {
          // Get ID of role selected
          var roleId = selectRole().indexOf(val.role) + 1;
          connection.query(
            "UPDATE employees SET WHERE ?",
            {
              last_name: val.lastName,
            },
            {
              role_id: roleId,
            },
            function (err) {
              if (err) throw err;
              console.table(val);
              startPrompt();
            }
          );
        });
    }
  );
}

var managersArr = [];
function selectManager() {
  connection.query(
    "SELECT first_name, last_name FROM employees WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name);
      }
    }
  );
  return managersArr;
}

// Add Employee Role
function addRole() {
  connection.query(
    "SELECT roles.title AS Title, roles.salary AS Salary FROM roles",
    function (err, res) {
      inquirer
        .prompt([
          // Promt user role title
          {
            name: "Title",
            type: "input",
            message: "What is the roles Title?",
          },

          // Promt user for salary
          {
            name: "Salary",
            type: "input",
            message: "What is the Salary?",
          },
        ])
        .then(function (res) {
          connection.query(
            "INSERT INTO roles SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function (err) {
              if (err) throw err;
              console.table(res);
              startPrompt();
            }
          );
        });
    }
  );
}

// Add Department
function addDepartment() {
  // Prompt user for name of department
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?",
      },
    ])
    .then(function (res) {
      // Add department to the table
      var query = connection.query(
        "INSERT INTO department SET ? ",
        {
          name: res.name,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          startPrompt();
        }
      );
    });
}
