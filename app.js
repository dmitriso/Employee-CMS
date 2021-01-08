const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const _ = require('lodash');

//CONNECTING TO THE DATABASE
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Dmso0929',
  database: 'employeecms_db',
});
//CONFIRMS IF CONNECTION WAS SUCCESSFUL OR NOT
connection.connect((err) => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  init();
});

//INQUIRER PROMPT TO GENERATE QUESTIONS IN THE CLI
function init() {
  inquirer.prompt([{
    type: 'list',
    name: 'start',
    message: 'What would you like to do?',
    choices: [
      'View Employees',
      'View Roles',
      'View Departments',
      'Add Employee',
      'Add Role',
      'Add Department',
      'Update Employee Role',
      'Exit'
    ]
  }]).then((data) => {
    //THIS CALLS THE CORRESPONDING METHOD TO THE A SELECTED CHOICE
    switch (data.start) {
      case 'Add Employee':
        addEmployee();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'View Employees':
        viewEmployees();
        break;
      case 'View Roles':
        viewRoles();
        break;
      case 'View Departments':
        viewDepartments();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
    }
  })
}

//THIS DISPLAYS A TABLE OF ALL THE EMPLOYEES FIRST AND LAST NAMES, ROLES, DEPARTMENTS, SALARIES
function viewEmployees() {
  console.log('Showing All Employees...\n');
  var query = "SELECT employees.first_name, employees.last_name, roles.title, departments.name, roles.salary ";
  query += "FROM departments INNER JOIN roles ON roles.department_id = departments.id ";
  query += "INNER JOIN employees ON employees.role_id = roles.id;"
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
}

// THIS DISPLAYS A TABLE OF ALL ROLES TO THE CONSOLE
function viewRoles() {
  console.log('Showing All Roles...\n');
  connection.query("SELECT roles.title,roles.salary FROM roles", (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
}

// THIS DISPLAYS A TABLE OF ALL DEPARTMENTS TO THE CONSOLE
function viewDepartments() {
  console.log('Showing All Departments...\n');
  connection.query("SELECT departments.name FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
}

// THIS PROMPTS THE USER FOR INFORMATION TO ADD A NEW ROLE TO THE TABLE
function addRole() {
  console.log('You chose to add a new role!');
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: 'input',
        name: 'role_title',
        message: 'What is the name of this new role?'
      },
      {
        type: 'input',
        name: 'role_salary',
        message: 'What is the average salary of this new role?'
      },
      {
        type: 'rawlist',
        name: 'role_department',
        choices: function (value) {
          let choiceArr = [];
          console.log(res);
          for (var i = 0; i < res.length; i++) {
            choiceArr.push({ name: res[i].name, value: res[i].id });
          }
          return choiceArr;
        },
        message: 'What department does this role belong too?'
      }
    ]).then((res) => {
      connection.query("INSERT INTO roles SET ?",
        {
          title: res.role_title,
          salary: res.role_salary,
          department_id: res.role_department
        },
        (err, res) => {
          if (err) throw err;
          console.log("New Role Added To Database!");
          init();
        });
    });
  })
}

// THIS PROMPTS THE USER FOR THE NAME OF THE NEW DEPARTMENT TO BE ADDED TO THE DATABASE
function addDepartment() {
  console.log("You chose to add a new department!");
  inquirer.prompt([
    {
      type: 'input',
      name: 'new_department',
      message: 'What is the name of the department you would like to create?'
    }
  ]).then((res) => {
    connection.query("INSERT INTO departments SET ?",
      {
        name: res.new_department
      },
      (err, res) => {
        if (err) throw err;
        console.log("New Department Added To Database!");
        init();
      });
  });
}

// THIS PROMPTS USER FOR INFORMATION TO CREATE A NEW EMPLOYEE AND ADD TO THE DATABASE
function addEmployee() {
  console.log("You Chose To Add A New Employee")
  connection.query("SELECT * FROM roles ORDER BY id", async function (err, res) {
    console.table(res);
    const roles = _.map(res, _.iteratee('id'));
    inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?",
      },
      {
        type: 'rawlist',
        name: 'employee_role',
        choices: roles,
        message: 'What role would you like to give this employee?'
      }
    ]).then((response) => {
      connection.query("SELECT employees.first_name, employees.last_name, employees.id FROM employees ORDER BY id", function (err, resp) {
        console.table(resp);
        const managers = _.map(res, _.iteratee('id'));
        inquirer.prompt([
          {
            type: 'rawlist',
            name: 'manger_id',
            choices: managers,
            message: "Who manages this employee?"
          }
        ]).then((respond) => {
          connection.query("INSERT INTO employees SET ?", {
            first_name: response.first_name,
            last_name: response.last_name,
            role_id: response.employee_role,
            manager_id: respond.manager_id
          },
            function (err, res) {
              if (err) throw err;
              console.log("New Employees Has Been Added to the Database!")
              init();
            })
        })
      })
    })
  })
}

// THIS PROMPTS THE USER TO SELECT AN EMPLOYEE TO CHANGE THEIR ROLE
function updateEmployeeRole() {
  connection.query("SELECT employees.first_name, employees.last_name, employees.id FROM employees", function (err, res) {
    console.table(res);
    const employee = _.map(res, _.iteratee('id'));
    inquirer.prompt([{
      type: 'rawlist',
      name: 'selected_employee',
      choices: employee,
      message: "Which employee"
    }]).then((response) => {
      console.log(response);
      connection.query("SELECT * FROM roles", (err, res) => {
        console.table(res);
        const roles = _.map(res, _.iteratee('id'));
        inquirer.prompt([{
          type: 'rawlist',
          name: 'role_id',
          choices: roles,
          message: "What is the new role you would like to give this employee?"
        }]).then((res) => {
          connection.query("UPDATE employees SET ? WHERE ?",
            [{
              role_id: res.role_id
            },
            {
              id: response.selected_employee
            }],
            function (err, res) {
              if (err) throw err;
              console.log("This employees role has been changed!");
              init();
            })
        })
      })
    })
  })
}