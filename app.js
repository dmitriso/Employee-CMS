const mysql = require('mysql');
const inquirer = require('inquirer');

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
      ]}]).then((data) => {
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



function viewEmployees() {
  console.log('Showing All Employees...\n');
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

function viewRoles() {
  console.log('Showing All Roles...\n');
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

function viewDepartments() {
  console.log('Showing All Departments...\n');
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}